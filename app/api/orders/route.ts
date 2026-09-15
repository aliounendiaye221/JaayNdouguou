import { NextRequest, NextResponse } from 'next/server';
import { prisma, getDbInfo } from '@/app/utils/prisma';
import { sendOrderConfirmationEmail } from '@/app/utils/email';
import {
    initiateWavePayment,
    initiateOrangeMoneyPayment,
} from '@/app/utils/payment';
import { z } from 'zod';
import { auth } from '@/auth';
import { products as catalogProducts } from '@/app/data/products';
import { getStoreConfig, ensureProductsInitialized } from '@/app/utils/storeConfig';

// Force pas de cache pour les commandes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fonction utilitaire pour retry avec backoff exponentiel
async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            console.error(`Tentative ${i + 1}/${maxRetries} échouée:`, error);
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
            }
        }
    }
    throw lastError;
}

// Schéma de validation de la commande
const orderSchema = z.object({
    customerInfo: z.object({
        firstName: z.string().min(1, 'Le prénom est requis'),
        lastName: z.string().min(1, 'Le nom est requis'),
        email: z.string().email('Email invalide').optional().or(z.literal('')),
        phone: z.string().min(8, 'Numéro de téléphone requis'),
    }),
    deliveryInfo: z.object({
        address: z.string().min(3, 'L\'adresse de livraison est requise'),
        city: z.string().min(2, 'La ville est requise'),
        phone: z.string().min(8, 'Le téléphone de livraison est requis'),
        notes: z.string().optional().nullable(),
    }),
    items: z.array(
        z.object({
            productId: z.string().min(1),
            quantity: z.number().int().positive('La quantité doit être supérieure à 0'),
            // Les champs suivants sont informatifs depuis le client,
            // les prix officiels et noms sont TOUJOURS résolus côté serveur
            name: z.string().optional(),
            price: z.number().optional(),
            unit: z.string().optional(),
        })
    ).min(1, 'Votre panier est vide'),
    paymentMethod: z.enum(['cod', 'wave', 'orange-money']),
});

export async function POST(request: NextRequest) {
    const requestId = `ORD-${Date.now().toString(36)}`;
    const dbInfo = getDbInfo();
    console.log(`📥 [PUBLIC/ORDERS] ${requestId} - Nouvelle commande`);

    try {
        const body = await request.json();
        const validatedData = orderSchema.parse(body);
        const { customerInfo, items, paymentMethod, deliveryInfo } = validatedData;

        // 1. Initialiser les produits en base si nécessaire
        await ensureProductsInitialized();

        // 2. Récupérer les paramètres de la boutique (frais livraison, seuil, état boutique)
        const storeConfig = await getStoreConfig();
        if (!storeConfig.storeOpen) {
            return NextResponse.json(
                { error: 'La boutique est actuellement fermée pour maintenance ou inventaire. Veuillez réessayer plus tard.' },
                { status: 403 }
            );
        }

        // 3. Validation stricte des produits, des prix et des stocks CÔTÉ SERVEUR
        const validatedItems: Array<{
            productId: string;
            name: string;
            unit: string;
            price: number;
            quantity: number;
            dbProduct: any;
        }> = [];

        for (const item of items) {
            // Recherche en base de données
            let product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            // Repli vers le catalogue statique si le produit n'a pas encore été migré
            if (!product) {
                const catalogProd = catalogProducts.find(p => p.id === item.productId);
                if (catalogProd) {
                    product = await prisma.product.create({
                        data: {
                            id: catalogProd.id,
                            name: catalogProd.name,
                            price: catalogProd.price,
                            unit: catalogProd.unit,
                            image: catalogProd.image || '',
                            category: catalogProd.category || 'Général',
                            description: catalogProd.description || '',
                            stock: 100,
                            isAvailable: true,
                        },
                    });
                }
            }

            if (!product) {
                return NextResponse.json(
                    { error: `Le produit sélectionné (${item.productId}) n'existe plus au catalogue.` },
                    { status: 400 }
                );
            }

            if (!product.isAvailable) {
                return NextResponse.json(
                    { error: `Le produit "${product.name}" est actuellement indisponible.` },
                    { status: 400 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Stock insuffisant pour "${product.name}". Seulement ${product.stock} ${product.unit} disponible(s).` },
                    { status: 400 }
                );
            }

            // PRIX OFFICIEL CERTIFIÉ SERVEUR (Protection anti-falsification)
            validatedItems.push({
                productId: product.id,
                name: product.name,
                unit: product.unit,
                price: product.price,
                quantity: item.quantity,
                dbProduct: product,
            });
        }

        // 4. Calcul authentifié des montants
        const subtotal = validatedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const deliveryFee = subtotal >= storeConfig.freeDeliveryThreshold ? 0 : storeConfig.deliveryFee;
        const total = subtotal + deliveryFee;

        // 5. Générer le numéro de commande
        const orderNumber = `JN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // 6. Gestion du paiement
        let paymentId: string | undefined;
        let paymentStatus = 'pending';

        if (paymentMethod === 'wave') {
            const waveResult = await initiateWavePayment({
                amount: total,
                currency: 'XOF',
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customerPhone: customerInfo.phone,
                orderNumber,
            });

            if (waveResult.success) {
                paymentId = waveResult.transactionId;
                paymentStatus = 'pending';
            } else {
                return NextResponse.json(
                    { error: 'Échec de l\'initialisation du paiement Wave', details: waveResult.error },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'orange-money') {
            const omResult = await initiateOrangeMoneyPayment({
                amount: total,
                currency: 'XOF',
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customerPhone: customerInfo.phone,
                orderNumber,
            });

            if (omResult.success) {
                paymentId = omResult.transactionId;
                paymentStatus = 'pending';
            } else {
                return NextResponse.json(
                    { error: 'Échec de l\'initialisation du paiement Orange Money', details: omResult.error },
                    { status: 400 }
                );
            }
        }

        // Nettoyage et formatage du téléphone
        const cleanPhone = customerInfo.phone.replace(/\s+/g, '');
        // Email client : réel si fourni, sinon identifiant interne propre
        const isRealEmail = customerInfo.email &&
            !customerInfo.email.endsWith('.local') &&
            !customerInfo.email.endsWith('@jaayndougou.sn') &&
            customerInfo.email.includes('@');

        const customerEmail = isRealEmail
            ? customerInfo.email!.trim().toLowerCase()
            : `${cleanPhone}@client.local`;

        // 7. Sauvegarder la commande et décrémenter le stock dans une transaction avec retry
        const newOrder = await retryOperation(async () => {
            // Trouver ou créer le client
            let customer = await prisma.customer.findUnique({
                where: { email: customerEmail },
            });

            if (!customer) {
                // Tentative par téléphone si présent
                const existingByPhone = await prisma.customer.findFirst({
                    where: { phone: cleanPhone },
                });

                if (existingByPhone) {
                    customer = existingByPhone;
                } else {
                    customer = await prisma.customer.create({
                        data: {
                            firstName: customerInfo.firstName,
                            lastName: customerInfo.lastName,
                            email: customerEmail,
                            phone: cleanPhone,
                            address: deliveryInfo.address,
                            city: deliveryInfo.city,
                        },
                    });
                }
            }

            // Transaction Prisma : Décrémenter le stock de chaque produit et enregistrer la commande
            return await prisma.$transaction(async (tx) => {
                // Décrémenter les stocks
                for (const item of validatedItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }

                // Créer la commande
                const createdOrder = await tx.order.create({
                    data: {
                        orderNumber,
                        customerId: customer.id,
                        deliveryAddress: deliveryInfo.address,
                        deliveryCity: deliveryInfo.city,
                        deliveryPhone: deliveryInfo.phone,
                        deliveryNotes: deliveryInfo.notes || '',
                        paymentMethod,
                        paymentStatus,
                        paymentId,
                        subtotal,
                        deliveryFee,
                        total,
                        items: {
                            create: validatedItems.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price, // Prix vérifié serveur
                            })),
                        },
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });

                return createdOrder;
            });
        }, 3, 1000);

        console.log(`✅ [PUBLIC/ORDERS] ${requestId} - Commande ${orderNumber} créée (${total} FCFA)`);

        // 8. Envoi de l'email de confirmation UNIQUEMENT si une véritable adresse email a été fournie
        if (isRealEmail && customerInfo.email) {
            try {
                await sendOrderConfirmationEmail(customerInfo.email, {
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    orderNumber: orderNumber,
                    orderItems: validatedItems.map(i => ({
                        name: i.name,
                        quantity: i.quantity,
                        price: i.price,
                        unit: i.unit,
                    })),
                    subtotal,
                    deliveryFee,
                    total,
                    deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}`,
                    paymentMethod,
                });
            } catch (emailError) {
                console.warn('⚠️ L\'email de confirmation n\'a pas pu être envoyé:', emailError);
            }
        }

        return NextResponse.json({
            success: true,
            order: {
                id: newOrder.id,
                orderNumber: newOrder.orderNumber,
                subtotal: newOrder.subtotal,
                deliveryFee: newOrder.deliveryFee,
                total: newOrder.total,
                status: newOrder.status,
                paymentStatus: newOrder.paymentStatus,
                createdAt: newOrder.createdAt,
            },
            message: 'Commande enregistrée avec succès ✅',
        });

    } catch (error) {
        console.error('Error creating order:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données de commande invalides', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Échec de l\'enregistrement de la commande' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');
        const session = await auth();

        if (orderNumber) {
            // Consultation d'une commande spécifique
            const order = await prisma.order.findUnique({
                where: { orderNumber },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    unit: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!order) {
                return NextResponse.json(
                    { error: 'Commande introuvable' },
                    { status: 404 }
                );
            }

            // Si l'utilisateur est admin authentifié, retourner tous les détails
            if (session) {
                return NextResponse.json({ order });
            }

            // PROTECTION PII (Données Personnelles) :
            // Pour les visiteurs publics (suivi de commande), ne pas exposer le téléphone, l'adresse exacte ni l'email
            const safeOrder = {
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                subtotal: order.subtotal,
                deliveryFee: order.deliveryFee,
                total: order.total,
                createdAt: order.createdAt,
                customer: {
                    firstName: order.customer.firstName,
                },
                items: order.items.map(item => ({
                    id: item.id,
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            return NextResponse.json({ order: safeOrder });
        } else {
            // Liste complète des commandes : réservée aux administrateurs authentifiés
            if (!session) {
                return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
            }

            const orders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return NextResponse.json({ orders });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Échec de la récupération des commandes' },
            { status: 500 }
        );
    }
}

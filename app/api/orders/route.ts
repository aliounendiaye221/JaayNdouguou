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

// Validation schema
const orderSchema = z.object({
    customerInfo: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(8),
    }),
    deliveryInfo: z.object({
        address: z.string().min(5),
        city: z.string().min(2),
        phone: z.string().min(8),
        notes: z.string().optional(),
    }),
    items: z.array(
        z.object({
            productId: z.string(),
            name: z.string(),
            quantity: z.number().positive(),
            price: z.number().positive(),
            unit: z.string(),
        })
    ).min(1),
    paymentMethod: z.enum(['cod', 'wave', 'orange-money']),
});

export async function POST(request: NextRequest) {
    const requestId = `ORD-${Date.now().toString(36)}`;
    
    // Log de traçabilité DB au début de chaque requête
    const dbInfo = getDbInfo();
    console.log(`📥 [PUBLIC/ORDERS] ${requestId} - Nouvelle commande`);
    console.log(`🔌 [PUBLIC/ORDERS] ${requestId} - DB: ${dbInfo.main?.host} (${dbInfo.vercelEnv})`);
    
    try {
        const body = await request.json();

        // Validate request body
        const validatedData = orderSchema.parse(body);
        const { customerInfo, items, paymentMethod, deliveryInfo } = validatedData;

        // Calculate totals
        const subtotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const deliveryFee = subtotal >= 10000 ? 0 : 1500; // Free delivery over 10,000 FCFA
        const total = subtotal + deliveryFee;

        // Generate order number
        const orderNumber = `JN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Handle payment processing
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
                // If NO API KEY (Manual Mode), keep status PENDING for verification
                if (!process.env.WAVE_API_KEY) {
                    paymentStatus = 'pending';
                } else if (process.env.NODE_ENV !== 'production') {
                    // Dev simulation with keys? mark paid. 
                    // But usually dev doesn't have keys. 
                    // Let's assume without keys = manual transfer = pending
                    paymentStatus = 'pending';
                } else {
                    // Production with keys, and success returned -> likely initiated, wait for webhook
                    // But initiation success doesn't mean paid yet.
                    paymentStatus = 'pending';
                }
            } else {
                return NextResponse.json(
                    { error: 'Payment initiation failed', details: waveResult.error },
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
                // Manual mode: Pending verification
                if (!process.env.ORANGE_MONEY_API_KEY) {
                    paymentStatus = 'pending';
                }
            } else {
                return NextResponse.json(
                    { error: 'Payment initiation failed', details: omResult.error },
                    { status: 400 }
                );
            }
        } else {
            // Cash on delivery
            paymentStatus = 'pending';
        }

        // Sauvegarder en base de données avec retry automatique
        let order;
        let dbError = null;
        
        try {
            order = await retryOperation(async () => {
                // Create or find customer
                let customer = await prisma.customer.findUnique({
                    where: { email: customerInfo.email },
                });

                if (!customer) {
                    customer = await prisma.customer.create({
                        data: {
                            firstName: customerInfo.firstName,
                            lastName: customerInfo.lastName,
                            email: customerInfo.email,
                            phone: customerInfo.phone,
                            address: deliveryInfo.address,
                            city: deliveryInfo.city,
                        },
                    });
                }

                // S'assurer que les produits existent en base (upsert depuis le catalogue statique)
                for (const item of items) {
                    const catalogProduct = catalogProducts.find(p => p.id === item.productId);
                    await prisma.product.upsert({
                        where: { id: item.productId },
                        update: { price: item.price },
                        create: {
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            unit: item.unit,
                            image: catalogProduct?.image || '',
                            category: catalogProduct?.category || 'Général',
                            description: catalogProduct?.description || '',
                        },
                    });
                }

                const newOrder = await prisma.order.create({
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
                            create: items.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                        },
                    },
                    include: {
                        items: true,
                    },
                });
                
                return newOrder;
            }, 3, 1000); // 3 tentatives avec délai exponentiel
            
            console.log(`✅ [PUBLIC/ORDERS] ${requestId} - Commande ${orderNumber} enregistrée avec succès`);
            console.log(`📊 [PUBLIC/ORDERS] ${requestId} - DB: ${dbInfo.main?.host} | Total: ${total} FCFA`);
            
        } catch (error) {
            console.error(`❌ [PUBLIC/ORDERS] ${requestId} - ERREUR CRITIQUE:`, error);
            dbError = error;
            
            // En cas d'échec critique, on retourne une erreur 500
            return NextResponse.json({
                error: 'Impossible d\'enregistrer la commande',
                details: 'Le serveur rencontre des difficultés. Veuillez réessayer dans quelques instants.',
                orderNumber,
            }, { status: 500 });
        }

        // Envoyer l'email de confirmation (ne pas bloquer si ça échoue)
        try {
            await sendOrderConfirmationEmail(customerInfo.email, {
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                orderNumber: orderNumber,
                orderItems: items,
                subtotal,
                deliveryFee,
                total,
                deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}`,
                paymentMethod,
            });
        } catch (emailError) {
            console.warn('⚠️ L\'email de confirmation n\'a pas pu être envoyé:', emailError);
            // On continue quand même, l'email n'est pas critique
        }

        // Retourne la réponse de succès seulement si la commande est bien enregistrée
        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: orderNumber,
                total: total,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            },
            message: 'Commande enregistrée avec succès ✅'
        });
    } catch (error) {
        console.error('Error creating order:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');

        if (orderNumber) {
            // Get specific order
            const order = await prisma.order.findUnique({
                where: { orderNumber },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!order) {
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ order });
        } else {
            // Get all orders (admin functionality) - Protect this!
            const session = await auth();
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

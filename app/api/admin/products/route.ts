import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { auth } from '@/auth';
import { ensureProductsInitialized } from '@/app/utils/storeConfig';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    price: z.number().positive('Le prix doit être supérieur à 0'),
    unit: z.string().min(1, 'L\'unité est requise'),
    category: z.string().min(1, 'La catégorie est requise'),
    image: z.string().default('/logo.png'),
    stock: z.number().int().min(0, 'Le stock ne peut pas être négatif').default(100),
    isAvailable: z.boolean().default(true),
    description: z.string().optional().nullable(),
});

/**
 * GET: Récupère la liste complète des produits pour l'espace administration
 */
export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await ensureProductsInitialized();

        const products = await prisma.product.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' },
            ],
            include: {
                _count: {
                    select: { orderItems: true },
                },
            },
        });

        const stats = {
            totalProducts: products.length,
            outOfStock: products.filter(p => p.stock <= 0 || !p.isAvailable).length,
            lowStock: products.filter(p => p.stock > 0 && p.stock <= 20 && p.isAvailable).length,
            totalStockValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
        };

        const response = NextResponse.json({ products, stats });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
    } catch (error) {
        console.error('Failed to fetch admin products:', error);
        return NextResponse.json({ error: 'Échec de la récupération des produits' }, { status: 500 });
    }
}

/**
 * POST: Création d'un nouveau produit
 */
export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validated = productSchema.parse(body);

        // Génération d'un ID de slug si non fourni
        const slugId = validated.id || validated.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const newProduct = await prisma.product.create({
            data: {
                id: slugId,
                name: validated.name,
                price: validated.price,
                unit: validated.unit,
                category: validated.category,
                image: validated.image || '/logo.png',
                stock: validated.stock,
                isAvailable: validated.isAvailable,
                description: validated.description || '',
            },
        });

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Échec de la création du produit' }, { status: 500 });
    }
}

/**
 * PUT: Mise à jour rapide (prix, stock, disponibilité, etc.)
 */
export async function PUT(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, price, stock, isAvailable, name, unit, category, image, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'L\'ID du produit est requis' }, { status: 400 });
        }

        const updateData: any = {};
        if (typeof price === 'number') updateData.price = Math.max(0, price);
        if (typeof stock === 'number') updateData.stock = Math.max(0, Math.floor(stock));
        if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
        if (typeof name === 'string') updateData.name = name;
        if (typeof unit === 'string') updateData.unit = unit;
        if (typeof category === 'string') updateData.category = category;
        if (typeof image === 'string') updateData.image = image;
        if (typeof description !== 'undefined') updateData.description = description;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: 'Échec de la mise à jour du produit' }, { status: 500 });
    }
}

/**
 * DELETE: Suppression ou désactivation d'un produit
 */
export async function DELETE(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Vérifier si le produit est lié à des commandes existantes
        const orderItemsCount = await prisma.orderItem.count({
            where: { productId: id },
        });

        if (orderItemsCount > 0) {
            // Désactiver plutôt que supprimer pour préserver l'historique des commandes
            const disabled = await prisma.product.update({
                where: { id },
                data: { isAvailable: false, stock: 0 },
            });
            return NextResponse.json({
                success: true,
                message: 'Le produit a été archivé (désactivé) car il est lié à des commandes existantes.',
                product: disabled,
            });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json({ error: 'Échec de la suppression du produit' }, { status: 500 });
    }
}

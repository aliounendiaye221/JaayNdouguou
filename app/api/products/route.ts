import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { products as fallbackProducts } from '@/app/data/products';
import { ensureProductsInitialized } from '@/app/utils/storeConfig';

export const dynamic = 'force-dynamic';

/**
 * GET: Liste des produits disponibles pour le marché public
 */
export async function GET() {
    try {
        await ensureProductsInitialized();

        const dbProducts = await prisma.product.findMany({
            where: {
                isAvailable: true,
            },
            orderBy: [
                { category: 'asc' },
                { name: 'asc' },
            ],
        });

        if (dbProducts.length > 0) {
            const response = NextResponse.json(dbProducts);
            response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
            return response;
        }

        // Repli catalogue statique si base vide
        return NextResponse.json(fallbackProducts);
    } catch (error) {
        console.warn('⚠️ [PRODUCTS_API] Repli sur le catalogue statique suite à une erreur DB:', error);
        return NextResponse.json(fallbackProducts);
    }
}

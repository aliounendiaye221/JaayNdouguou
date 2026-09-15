import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { products as fallbackProducts } from '@/app/data/products';
import { ensureProductsInitialized } from '@/app/utils/storeConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET: Liste des produits disponibles pour le marché public (Temps réel)
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

        const rawProducts = dbProducts.length > 0 ? dbProducts : fallbackProducts;

        // Garantir que chaque produit renvoyé dispose d'une image valide et nette
        const products = rawProducts.map(p => {
            const catalogItem = fallbackProducts.find(cat => cat.id === p.id);
            let image = p.image;
            if (!image || image.trim() === '' || image === '/logo.png') {
                image = catalogItem?.image || '/hero-vegetables.png';
            }
            if (!image.startsWith('/') && !image.startsWith('http')) {
                image = `/${image}`;
            }
            return {
                ...p,
                image,
            };
        });

        const response = NextResponse.json(products);

        // TEMPS RÉEL : Aucun cache pour refléter instantanément les modifications de prix et stocks
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
    } catch (error) {
        console.warn('⚠️ [PRODUCTS_API] Repli sur le catalogue statique suite à une erreur DB:', error);
        const response = NextResponse.json(fallbackProducts);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        return response;
    }
}

import type { Metadata } from 'next';
import { products } from '@/app/data/products';
import { prisma } from '@/app/utils/prisma';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    // 1. Chercher dans le catalogue statique en premier
    let product = products.find((p) => p.id === id);

    // 2. Si pas trouvé, chercher dans la base de données
    if (!product) {
        try {
            const dbProduct = await prisma.product.findUnique({
                where: { id },
            });
            if (dbProduct) {
                product = {
                    id: dbProduct.id,
                    name: dbProduct.name,
                    price: dbProduct.price,
                    unit: dbProduct.unit,
                    image: dbProduct.image,
                    category: dbProduct.category,
                    description: dbProduct.description || undefined,
                };
            }
        } catch {
            // Repli gracieux
        }
    }

    if (!product) {
        return {
            title: 'Produit | JaayNdougou - Marché Digital Sénégal',
            description: 'Découvrez nos légumes frais du jour livrés rapidement à Dakar et Rufisque.',
        };
    }

    const title = `${product.name} Frais à Dakar | ${product.price} FCFA/${product.unit} | JaayNdougou`;
    const description = `${product.name} local de qualité supérieure. Commandez en ligne à ${product.price} FCFA par ${product.unit}. Livraison express en 2h à Dakar et Rufisque sur JaayNdougou.`;
    const canonicalUrl = `https://jaayndougou.app/products/${product.id}/`;
    const imageUrl = product.image.startsWith('http')
        ? product.image
        : `https://jaayndougou.app${product.image}`;

    return {
        title,
        description,
        keywords: [
            product.name,
            `${product.name} Dakar`,
            `${product.name} Sénégal`,
            `prix ${product.name} Dakar`,
            `acheter ${product.name}`,
            'légumes frais Dakar',
            'JaayNdougou',
            'ndougou en ligne',
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'JaayNdougou',
            locale: 'fr_SN',
            type: 'website',
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 800,
                    alt: `${product.name} frais - JaayNdougou`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

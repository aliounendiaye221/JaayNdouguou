import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Marché en Ligne de Légumes & Fruits Frais à Dakar | JaayNdougou',
    description: 'Commandez vos légumes, tubercules et condiments frais locaux au meilleur prix à Dakar et Rufisque. Livraison rapide à domicile en 2h. Fraîcheur 100% garantie !',
    keywords: [
        'marché légumes Dakar',
        'ndougou en ligne',
        'légumes frais Rufisque',
        'marché digital Sénégal',
        'panier légumes Dakar',
        'oignon carotte pomme de terre Sénégal',
        'livraison légumes Dakar',
    ],
    alternates: {
        canonical: 'https://jaayndougou.app/market/',
    },
    openGraph: {
        title: 'Le Marché Frais en Ligne | JaayNdougou Dakar',
        description: 'Tous vos légumes frais locaux au prix du marché, livrés chez vous en 2h à Dakar et Rufisque.',
        url: 'https://jaayndougou.app/market/',
        siteName: 'JaayNdougou',
        locale: 'fr_SN',
        type: 'website',
        images: [
            {
                url: 'https://jaayndougou.app/hero-vegetables.png',
                width: 1200,
                height: 630,
                alt: 'Marché de légumes frais JaayNdougou',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Marché en Ligne de Légumes Frais à Dakar | JaayNdougou',
        description: 'Commandez vos légumes frais en ligne à Dakar et Rufisque.',
        images: ['https://jaayndougou.app/hero-vegetables.png'],
    },
};

export default function MarketLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

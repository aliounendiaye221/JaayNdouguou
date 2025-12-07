import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Script from "next/script";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "JaayNdougou - Marché Digital de Légumes Frais | Dakar & Rufisque | Légumes Bio Sénégal",
    description: "JaayNdougou, votre marché digital n°1 au Sénégal. Commandez vos légumes frais, bio et locaux en ligne. Livraison rapide à Dakar et Rufisque. Jaay Ndougou, mo yomb, mo gaaw ! Paiement Wave & Orange Money.",
    keywords: ["légumes frais Dakar", "marché en ligne Sénégal", "livraison légumes Rufisque", "JaayNdougou", "e-commerce alimentaire Dakar", "produits frais Sénégal", "légumes bio Sénégal", "ndougou en ligne", "livraison rapide Dakar", "marché digital"],
    authors: [{ name: "ALIOUNE NDIAYE" }],
    creator: "ALIOUNE NDIAYE",
    publisher: "JaayNdougou",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://www.jaayndougou.sn'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'JaayNdougou - Marché Digital de Légumes Frais | Mo Yomb, Mo Gaaw',
        description: 'Commandez vos légumes frais en ligne et faites-vous livrer en 2h à Dakar et Rufisque. Qualité garantie !',
        url: 'https://www.jaayndougou.sn',
        siteName: 'JaayNdougou',
        locale: 'fr_SN',
        type: 'website',
        images: [
            {
                url: '/hero-vegetables.png',
                width: 1200,
                height: 630,
                alt: 'JaayNdougou - Légumes Frais Sénégal',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JaayNdougou - Marché Digital de Légumes Frais',
        description: 'Commandez vos légumes frais en ligne à Dakar et Rufisque. Jaay Ndougou, mo yomb !',
        images: ['/hero-vegetables.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // google: 'your-google-verification-code', // À ajouter après création Google Search Console
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "JaayNdougou",
        "image": "https://www.jaayndougou.sn/hero-vegetables.png",
        "description": "Marché digital de légumes frais à Dakar et Rufisque",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dakar",
            "addressCountry": "SN"
        },
        "telephone": "+221771234567",
        "email": "contact@jaayndougou.sn",
        "priceRange": "400-1000 FCFA",
        "servesCuisine": "Légumes frais",
        "openingHours": "Mo-Sa 08:00-20:00, Su 09:00-18:00",
        "areaServed": ["Dakar", "Rufisque", "Pikine", "Guédiawaye"],
        "paymentAccepted": ["Cash", "Wave", "Orange Money"],
        "currenciesAccepted": "XOF"
    };

    return (
        <html lang="fr">
            <head>
                <Script
                    id="structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </head>
            <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
                <CartProvider>
                    {children}
                    <WhatsAppButton />
                </CartProvider>
            </body>
        </html>
    );
}

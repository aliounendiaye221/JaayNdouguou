import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contactez JaayNdougou | Service Client & Commandes WhatsApp Dakar',
    description: 'Besoin d\'aide pour votre commande de légumes frais ? Contactez le service client JaayNdougou par WhatsApp au +221 78 603 79 13 ou par email. Assistance 7j/7 à Dakar et Rufisque.',
    alternates: {
        canonical: 'https://jaayndougou.app/contact/',
    },
    openGraph: {
        title: 'Contact & Service Client | JaayNdougou Dakar',
        description: 'Contactez-nous pour vos commandes de légumes frais ou partenariats agricoles au Sénégal.',
        url: 'https://jaayndougou.app/contact/',
        siteName: 'JaayNdougou',
        locale: 'fr_SN',
        type: 'website',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

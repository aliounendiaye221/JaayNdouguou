import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'À Propos de JaayNdougou | Révolution de l\'Agriculture Digitale au Sénégal',
    description: 'Découvrez l\'histoire de JaayNdougou, la première plateforme agricole qui connecte directement les producteurs maraîchers sénégalais aux foyers de Dakar et Rufisque.',
    alternates: {
        canonical: 'https://jaayndougou.app/about/',
    },
    openGraph: {
        title: 'À Propos de JaayNdougou | Du Champ à Votre Assiette',
        description: 'La mission de JaayNdougou : rendre les légumes frais accessibles à tous, au juste prix, en soutenant l\'agriculture locale sénégalaise.',
        url: 'https://jaayndougou.app/about/',
        siteName: 'JaayNdougou',
        locale: 'fr_SN',
        type: 'website',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

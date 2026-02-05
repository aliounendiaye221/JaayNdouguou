import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Mentions Légales | JaayNdougou',
    description: 'Informations légales concernant l\'utilisation du site JaayNdougou.',
};

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-3xl mb-6 shadow-sm">
                        <Scale className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Mentions Légales</h1>
                    <p className="text-slate-500 font-medium">Informations obligatoires concernant l'éditeur du site.</p>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-12">

                    {/* Section 1: Éditeur */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                            Éditeur du Site
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-11">
                            <p>Le site <strong>JaayNdougou</strong> est édité par :</p>
                            <ul className="list-none p-0 mt-4 space-y-2">
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Nom / Entreprise :</strong> Alioune Ndiaye
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Adresse :</strong> Dakar, Sénégal
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Email :</strong> contact@jaayndougou.sn
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Téléphone :</strong> +221 78 603 79 13
                                </li>
                            </ul>
                        </div>
                    </section>

                    <div className="h-px bg-slate-50" />

                    {/* Section 2: Hébergement */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                            Hébergement
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-11">
                            <p>Le site est hébergé par :</p>
                            <ul className="list-none p-0 mt-4 space-y-2">
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Hébergeur :</strong> Vercel Inc.
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Adresse :</strong> 340 S Lemon Ave #1192, Walnut, CA 91789, USA
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                                    <strong>Site Web :</strong> vercel.com
                                </li>
                            </ul>
                        </div>
                    </section>

                    <div className="h-px bg-slate-50" />

                    {/* Section 3: Propriété Intellectuelle */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
                            Propriété Intellectuelle
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-11">
                            <p>
                                L'ensemble de ce site, y compris les textes, logos, tableaux, graphiques et images, est protégé par les lois internationales sur la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans l'autorisation préalable de l'éditeur.
                            </p>
                            <p className="mt-4 italic">
                                Le concept de marketplace de produits frais JaayNdougou est une initiative visant à promouvoir le commerce local au Sénégal.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-slate-50" />

                    {/* Section 4: Données Personnelles */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">4</span>
                            Données Personnelles (RGPD / Convention Sénégalise)
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-11">
                            <p>
                                JaayNdougou s'engage à protéger les données personnelles de ses utilisateurs. Les informations collectées lors de la commande (nom, téléphone, adresse) sont uniquement utilisées pour le traitement de la livraison et la communication via WhatsApp.
                            </p>
                            <p className="mt-4">
                                Conformément à la loi sénégalaise relative à la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et d'opposition aux données vous concernant en nous contactant directement par email.
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Back Link */}
            <div className="mt-12 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}

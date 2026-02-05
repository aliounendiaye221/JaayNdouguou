import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, ShoppingBag, Truck, CreditCard, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Conditions Générales de Vente | JaayNdougou',
    description: 'Consultez les conditions générales de vente (CGV) de la boutique en ligne JaayNdougou.',
};

export default function CGVPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-3xl mb-6 shadow-sm">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Conditions Générales de Vente</h1>
                    <p className="text-slate-500 font-medium">Dernière mise à jour : Février 2026</p>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-12">

                    {/* Section 1: Objet */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <ShoppingBag className="w-6 h-6 text-emerald-600" />
                            1. Objet du Service
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>
                                Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes conclues entre <strong>JaayNdougou</strong> et ses clients sur le territoire du Sénégal.
                                JaayNdougou propose un service de vente en ligne et de livraison à domicile de produits alimentaires frais (légumes, fruits, etc.).
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Commande */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <ChevronRight className="w-6 h-6 text-emerald-600" />
                            2. Processus de Commande
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>Le client effectue sa sélection sur le site web. La finalisation de la commande s'effectue via WhatsApp, permettant un contact direct et personnalisé. Une commande est considérée comme définitive dès confirmation par l'un de nos agents sur WhatsApp.</p>
                        </div>
                    </section>

                    {/* Section 3: Prix */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <CreditCard className="w-6 h-6 text-emerald-600" />
                            3. Prix et Paiement
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>Les prix indiqués sur le site sont en FCFA (Franc CFA). Ils peuvent varier en fonction des cours du marché. Les modes de paiement acceptés sont :</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Paiement à la livraison (Cash on Delivery)</li>
                                <li>Wave</li>
                                <li>Orange Money</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Livraison */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <Truck className="w-6 h-6 text-emerald-600" />
                            4. Livraison
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>Les livraisons sont assurées dans les zones de Dakar et Rufisque. Les délais de livraison sont communiqués lors de la confirmation via WhatsApp. JaayNdougou s'efforce de livrer dans les plus brefs délais, généralement entre 2h et 6h selon la zone.</p>
                        </div>
                    </section>

                    {/* Section 5: Retours */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <ShieldAlert className="w-6 h-6 text-emerald-600" />
                            5. Droit de Rétractation et Qualité
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>
                                S'agissant de produits périssables (produits frais), le droit de rétractation classique ne s'applique pas une fois la commande livrée.
                                Cependant, JaayNdougou s'engage sur la qualité. Si un produit est livré endommagé ou non conforme, le client est invité à faire une réclamation immédiate lors de la réception pour un remplacement ou un remboursement.
                            </p>
                        </div>
                    </section>

                    {/* Section 6: Litiges */}
                    <section>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6">
                            <ChevronRight className="w-6 h-6 text-emerald-600" />
                            6. Litiges et Loi Applicable
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed ml-9">
                            <p>Les présentes CGV sont soumises au droit sénégalais. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Dakar seront compétents.</p>
                        </div>
                    </section>

                </div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

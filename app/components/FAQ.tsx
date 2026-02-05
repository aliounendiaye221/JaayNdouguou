"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Comment passer une commande ?",
        answer: "Vous pouvez passer commande directement sur notre site web en ajoutant des produits à votre panier, ou via WhatsApp en cliquant sur le bouton vert en bas à droite de votre écran."
    },
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Nous livrons en moins de 2 heures à Dakar et Rufisque pour toute commande passée avant 18h. Les commandes passées après 18h seront livrées le lendemain matin."
    },
    {
        question: "Quels modes de paiement acceptez-vous ?",
        answer: "Nous acceptons le paiement à la livraison (espèces), Wave, et Orange Money. Vous pouvez choisir votre mode de paiement préféré lors de la commande."
    },
    {
        question: "Les produits sont-ils vraiment frais ?",
        answer: "Absolument ! Tous nos légumes sont cueillis le jour même et livrés directement chez vous. Nous garantissons la fraîcheur et la qualité de tous nos produits."
    },
    {
        question: "Y a-t-il des frais de livraison ?",
        answer: "Les frais de livraison sont de 1500 FCFA. Cependant, la livraison est GRATUITE pour toute commande supérieure à 10,000 FCFA !"
    },
    {
        question: "Puis-je annuler ma commande ?",
        answer: "Oui, vous pouvez annuler votre commande gratuitement tant qu'elle n'a pas encore été préparée. Contactez-nous rapidement via WhatsApp ou par téléphone."
    },
    {
        question: "Livrez-vous dans d'autres villes ?",
        answer: "Actuellement, nous livrons uniquement à Dakar, Rufisque, Pikine et Guédiawaye. Nous prévoyons d'étendre nos services à d'autres villes prochainement."
    },
    {
        question: "Comment garantissez-vous la qualité ?",
        answer: "Nous travaillons directement avec des producteurs locaux de confiance. Chaque produit est vérifié avant livraison. Si vous n'êtes pas satisfait, contactez-nous immédiatement."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent mb-4">
                        Questions Fréquentes
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Tout ce que vous devez savoir sur JaayNdougou
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100">
                    <p className="text-gray-700 mb-4 font-medium">
                        Vous ne trouvez pas la réponse à votre question ?
                    </p>
                    <a
                        href="https://wa.me/221783822380"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Contactez-nous sur WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

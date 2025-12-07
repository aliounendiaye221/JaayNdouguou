"use client";

import { Star, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
    {
        id: 1,
        name: "Fatou Diop",
        location: "Dakar Plateau",
        rating: 5,
        text: "Service excellent ! Les légumes sont toujours frais et la livraison est rapide. Je recommande JaayNdougou à toutes mes amies.",
        avatar: "👩🏿"
    },
    {
        id: 2,
        name: "Mame Cheikh Ciss",
        location: "Rufisque",
        rating: 5,
        text: "Enfin un service de qualité pour acheter des légumes frais sans se déplacer au marché. Les prix sont corrects et la qualité est au rendez-vous.",
        avatar: "👨🏿"
    },
    {
        id: 3,
        name: "Maimouna",
        location: "Pikine",
        rating: 5,
        text: "Très satisfaite ! Commander sur WhatsApp est très pratique. Les produits arrivent bien emballés et frais. Merci JaayNdougou !",
        avatar: "👩🏿‍🦱"
    },
    {
        id: 4,
        name: "Ousmane Ndiaye",
        location: "Guédiawaye",
        rating: 5,
        text: "Service rapide et efficace. Les légumes sont de très bonne qualité. Je commande régulièrement maintenant.",
        avatar: "👨🏿‍🦲"
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent mb-4">
                        Ce que disent nos clients
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Des milliers de clients satisfaits à Dakar et Rufisque
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
                        >
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-emerald-100" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-4xl">{testimonial.avatar}</div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                "{testimonial.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

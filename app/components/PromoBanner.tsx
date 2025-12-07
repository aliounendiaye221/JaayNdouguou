"use client";

import { X, Truck } from "lucide-react";
import { useState } from "react";

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center">
                        <span className="flex p-2 rounded-lg bg-emerald-800">
                            <Truck className="h-5 w-5" />
                        </span>
                        <p className="ml-3 font-medium text-sm sm:text-base">
                            <span className="hidden sm:inline">🎉 Livraison GRATUITE pour toute commande supérieure à 10,000 FCFA</span>
                            <span className="sm:hidden">Livraison GRATUITE +10K FCFA</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

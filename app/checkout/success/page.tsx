"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function CheckoutSuccess() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
                    <p className="text-gray-600 mb-8">
                        Merci pour votre commande. Nous avons bien reçu votre demande et nous la traiterons dans les plus brefs délais.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/market"
                            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-800"
                        >
                            Continuer vos achats
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

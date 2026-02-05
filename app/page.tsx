import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard, { Product } from "./components/ProductCard";
import PromoBanner from "./components/PromoBanner";
import dynamic from 'next/dynamic';
import { products } from "./data/products";
import { ArrowRight, Leaf, Truck, ShieldCheck, TrendingUp } from "lucide-react";

// Lazy load components below the fold
const Testimonials = dynamic(() => import('./components/Testimonials'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
});
const FAQ = dynamic(() => import('./components/FAQ'), {
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
});
const Footer = dynamic(() => import('./components/Footer'));

const featuredProducts = products.slice(0, 4);

export default function Home() {
    return (
        <main className="min-h-screen">
            <PromoBanner />
            <Navbar />
            <Hero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12 animate-fadeInUp">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-emerald-600" />
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
                            Produits en vedette
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Découvrez notre sélection de légumes frais, cultivés localement et livrés directement chez vous
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <ProductCard product={product} priority={index < 4} />
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <a
                        href="/market"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                    >
                        <span>Voir tous les produits</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 mt-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card text-center p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Leaf className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Produits Frais</h3>
                            <p className="text-gray-600 leading-relaxed">Des légumes cueillis le jour même pour garantir une fraîcheur et une qualité exceptionnelles.</p>
                        </div>
                        <div className="glass-card text-center p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Livraison Rapide</h3>
                            <p className="text-gray-600 leading-relaxed">Recevez votre commande en moins de 2 heures partout à Dakar et Rufisque.</p>
                        </div>
                        <div className="glass-card text-center p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Paiement Sécurisé</h3>
                            <p className="text-gray-600 leading-relaxed">Payez en toute sécurité via Wave, Orange Money ou à la livraison.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Testimonials />
            <FAQ />
            <Footer />
        </main>
    );
}

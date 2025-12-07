"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Check, Truck, Shield } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = products.find((p) => p.id === id);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = React.useState(1);

    if (!product) {
        notFound();
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/market"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Retour au marché
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                        {/* Product Image */}
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative group">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                <span className="text-sm font-bold text-emerald-700">{product.category}</span>
                            </div>
                            {/* Quality Badge */}
                            <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-600 rounded-full shadow-lg flex items-center gap-2">
                                <Check className="w-4 h-4 text-white" />
                                <span className="text-sm font-bold text-white">Frais</span>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-4">
                                {product.name}
                            </h1>

                            {/* Rating (placeholder) */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">(4.8 / 5)</span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                        {product.price}
                                    </p>
                                    <span className="text-lg text-gray-600 font-medium">FCFA</span>
                                    <span className="text-sm text-gray-500">/ {product.unit}</span>
                                </div>
                            </div>

                            <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                                <p>{product.description || "Produit frais de qualité supérieure, cultivé localement au Sénégal."}</p>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Livraison</p>
                                        <p className="font-bold text-gray-900 text-sm">En 2h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Qualité</p>
                                        <p className="font-bold text-gray-900 text-sm">Garantie</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-900 mb-3">Quantité</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <span className="px-6 font-bold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total: <span className="font-bold text-emerald-700 text-lg">{product.price * quantity} FCFA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-bold rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent mb-8">
                            Produits similaires
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

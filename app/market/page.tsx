"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

import { products } from "../data/products";

const categories = ["Tout", "Légumes", "Tubercules", "Fruits"];

export default function Market() {
    const [activeCategory, setActiveCategory] = useState("Tout");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "Tout" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 py-16 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 drop-shadow-2xl">
                            Le Marché <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">Frais</span>
                        </h1>
                        <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                            Découvrez notre sélection de légumes frais cultivés localement
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-gray-900 placeholder-gray-500 shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories Filter */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-gray-900">Catégories</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-md ${activeCategory === category
                                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg transform scale-105"
                                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        <span className="font-bold text-emerald-700">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter className="w-4 h-4" />
                        <span>Trié par popularité</span>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <ProductCard product={product} priority={index < 8} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    category?: string;
    description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="glass-card rounded-2xl overflow-hidden group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                {product.category && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{product.category}</span>
                    </div>
                )}

                {/* Quick Add Button (Mobile/Hover) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-white text-emerald-600 rounded-full shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-50"
                    aria-label="Ajouter au panier"
                >
                    <ShoppingBag className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-lg font-heading font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        <Link href={`/products/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{product.unit}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium uppercase">Prix</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-emerald-600">{product.price}</span>
                            <span className="text-xs text-gray-500 font-medium">FCFA</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="relative z-10 p-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

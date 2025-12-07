"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "../data/products";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(products);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === "") {
            setResults(products.slice(0, 6));
        } else {
            const filtered = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase()) ||
                    product.description?.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-fadeInUp">
                    {/* Search Input */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <Search className="h-6 w-6 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher des produits..."
                                className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
                            />
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto p-4">
                        {results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-emerald-600">
                                                {product.price} FCFA
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                par {product.unit}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Aucun produit trouvé pour "{query}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {results.length > 0 && (
                        <div className="p-4 border-t border-gray-200 text-center">
                            <Link
                                href="/market"
                                onClick={onClose}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                            >
                                Voir tous les produits →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

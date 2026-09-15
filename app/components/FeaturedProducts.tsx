"use client";

import { useEffect, useState } from "react";
import ProductCard, { Product } from "./ProductCard";

interface FeaturedProductsProps {
    initialProducts: Product[];
}

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    useEffect(() => {
        const fetchLiveProducts = async () => {
            try {
                const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Mettre à jour les produits vedettes avec les prix et stocks en temps réel
                    setProducts(prev => {
                        return prev.map(p => {
                            const live = data.find((item: any) => item.id === p.id);
                            if (live) {
                                return {
                                    ...p,
                                    price: live.price,
                                    stock: live.stock,
                                    isAvailable: live.isAvailable,
                                    name: live.name || p.name,
                                    unit: live.unit || p.unit,
                                    image: live.image || p.image,
                                    category: live.category || p.category,
                                };
                            }
                            return p;
                        });
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des prix en direct:", error);
            }
        };

        fetchLiveProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <ProductCard product={product} priority={index < 4} />
                </div>
            ))}
        </div>
    );
}

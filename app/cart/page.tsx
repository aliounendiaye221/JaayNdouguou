"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { formatCartForWhatsApp, openWhatsAppWithMessage, WHATSAPP_BUSINESS_NUMBER } from "../utils/whatsapp";

export default function Cart() {
    const { items, removeFromCart, updateQuantity, total } = useCart();

    const handleWhatsAppOrder = () => {
        const message = formatCartForWhatsApp(items, total);
        openWhatsAppWithMessage(WHATSAPP_BUSINESS_NUMBER, message);
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                    <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <ShoppingBag className="w-16 h-16 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Votre panier est vide</h2>
                    <p className="text-gray-600 mb-8 text-lg max-w-md text-center">
                        Découvrez nos produits frais et remplissez votre panier avec le meilleur du marché !
                    </p>
                    <Link
                        href="/market"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Retourner au marché
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-8">
                    Votre Panier
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.id} className="flex p-6 hover:bg-gray-50 transition-colors duration-200">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-6 flex flex-1 flex-col">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">{item.price} FCFA / {item.unit}</p>
                                                </div>
                                                <p className="text-lg font-bold text-emerald-600">{item.price * item.quantity} FCFA</p>
                                            </div>

                                            <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-4 font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-0 lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

                            <div className="flow-root">
                                <dl className="-my-4 divide-y divide-gray-100">
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-600">Sous-total</dt>
                                        <dd className="font-bold text-gray-900">{total} FCFA</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-600">Livraison</dt>
                                        <dd className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Calculé à l'étape suivante</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-t border-gray-200 mt-4">
                                        <dt className="text-lg font-bold text-gray-900">Total</dt>
                                        <dd className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                            {total} FCFA
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="mt-8 space-y-4">
                                <Link
                                    href="/checkout"
                                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Commander
                                </Link>

                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-green-500 text-lg font-bold rounded-xl text-green-700 bg-white hover:bg-green-50 transition-all duration-300"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Commander via WhatsApp
                                </button>
                            </div>

                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    ou{" "}
                                    <Link href="/market" className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                        Continuer vos achats
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

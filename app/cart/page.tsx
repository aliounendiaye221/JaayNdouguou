"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ShoppingBag, Truck, ShieldCheck, CreditCard } from "lucide-react";
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
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center px-4 animate-fadeInUp">
                    <div className="w-48 h-48 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse opacity-50"></div>
                        <ShoppingBag className="w-24 h-24 text-emerald-500 relative z-10" />
                    </div>
                    <h2 className="text-4xl font-heading font-extrabold text-gray-900 mb-4 text-center">Votre panier est vide 😔</h2>
                    <p className="text-gray-600 mb-10 text-xl max-w-lg text-center leading-relaxed">
                        Il semblerait que vous n'ayez pas encore craqué pour nos délicieux produits frais. Le marché vous attend !
                    </p>
                    <Link
                        href="/market"
                        className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold rounded-full shadow-emerald-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                    >
                        <ArrowLeft className="mr-3 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                        Retourner au marché
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-2 bg-emerald-500 rounded-full"></div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900">
                        Votre Panier <span className="text-emerald-500">({items.length})</span>
                    </h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                                                <p className="mt-1 text-emerald-600 font-medium">{item.price} FCFA <span className="text-gray-400 text-sm font-normal">/ {item.unit}</span></p>
                                            </div>
                                            <p className="text-2xl font-bold font-heading text-gray-900">{item.price * item.quantity} <span className="text-sm text-gray-500 font-normal">FCFA</span></p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                                            <div className="flex items-center self-start sm:self-auto bg-gray-50 rounded-xl p-1 border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-3 hover:bg-white hover:text-red-500 hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-lg text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-3 hover:bg-white hover:text-green-500 hover:shadow-sm rounded-lg transition-all"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center gap-2 text-red-400 hover:text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-xl transition-all self-end sm:self-auto"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                                <span className="hidden sm:inline">Supprimer</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-800">
                            <Truck className="shrink-0 w-6 h-6" />
                            <p className="font-medium">Livraison gratuite dès 15,000 FCFA d'achats !</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-16 lg:mt-0 lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sticky top-32 glass-card">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Résumé</h2>

                            <dl className="space-y-4 text-gray-600">
                                <div className="flex justify-between">
                                    <dt>Sous-total</dt>
                                    <dd className="font-bold text-gray-900">{total} FCFA</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Livraison</dt>
                                    <dd className="text-emerald-600 font-medium">Calculé après</dd>
                                </div>
                                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                    <dt className="text-xl font-bold text-gray-900">Total</dt>
                                    <dd className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                                        {total} <span className="text-sm text-gray-400 font-normal">FCFA</span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-8 space-y-4">
                                <Link
                                    href="/checkout"
                                    className="w-full flex items-center justify-center px-6 py-5 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 shadow-lg shadow-emerald-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Passer la commande
                                </Link>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500">ou avec WhatsApp</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-emerald-100 text-lg font-bold rounded-2xl text-emerald-700 bg-emerald-50/30 hover:bg-emerald-100 hover:border-emerald-200 transition-all duration-300 group"
                                >
                                    <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                    Commander via WhatsApp
                                </button>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-center">
                                    <ShieldCheck className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-xs font-semibold text-gray-500">Paiement Sécurisé</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl text-center">
                                    <CreditCard className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-xs font-semibold text-gray-500">Wave / Orange Money</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

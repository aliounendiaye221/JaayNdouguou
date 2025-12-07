"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, CreditCard, CheckCircle, MapPin, Phone, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "Dakar",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, wave, om

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart and redirect
    clearCart();
    router.push("/checkout/success");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <Link
            href="/market"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-bold text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retourner au marché
          </Link>
        </div>
      </main>
    );
  }

  const deliveryFee = 1500; // Fixed delivery fee for now
  const finalTotal = total + deliveryFee;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au panier
          </Link>
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent">
            Finaliser la commande
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-emerald-600" />
                  </div>
                  Informations de livraison
                </h2>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3"
                        placeholder="Moussa"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full pl-10 border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3"
                        placeholder="Diop"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full pl-10 border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3"
                        placeholder="77 123 45 67"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">Adresse / Quartier</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full pl-10 border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3"
                        placeholder="Ex: Sacré Cœur 3, Villa 123"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2">Ville</label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3 bg-white"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Rufisque">Rufisque</option>
                      <option value="Guédiawaye">Guédiawaye</option>
                      <option value="Pikine">Pikine</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">Notes de livraison (optionnel)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-3"
                      placeholder="Instructions spéciales pour le livreur..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  Moyen de paiement
                </h2>

                <div className="space-y-4">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="ml-3 block text-sm font-bold text-gray-900">
                      Paiement à la livraison (Espèces)
                    </span>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wave"
                      checked={paymentMethod === "wave"}
                      onChange={() => setPaymentMethod("wave")}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 block text-sm font-bold text-gray-900">
                      Wave (Simulation)
                    </span>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'om' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="om"
                      checked={paymentMethod === "om"}
                      onChange={() => setPaymentMethod("om")}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-3 block text-sm font-bold text-gray-900">
                      Orange Money (Simulation)
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement...
                  </span>
                ) : (
                  `Payer ${finalTotal} FCFA`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>
              <ul className="divide-y divide-gray-100 mb-6">
                {items.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-center">
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <h3>{item.name}</h3>
                        <p>{item.price * item.quantity} FCFA</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qté {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="border-t border-gray-100 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Sous-total</dt>
                  <dd className="font-bold text-gray-900">{total} FCFA</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Livraison</dt>
                  <dd className="font-bold text-gray-900">{deliveryFee} FCFA</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-xl font-bold text-gray-900">Total</dt>
                  <dd className="text-2xl font-bold text-emerald-600">{finalTotal} FCFA</dd>
                </div>
              </dl>

              <div className="bg-emerald-50 rounded-xl p-4 mt-6 flex gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800">
                  En confirmant votre commande, vous acceptez nos conditions générales de vente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

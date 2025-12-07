"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { WHATSAPP_BUSINESS_NUMBER } from "../utils/whatsapp";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Format message for WhatsApp
        const whatsappMessage = `
📩 *Nouveau Message de Contact*

👤 *Nom:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Téléphone:* ${formData.phone}
📋 *Sujet:* ${formData.subject}

💬 *Message:*
${formData.message}
        `.trim();

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Reset form
        setTimeout(() => {
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
            setIsSubmitting(false);
            setSubmitStatus("success");

            setTimeout(() => setSubmitStatus("idle"), 5000);
        }, 1000);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            Contactez-nous
                        </h1>
                        <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                            Une question ? Besoin d'aide ? Notre équipe est là pour vous répondre
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Informations de Contact
                            </h2>

                            <div className="space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                                        <p className="text-gray-600 text-sm">
                                            Dakar, Sénégal
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                                        <a href="tel:+221786037913" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                            +221 78 603 79 13
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <a href="mailto:contact@jaayndougou.sn" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                            contact@jaayndougou.sn
                                        </a>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                                        <p className="text-gray-600 text-sm">
                                            Lun - Sam: 8h - 20h<br />
                                            Dimanche: 9h - 18h
                                        </p>
                                    </div>
                                </div>

                                {/* WhatsApp CTA */}
                                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                        Contact Rapide
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Besoin d'une réponse immédiate ? Contactez-nous sur WhatsApp !
                                    </p>
                                    <a
                                        href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Ouvrir WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Envoyez-nous un message
                            </h2>

                            {submitStatus === "success" && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 text-sm font-medium">
                                        ✓ Message envoyé via WhatsApp ! Nous vous répondrons rapidement.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Votre nom"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="+221 XX XXX XX XX"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Sujet *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        >
                                            <option value="">Sélectionnez un sujet</option>
                                            <option value="Commande">Question sur une commande</option>
                                            <option value="Produits">Information produits</option>
                                            <option value="Livraison">Livraison</option>
                                            <option value="Paiement">Paiement</option>
                                            <option value="Réclamation">Réclamation</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                                        placeholder="Écrivez votre message ici..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? (
                                        <>Envoi en cours...</>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    * Champs obligatoires. Votre message sera envoyé via WhatsApp.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Notre Localisation
                    </h2>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124507.97474319!2d-17.533768599999998!3d14.716677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d0d4f3f3f7f%3A0xc0d9b62f0f3f3f3f!2sDakar%2C%20Senegal!5e0!3m2!1sen!2s!4v1234567890"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

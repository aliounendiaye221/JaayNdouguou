"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Settings,
    Truck,
    Gift,
    Phone,
    Store,
    Megaphone,
    Save,
    CheckCircle2,
    AlertCircle,
    RotateCcw
} from "lucide-react";

export default function AdminSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [form, setForm] = useState({
        deliveryFee: 1500,
        freeDeliveryThreshold: 10000,
        whatsappNumber: "+221786037913",
        storeOpen: true,
        announcementMessage: "Livraison rapide en 2h à Dakar et Rufisque !",
    });

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings', { credentials: 'include' });
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            if (data && !data.error) {
                setForm({
                    deliveryFee: data.deliveryFee ?? 1500,
                    freeDeliveryThreshold: data.freeDeliveryThreshold ?? 10000,
                    whatsappNumber: data.whatsappNumber || "+221786037913",
                    storeOpen: data.storeOpen !== undefined ? Boolean(data.storeOpen) : true,
                    announcementMessage: data.announcementMessage || "",
                });
            }
        } catch (error) {
            console.error('Erreur chargement paramètres:', error);
            setErrorMessage('Impossible de charger les paramètres.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    deliveryFee: Number(form.deliveryFee),
                    freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
                    whatsappNumber: form.whatsappNumber.trim(),
                    storeOpen: Boolean(form.storeOpen),
                    announcementMessage: form.announcementMessage ? form.announcementMessage.trim() : null,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMessage('Paramètres de la boutique enregistrés avec succès ! Les modifications sont actives sur tout le site.');
                setTimeout(() => setSuccessMessage(null), 5000);
            } else {
                setErrorMessage(data.error || 'Erreur lors de l\'enregistrement des paramètres.');
            }
        } catch (error) {
            console.error('Erreur enregistrement paramètres:', error);
            setErrorMessage('Erreur réseau lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-slate-500 font-medium text-sm">Chargement des paramètres...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-emerald-600" />
                    <span>Paramètres de la Boutique</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    Gérez les frais de livraison, les règles de gratuité, les coordonnées et la disponibilité de votre marché.
                </p>
            </div>

            {/* Alertes Toast */}
            {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Formulaire Principal */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1 : Tarification Livraison */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Tarification de la Livraison</h2>
                            <p className="text-xs text-slate-400 font-medium">Frais appliqués au panier et validation des commandes</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                Frais de livraison standard (FCFA)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="100"
                                    value={form.deliveryFee}
                                    onChange={e => setForm(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    FCFA
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                Montant facturé pour les livraisons à Dakar et Rufisque.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                Seuil pour Livraison Gratuite (FCFA)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="500"
                                    value={form.freeDeliveryThreshold}
                                    onChange={e => setForm(prev => ({ ...prev, freeDeliveryThreshold: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    FCFA
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                Si le panier atteint ce montant, la livraison passe à 0 FCFA.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2 : Disponibilité & Statut Boutique */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Statut de la Boutique</h2>
                            <p className="text-xs text-slate-400 font-medium">Contrôle des ouvertures et des prises de commandes</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${form.storeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="font-bold text-slate-900 text-base">
                                    {form.storeOpen ? 'Boutique Ouverte (Commandes Actives)' : 'Boutique Fermée Temporairement'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {form.storeOpen
                                    ? 'Les clients peuvent ajouter au panier et finaliser leurs commandes en ligne.'
                                    : 'Les nouvelles commandes seront suspendues (utile pour jours fériés, réapprovisionnement ou maintenance).'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, storeOpen: !prev.storeOpen }))}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center ${
                                form.storeOpen
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {form.storeOpen ? 'Passer en Fermé' : 'Ouvrir la Boutique'}
                        </button>
                    </div>
                </div>

                {/* Section 3 : Contact & Communication */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Communication & Contact</h2>
                            <p className="text-xs text-slate-400 font-medium">Numéro WhatsApp et message d'accueil pour vos clients</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                Numéro WhatsApp Commercial (Réception des Commandes)
                            </label>
                            <input
                                type="text"
                                required
                                value={form.whatsappNumber}
                                onChange={e => setForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                                placeholder="+221786037913"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            />
                            <p className="text-xs text-slate-400 mt-1 font-medium">
                                Format recommandé : avec indicatif international (+221XXXXXXXXX).
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                Message du Bandeau Promotionnel (Haut du site)
                            </label>
                            <input
                                type="text"
                                value={form.announcementMessage}
                                onChange={e => setForm(prev => ({ ...prev, announcementMessage: e.target.value }))}
                                placeholder="ex: Livraison offerte dès 10 000 FCFA à Dakar !"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            />
                            <p className="text-xs text-slate-400 mt-1 font-medium">
                                Visible par tous les visiteurs sur le bandeau en haut de page d'accueil.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bouton de Soumission */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={fetchSettings}
                        disabled={saving}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Réinitialiser</span>
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-200 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

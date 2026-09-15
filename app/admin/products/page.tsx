"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Package,
    Plus,
    Search,
    Filter,
    Check,
    X,
    AlertTriangle,
    TrendingUp,
    Boxes,
    Edit3,
    Trash2,
    RefreshCw,
    ToggleLeft,
    ToggleRight,
    Save
} from "lucide-react";

interface ProductItem {
    id: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    image: string;
    stock: number;
    isAvailable: boolean;
    description?: string | null;
}

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "low" | "out">("all");
    
    // Stats
    const [stats, setStats] = useState({
        totalProducts: 0,
        outOfStock: 0,
        lowStock: 0,
        totalStockValue: 0,
    });

    // Modal État
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [modalForm, setModalForm] = useState({
        name: "",
        price: 500,
        unit: "kg",
        category: "Légumes",
        image: "/logo.png",
        stock: 100,
        isAvailable: true,
        description: "",
    });

    // Valeurs éditées en ligne (inline edits)
    const [inlineEdits, setInlineEdits] = useState<{ [id: string]: { price?: number; stock?: number } }>({});

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products', { credentials: 'include' });
            if (res.status === 401) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            if (data.products) {
                setProducts(data.products);
                setStats(data.stats || {
                    totalProducts: data.products.length,
                    outOfStock: data.products.filter((p: any) => p.stock <= 0 || !p.isAvailable).length,
                    lowStock: data.products.filter((p: any) => p.stock > 0 && p.stock <= 20 && p.isAvailable).length,
                    totalStockValue: data.products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0),
                });
            }
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Gestion de l'édition inline
    const handleInlineChange = (id: string, field: 'price' | 'stock', value: number) => {
        setInlineEdits(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    // Sauvegarde rapide du prix et du stock
    const saveInlineChanges = async (product: ProductItem) => {
        const edits = inlineEdits[product.id];
        if (!edits) return;

        setSavingId(product.id);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: product.id,
                    price: edits.price !== undefined ? edits.price : product.price,
                    stock: edits.stock !== undefined ? edits.stock : product.stock,
                }),
            });

            if (res.ok) {
                // Mettre à jour l'état local
                setProducts(prev => prev.map(p => {
                    if (p.id === product.id) {
                        return {
                            ...p,
                            price: edits.price !== undefined ? edits.price : p.price,
                            stock: edits.stock !== undefined ? edits.stock : p.stock,
                        };
                    }
                    return p;
                }));
                // Nettoyer les modifications inline pour ce produit
                setInlineEdits(prev => {
                    const next = { ...prev };
                    delete next[product.id];
                    return next;
                });
            } else {
                alert('Erreur lors de l\'enregistrement des modifications.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur réseau lors de la mise à jour.');
        } finally {
            setSavingId(null);
        }
    };

    // Bascule rapide de la disponibilité
    const toggleAvailability = async (product: ProductItem) => {
        setSavingId(product.id);
        const newStatus = !product.isAvailable;
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: product.id,
                    isAvailable: newStatus,
                }),
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: newStatus } : p));
            }
        } catch (error) {
            console.error('Erreur bascule disponibilité:', error);
        } finally {
            setSavingId(null);
        }
    };

    // Suppression / Désactivation d'un produit
    const handleDeleteProduct = async (product: ProductItem) => {
        if (!confirm(`Voulez-vous vraiment supprimer ou archiver le produit "${product.name}" ?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/products?id=${product.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                fetchProducts();
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Ouverture de la modale d'ajout ou modification
    const openEditModal = (product?: ProductItem) => {
        if (product) {
            setEditingProduct(product);
            setModalForm({
                name: product.name,
                price: product.price,
                unit: product.unit,
                category: product.category,
                image: product.image,
                stock: product.stock,
                isAvailable: product.isAvailable,
                description: product.description || "",
            });
        } else {
            setEditingProduct(null);
            setModalForm({
                name: "",
                price: 500,
                unit: "kg",
                category: "Légumes",
                image: "/logo.png",
                stock: 100,
                isAvailable: true,
                description: "",
            });
        }
        setIsModalOpen(true);
    };

    // Envoi du formulaire modal
    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const body = editingProduct 
                ? { ...modalForm, id: editingProduct.id } 
                : modalForm;

            const res = await fetch('/api/admin/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchProducts();
            } else {
                const err = await res.json();
                alert(`Erreur: ${err.error || 'Données invalides'}`);
            }
        } catch (error) {
            console.error('Erreur soumission produit:', error);
            alert('Erreur lors de l\'enregistrement du produit.');
        }
    };

    // Filtrage des produits
    const categories = Array.from(new Set(products.map(p => p.category)));

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

        let matchesStock = true;
        if (stockFilter === "in-stock") {
            matchesStock = product.stock > 20 && product.isAvailable;
        } else if (stockFilter === "low") {
            matchesStock = product.stock > 0 && product.stock <= 20 && product.isAvailable;
        } else if (stockFilter === "out") {
            matchesStock = product.stock <= 0 || !product.isAvailable;
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Statistiques Rapides */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span>Produits & Stocks</span>
                        <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Direct Base
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Ajustez les prix, stocks et disponibilités en temps réel.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchProducts}
                        className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs sm:text-sm shadow-sm active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualiser</span>
                    </button>
                    <button
                        onClick={() => openEditModal()}
                        className="flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-xs sm:text-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter</span>
                    </button>
                </div>
            </div>

            {/* Cartes KPI (2 colonnes sur mobile, 4 sur desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Total Références</p>
                        <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-2">{stats.totalProducts}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Produits actifs</p>
                </div>

                <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Valeur Stock</p>
                        <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-2 truncate">
                        {stats.totalStockValue.toLocaleString()} <span className="text-xs font-bold text-slate-400">F</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Valorisation totale</p>
                </div>

                <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Stock Faible</p>
                        <div className="p-1.5 sm:p-2 bg-orange-50 text-orange-600 rounded-xl">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-orange-600 mt-2">{stats.lowStock}</h3>
                    <p className="text-[10px] sm:text-xs text-orange-400 font-medium mt-0.5">≤ 20 unités</p>
                </div>

                <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">Ruptures</p>
                        <div className="p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-xl">
                            <Boxes className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-red-600 mt-2">{stats.outOfStock}</h3>
                    <p className="text-[10px] sm:text-xs text-red-400 font-medium mt-0.5">Stock épuisé</p>
                </div>
            </div>

            {/* Barre de Recherche et Filtres */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-slate-50 border-none rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl text-xs sm:text-sm font-bold text-slate-700 px-3 py-2 sm:py-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full"
                    >
                        <option value="all">Catégories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e: any) => setStockFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl text-xs sm:text-sm font-bold text-slate-700 px-3 py-2 sm:py-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full"
                    >
                        <option value="all">Stocks</option>
                        <option value="in-stock">En stock</option>
                        <option value="low">Faible (≤ 20)</option>
                        <option value="out">Rupture</option>
                    </select>
                </div>
            </div>

            {/* Table des Produits (Desktop) et Cartes Produits (Mobile) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* 🖥️ Vue Desktop (Tableau Éditables) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix Unitaire</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Disponible</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Disponibilité</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 h-16 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        Aucun produit trouvé selon les critères sélectionnés.
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => {
                                const edits = inlineEdits[product.id] || {};
                                const currentPrice = edits.price !== undefined ? edits.price : product.price;
                                const currentStock = edits.stock !== undefined ? edits.stock : product.stock;
                                const hasUnsavedChanges = edits.price !== undefined || edits.stock !== undefined;

                                const isLow = currentStock > 0 && currentStock <= 20 && product.isAvailable;
                                const isOut = currentStock <= 0 || !product.isAvailable;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        {/* Nom & Image */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                                                    <Image
                                                        src={product.image || '/logo.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                                        {product.name}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        Unité: <span className="font-bold text-slate-600">{product.unit}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Catégorie */}
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Prix (Édition Directe) */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={currentPrice}
                                                    onChange={(e) => handleInlineChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                                                    className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                                    min="0"
                                                    step="50"
                                                />
                                                <span className="text-xs font-bold text-slate-400">FCFA</span>
                                            </div>
                                        </td>

                                        {/* Stock (Édition Directe) */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={currentStock}
                                                    onChange={(e) => handleInlineChange(product.id, 'stock', parseInt(e.target.value) || 0)}
                                                    className={`w-20 px-3 py-1.5 border rounded-lg text-sm font-black focus:bg-white focus:ring-2 ${
                                                        isOut
                                                            ? 'bg-red-50 border-red-200 text-red-700 focus:ring-red-400'
                                                            : isLow
                                                            ? 'bg-orange-50 border-orange-200 text-orange-700 focus:ring-orange-400'
                                                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-emerald-500'
                                                    }`}
                                                    min="0"
                                                />
                                                <span className="text-xs text-slate-400 font-bold">{product.unit}</span>
                                            </div>
                                        </td>

                                        {/* Disponibilité (Bascule Active/Inactive) */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => toggleAvailability(product)}
                                                disabled={savingId === product.id}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                                    product.isAvailable
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                            >
                                                {product.isAvailable ? (
                                                    <>
                                                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                                                        <span>Actif</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                                                        <span>Inactif</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Bouton de sauvegarde rapide si modifications */}
                                                {hasUnsavedChanges && (
                                                    <button
                                                        onClick={() => saveInlineChanges(product)}
                                                        disabled={savingId === product.id}
                                                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1 animate-pulse"
                                                        title="Enregistrer les modifications de prix/stock"
                                                    >
                                                        <Save className="w-3.5 h-3.5" />
                                                        <span>Sauvegarder</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Modifier tous les détails"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer / Archiver"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 📱 Vue Mobile (Cartes Produits Tactiles) */}
                <div className="block md:hidden divide-y divide-slate-100">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="p-4 space-y-3 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium text-sm">
                            Aucun produit trouvé selon les critères.
                        </div>
                    ) : (
                        filteredProducts.map((product) => {
                            const edits = inlineEdits[product.id] || {};
                            const currentPrice = edits.price !== undefined ? edits.price : product.price;
                            const currentStock = edits.stock !== undefined ? edits.stock : product.stock;
                            const hasUnsavedChanges = edits.price !== undefined || edits.stock !== undefined;

                            const isLow = currentStock > 0 && currentStock <= 20 && product.isAvailable;
                            const isOut = currentStock <= 0 || !product.isAvailable;

                            return (
                                <div key={product.id} className="p-3.5 space-y-3 hover:bg-slate-50/50 transition-colors">
                                    {/* Ligne 1 : Image + Titre + Badges */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                                            <Image
                                                src={product.image || '/logo.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <h4 className="text-sm font-black text-slate-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
                                                    isOut
                                                        ? 'bg-red-100 text-red-700'
                                                        : isLow
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {isOut ? 'Rupture' : isLow ? 'Stock Bas' : 'En Stock'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                    {product.category}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    Unité: {product.unit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ligne 2 : Champs d'édition directe (Prix & Stock) */}
                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                                Prix (FCFA)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentPrice}
                                                onChange={(e) => handleInlineChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                                                min="0"
                                                step="50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                                Stock ({product.unit})
                                            </label>
                                            <input
                                                type="number"
                                                value={currentStock}
                                                onChange={(e) => handleInlineChange(product.id, 'stock', parseInt(e.target.value) || 0)}
                                                className={`w-full px-2.5 py-1.5 border rounded-lg text-sm font-black focus:ring-2 ${
                                                    isOut
                                                        ? 'bg-red-50 border-red-200 text-red-700'
                                                        : isLow
                                                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                                                        : 'bg-white border-slate-200 text-slate-800 focus:ring-emerald-500'
                                                }`}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Ligne 3 : Actions Mobile */}
                                    <div className="flex items-center justify-between gap-2 pt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleAvailability(product)}
                                            disabled={savingId === product.id}
                                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                                product.isAvailable
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {product.isAvailable ? (
                                                <>
                                                    <ToggleRight className="w-4 h-4 text-emerald-600" />
                                                    <span>En Vente</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                                                    <span>Masqué</span>
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            {hasUnsavedChanges && (
                                                <button
                                                    onClick={() => saveInlineChanges(product)}
                                                    disabled={savingId === product.id}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1 animate-pulse active:scale-95"
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>Enregistrer</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg active:scale-95"
                                                title="Modifier les détails"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product)}
                                                className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg active:scale-95"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal d'Ajout / Édition (100% Mobile Friendly) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                                {editingProduct ? `Modifier "${editingProduct.name}"` : 'Ajouter un produit'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="space-y-4 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom du produit</label>
                                    <input
                                        type="text"
                                        required
                                        value={modalForm.name}
                                        onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                        placeholder="ex: Poivron Jaune"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catégorie</label>
                                    <select
                                        value={modalForm.category}
                                        onChange={e => setModalForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="Légumes">Légumes</option>
                                        <option value="Tubercules">Tubercules</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Herbes & Épices">Herbes & Épices</option>
                                        <option value="Général">Général</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prix unitaire (FCFA)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="50"
                                        value={modalForm.price}
                                        onChange={e => setModalForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unité</label>
                                    <input
                                        type="text"
                                        required
                                        value={modalForm.unit}
                                        onChange={e => setModalForm(prev => ({ ...prev, unit: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                        placeholder="kg, botte, pièce, sachet..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Initial</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={modalForm.stock}
                                        onChange={e => setModalForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chemin de l'image</label>
                                    <input
                                        type="text"
                                        value={modalForm.image}
                                        onChange={e => setModalForm(prev => ({ ...prev, image: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                                        placeholder="/oignon.png"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description (optionnelle)</label>
                                <textarea
                                    value={modalForm.description}
                                    onChange={e => setModalForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 h-20"
                                    placeholder="Détails du produit, origine, fraîcheur..."
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="isAvailableCheckbox"
                                    checked={modalForm.isAvailable}
                                    onChange={e => setModalForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="isAvailableCheckbox" className="text-sm font-bold text-slate-700 cursor-pointer">
                                    Disponible immédiatement pour les commandes
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-95"
                                >
                                    {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

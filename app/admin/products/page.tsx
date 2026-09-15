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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span>Gestion des Produits & Stocks</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            Direct Base
                        </span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Ajustez les prix, gérez les quantités en stock et activez/désactivez vos références en temps réel.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchProducts}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualiser</span>
                    </button>
                    <button
                        onClick={() => openEditModal()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouveau Produit</span>
                    </button>
                </div>
            </div>

            {/* Cartes KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Références</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalProducts}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Produits au catalogue</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valeur Totale Stock</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalStockValue.toLocaleString()} <span className="text-sm font-bold text-slate-500">FCFA</span></h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Valorisation actuelle</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Faible</p>
                        <h3 className="text-3xl font-black text-orange-600 mt-1">{stats.lowStock}</h3>
                        <p className="text-xs text-orange-500 font-medium mt-1">≤ 20 unités restantes</p>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rupture / Inactif</p>
                        <h3 className="text-3xl font-black text-red-600 mt-1">{stats.outOfStock}</h3>
                        <p className="text-xs text-red-500 font-medium mt-1">Non commandable</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                        <Boxes className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Barre de Recherche et Filtres */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher un légume, fruit, tubercule..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e: any) => setStockFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="all">Tous les stocks</option>
                        <option value="in-stock">En stock (&gt; 20)</option>
                        <option value="low">Stock faible (≤ 20)</option>
                        <option value="out">Rupture / Inactif</option>
                    </select>
                </div>
            </div>

            {/* Table des Produits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
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

                                        {/* Stock (Édition Directe avec Badges) */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleInlineChange(product.id, 'stock', Math.max(0, currentStock - 5))}
                                                        className="w-7 h-7 bg-slate-100 text-slate-600 rounded-l-lg hover:bg-slate-200 font-black text-sm flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={currentStock}
                                                        onChange={(e) => handleInlineChange(product.id, 'stock', parseInt(e.target.value) || 0)}
                                                        className="w-16 py-1 bg-slate-50 border-y border-slate-200 text-center text-sm font-black text-slate-800 focus:bg-white focus:ring-0"
                                                        min="0"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleInlineChange(product.id, 'stock', currentStock + 5)}
                                                        className="w-7 h-7 bg-slate-100 text-slate-600 rounded-r-lg hover:bg-slate-200 font-black text-sm flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Badge d'état de stock */}
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    isOut ? 'bg-red-50 text-red-600 border border-red-200' :
                                                    isLow ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                                    'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                }`}>
                                                    {isOut ? 'Rupture' : isLow ? 'Faible' : 'OK'}
                                                </span>
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
            </div>

            {/* Modal d'Ajout / Édition */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900">
                                {editingProduct ? `Modifier "${editingProduct.name}"` : 'Ajouter un nouveau produit'}
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

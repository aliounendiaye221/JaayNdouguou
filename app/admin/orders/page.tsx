"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Search, Filter, Download, ArrowRight, Calendar, CheckCircle, Clock, Truck, XCircle, Trash2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        totalCount: 0,
        totalPages: 0,
        hasMore: false
    });

    const fetchOrders = () => {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: '50'
        });
        
        if (filterStatus !== 'all') {
            params.append('status', filterStatus);
        }
        
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        fetch(`/api/admin/orders?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log('📦 Données reçues de l\'API:', data);
                
                if (data.orders && Array.isArray(data.orders)) {
                    console.log('✅ Définir les commandes avec les données de l\'API');
                    setOrders(data.orders);
                    setPagination(data.pagination || pagination);
                } else if (Array.isArray(data)) {
                    // Rétrocompatibilité avec l'ancien format
                    console.log('✅ Format ancien détecté');
                    setOrders(data);
                } else {
                    console.log('⚠️ Les données ne sont pas au bon format');
                    setOrders([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('❌ Erreur lors du fetch:', error);
                setOrders([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchOrders();
        
        // Rafraîchissement automatique toutes les 5 secondes pour le temps réel
        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [currentPage, filterStatus, searchTerm]);

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    const deleteOrder = async (orderId: string, orderNumber: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la commande ${orderNumber} ?\n\nCette action est irréversible.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/orders?id=${orderId}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                console.log('✅ Commande supprimée avec succès');
                fetchOrders();
            } else {
                const error = await res.json();
                alert(`Erreur lors de la suppression: ${error.error}`);
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Erreur lors de la suppression de la commande');
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Réinitialiser à la page 1 lors d'une recherche
    };

    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
        setCurrentPage(1); // Réinitialiser à la page 1 lors d'un changement de filtre
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Commandes</h1>
                    <p className="text-slate-500 font-medium">Gérez et suivez toutes les transactions en temps réel.</p>
                    {pagination.totalCount > 0 && (
                        <p className="text-sm text-emerald-600 font-bold mt-1">
                            {pagination.totalCount} commande(s) trouvée(s) · Mise à jour automatique toutes les 5s
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Exporter</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-emerald-600 transition-all">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span>Filtre Date</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID, Nom ou Téléphone..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-4 py-3 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="all">Tous les Statuts</option>
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="preparing">En préparation</option>
                        <option value="delivering">En livraison</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                    </select>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Paiement</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-5 h-20 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 font-bold">Aucune commande trouvée</p>
                                            <p className="text-slate-400 text-sm">Les nouvelles commandes apparaîtront ici en temps réel</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.map((order: any) => (
                                <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">#{order.orderNumber.toUpperCase()}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString('fr-SN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                                                {order.customer?.firstName?.[0]}{order.customer?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 leading-tight">{order.customer?.firstName} {order.customer?.lastName}</div>
                                                <div className="text-xs text-slate-400 font-medium">{order.customer?.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="text-xs font-bold border-2 rounded-lg px-2 py-1.5 cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all"
                                            style={{
                                                borderColor: order.status === 'delivered' ? '#10b981' : 
                                                           order.status === 'cancelled' ? '#ef4444' : 
                                                           order.status === 'delivering' ? '#6366f1' : '#f59e0b',
                                                color: order.status === 'delivered' ? '#10b981' : 
                                                       order.status === 'cancelled' ? '#ef4444' : 
                                                       order.status === 'delivering' ? '#6366f1' : '#f59e0b'
                                            }}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="confirmed">Confirmé</option>
                                            <option value="preparing">En préparation</option>
                                            <option value="delivering">En livraison</option>
                                            <option value="delivered">Livré</option>
                                            <option value="cancelled">Annulé</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-sm font-black text-slate-900">{order.total.toLocaleString()} FCFA</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.items?.length || 0} article(s)</div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                                            {order.paymentStatus === 'paid' ? '✓ Payé' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 hover:shadow-lg transition-all transform active:scale-95 group/btn"
                                            >
                                                <span>Détails</span>
                                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                            <button
                                                onClick={() => deleteOrder(order.id, order.orderNumber)}
                                                className="inline-flex items-center justify-center p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95 border border-red-200 hover:border-red-600"
                                                title="Supprimer la commande"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Page <span className="font-bold">{pagination.page}</span> sur <span className="font-bold">{pagination.totalPages}</span> · 
                            Total: <span className="font-bold text-emerald-600">{pagination.totalCount}</span> commande(s)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

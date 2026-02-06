"use client";
import { useEffect, useState } from "react";
import {
    ShoppingBag,
    AlertCircle,
    Activity,
    Plus,
    Calendar
} from "lucide-react";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async (isPoll = false) => {
        if (!isPoll) setIsRefreshing(true);
        try {
            const res = await fetch('/api/admin/stats');
            const statsData = await res.json();
            
            if (!statsData || statsData.error) {
                console.error("Erreur lors du chargement des statistiques");
                if (!data) {
                    setData({ stats: { totalOrders: 0, ordersToday: 0, totalRevenue: 0, pendingClaims: 0 }, recentOrders: [] });
                }
            } else {
                setData(statsData);
                setLastRefresh(new Date());
            }
        } catch (err) {
            console.error(err);
            if (!data) {
                setData({ stats: { totalOrders: 0, ordersToday: 0, totalRevenue: 0, pendingClaims: 0 }, recentOrders: [] });
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();

        // Polling toutes les 30 secondes pour le temps réel
        const interval = setInterval(() => {
            loadData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 font-medium animate-pulse text-sm">Synchronisation 2026...</p>
            </div>
        );
    }

    const { stats, recentOrders } = data || { stats: {}, recentOrders: [] };

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Bar / Quick Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vue d'ensemble</h1>
                        {isRefreshing && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        )}
                    </div>
                    <p className="text-slate-500 font-medium mt-1">
                        Dernière mise à jour : {lastRefresh.toLocaleTimeString('fr-SN')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => loadData()}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        <Activity className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Actualiser</span>
                    </button>
                    <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-bold text-slate-600 gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{new Date().toLocaleDateString('fr-SN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-100 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>
                            <a href="/admin/orders">Gérer les Commandes</a>
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card (Double Width) */}
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl transition-transform group-hover:scale-110 duration-700" />

                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Chiffre d'Affaires</span>
                            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900">{(stats.totalRevenue || 0).toLocaleString()} FCFA</h3>
                        <p className="text-slate-500 text-sm font-medium mt-2">Montant total des commandes payées</p>
                    </div>
                </div>

                {/* Orders Stat */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                    <div>
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit mb-6">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Commandes Totales</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalOrders || 0}</h3>
                        <p className="text-slate-500 text-xs font-medium mt-2">Nombre de commandes reçues</p>
                    </div>
                </div>

                {/* Orders Today */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                    <div>
                        <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl w-fit mb-6">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Commandes Aujourd'hui</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.ordersToday || 0}</h3>
                        <p className="text-slate-500 text-xs font-medium mt-2">Commandes du jour</p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Recent Orders & Health Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table - 2/3 Width */}
                <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Commandes Récentes</h2>
                            <p className="text-slate-400 text-sm font-medium mt-0.5">Dernières transactions effectuées sur le marché.</p>
                        </div>
                        <button className="text-slate-500 font-bold text-xs hover:text-emerald-600 transition-colors uppercase tracking-widest">
                            <a href="/admin/orders">Voir tout</a>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Client</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders?.slice(0, 5).map((order: any) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                    {order.customer?.firstName?.[0]}{order.customer?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                        {order.customer?.firstName} {order.customer?.lastName}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 font-mono tracking-tight">#{order.orderNumber.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                ${order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    order.status === 'pending' ? 'bg-orange-50 text-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.1)]' :
                                                    order.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                                                    order.status === 'preparing' ? 'bg-purple-50 text-purple-600' :
                                                    order.status === 'delivering' ? 'bg-indigo-50 text-indigo-600' :
                                                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                        'bg-slate-50 text-slate-500'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 
                                                    ${order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500' : 
                                                      order.status === 'pending' ? 'bg-orange-500 animate-pulse' : 
                                                      order.status === 'confirmed' ? 'bg-blue-500' :
                                                      order.status === 'preparing' ? 'bg-purple-500' :
                                                      order.status === 'delivering' ? 'bg-indigo-500 animate-pulse' :
                                                      order.status === 'cancelled' ? 'bg-red-500' :
                                                      'bg-slate-400'}`} />
                                                {order.status === 'delivered' || order.status === 'completed' ? 'Livré' : 
                                                 order.status === 'pending' ? 'En attente' : 
                                                 order.status === 'confirmed' ? 'Confirmé' :
                                                 order.status === 'preparing' ? 'En préparation' :
                                                 order.status === 'delivering' ? 'En livraison' :
                                                 order.status === 'cancelled' ? 'Annulé' :
                                                 order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-slate-900">{order.total.toLocaleString()} FCFA</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="text-sm font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString('fr-SN')}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{new Date(order.createdAt).toLocaleTimeString('fr-SN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Notifications */}
                <div className="space-y-8 lg:col-span-1">
                    {/* Claims Summary */}
                    <div className={`bg-white rounded-[32px] p-8 border shadow-sm transition-all ${stats.pendingClaims > 0 ? 'border-red-100 bg-red-50/10' : 'border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stats.pendingClaims > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            {stats.pendingClaims > 0 && <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />}
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Réclamations</h4>
                        <p className="text-2xl font-black text-slate-900 mt-2">{stats.pendingClaims || 0}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                            {stats.pendingClaims > 0 ? 'Action requise immédiatement.' : 'Tout est sous contrôle.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Search, Filter, Download, ArrowRight, Calendar } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders(getMockOrders());
                }
                setLoading(false);
            })
            .catch(() => {
                setOrders(getMockOrders());
                setLoading(false);
            });
    }, []);

    const filteredOrders = orders.filter((order: any) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Commandes</h1>
                    <p className="text-slate-500 font-medium">Gérez et suivez toutes les transactions en temps réel.</p>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-4 py-3 focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                        <option>Tous les Statuts</option>
                        <option>En cours</option>
                        <option>Livré</option>
                        <option>Annulé</option>
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
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-5 h-20 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredOrders.map((order: any) => (
                                <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">#{order.orderNumber.toUpperCase()}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString('fr-SN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
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
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100' :
                                                order.status === 'pending' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' :
                                                    'bg-slate-100 text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'completed' ? 'bg-emerald-500' : order.status === 'pending' ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`} />
                                            {order.status === 'completed' ? 'Livré' : order.status === 'pending' ? 'En cours' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-slate-900">{order.total.toLocaleString()} FCFA</div>
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Payé</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all transform active:scale-95 group/btn"
                                        >
                                            <span>Détails</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function getMockOrders() {
    return [
        {
            id: "o1",
            orderNumber: "JN-ORD-2026-X89",
            total: 12500,
            status: "pending",
            createdAt: new Date().toISOString(),
            customer: { firstName: "Moussa", lastName: "Sarr", phone: "77 123 45 67" }
        },
        {
            id: "o2",
            orderNumber: "JN-ORD-2026-V42",
            total: 8200,
            status: "completed",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            customer: { firstName: "Awa", lastName: "Diop", phone: "78 123 45 67" }
        },
        {
            id: "o3",
            orderNumber: "JN-ORD-2026-L55",
            total: 24500,
            status: "completed",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            customer: { firstName: "Abdou", lastName: "Ndiaye", phone: "76 123 45 67" }
        }
    ];
}


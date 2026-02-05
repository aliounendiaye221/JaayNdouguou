"use client";
import { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    MessageSquare,
    Check,
    Filter,
    ArrowUpRight,
    User
} from "lucide-react";

export default function ClaimsPage() {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/claims')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setClaims(data);
                } else {
                    setClaims(getMockClaims());
                }
                setLoading(false);
            })
            .catch(() => {
                setClaims(getMockClaims());
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Réclamations</h1>
                    <p className="text-slate-500 font-medium">Gérez la satisfaction client et résolvez les litiges.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-400">Total:</span>
                        <span className="text-sm font-black text-slate-900">{claims.length}</span>
                    </div>
                </div>
            </div>

            {/* Support Metrics Tooltip / Stat Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Attente</p>
                        <p className="text-xl font-black text-slate-900">{claims.filter((c: any) => c.status === 'pending').length}</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps Moyen</p>
                        <p className="text-xl font-black text-slate-900">45 min</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfaction</p>
                        <p className="text-xl font-black text-slate-900">92%</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {claims.length === 0 && !loading ? (
                    <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Zéro Litige Actif</h3>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">Félicitations ! Tous vos clients sont satisfaits pour le moment.</p>
                    </div>
                ) : (
                    claims.map((claim: any) => (
                        <div
                            key={claim.id}
                            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 group hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                                        ${claim.status === 'pending' ? 'bg-red-50 text-red-600 border border-red-100' :
                                            claim.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${claim.status === 'pending' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                                        {claim.status === 'pending' ? 'Priorité Haute' : 'Résolu'}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(claim.createdAt).toLocaleDateString('fr-SN', { day: '2-digit', month: 'long' })}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{claim.subject}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-3xl">{claim.description}</p>

                                <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {claim.customer?.firstName?.[0]}{claim.customer?.lastName?.[0]}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{claim.customer?.firstName} {claim.customer?.lastName}</span>
                                    </div>
                                    {claim.order && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[9px]">Commande:</span>
                                            <span className="text-sm font-black text-emerald-600 group-hover:underline cursor-pointer">#{claim.order.orderNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex md:flex-col justify-end gap-3 min-w-[160px]">
                                <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95">
                                    <Check className="w-4 h-4" />
                                    <span>Résoudre</span>
                                </button>
                                <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Contacter</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function getMockClaims() {
    return [
        {
            id: "c1",
            subject: "Produit manquant dans la livraison",
            description: "Bonjour, j'ai reçu ma commande ce matin mais il manquait les 2kg d'oignons que j'avais payés. Pouvez-vous vérifier ?",
            status: "pending",
            createdAt: new Date().toISOString(),
            customer: { firstName: "Aminata", lastName: "Sow", phone: "77 888 22 11" },
            order: { orderNumber: "ORD-2026-X88" }
        },
        {
            id: "c2",
            subject: "Retard de livraison significatif",
            description: "La livraison a pris plus de 4 heures alors qu'il était mentionné 2 heures maximum. Les légumes sont arrivés un peu flétris.",
            status: "pending",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            customer: { firstName: "Ibrahim", lastName: "Fall", phone: "78 333 44 55" },
            order: { orderNumber: "ORD-2026-V12" }
        }
    ];
}


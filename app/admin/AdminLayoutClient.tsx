"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    AlertCircle,
    Package,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Commandes", href: "/admin/orders", icon: ShoppingBag },
        { name: "Produits & Stocks", href: "/admin/products", icon: Package },
        { name: "Réclamations", href: "/admin/claims", icon: AlertCircle },
        { name: "Paramètres Boutique", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform
                ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                md:translate-x-0 md:static
            `}>
                <div className="p-6 md:p-8 flex items-center justify-between border-b md:border-b-0 border-slate-100">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                            <span className="text-white font-bold text-xl">JN</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">JaayNdougou</h1>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block -mt-1">Console Admin</span>
                        </div>
                    </Link>
                    {/* Close button for mobile drawer */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 md:px-6 space-y-1.5 mt-4 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 md:px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-900"}`} />
                                <span className="font-semibold text-[15px]">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 md:p-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-2xl p-3 md:p-4 mb-3 md:mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Admin</p>
                            <p className="text-[10px] text-slate-500 truncate">admin@jaayndougou.sn</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-3 px-4 md:px-5 py-3 w-full text-left text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group text-sm font-bold"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1 text-red-400" />
                        <span>Quitter la session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between z-30 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center md:hidden">
                                <span className="text-white font-bold text-xs">JN</span>
                            </div>
                            <span className="font-black text-slate-900 text-base md:hidden truncate max-w-[140px] sm:max-w-[200px]">
                                {navigation.find(n => pathname.startsWith(n.href))?.name || 'Admin'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <span className="hover:text-slate-600 cursor-pointer">Console</span>
                        <span>/</span>
                        <span className="text-slate-900 font-bold">{navigation.find(n => pathname.startsWith(n.href))?.name || 'Accueil'}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link 
                            href="/"
                            target="_blank"
                            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1"
                        >
                            <span>Voir le site</span>
                            <span className="text-emerald-500">↗</span>
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-xl">
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent">
                                AD
                            </div>
                            <span className="text-sm font-bold text-slate-700 hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10 pb-24 md:pb-10 scrollbar-hide">
                    {children}
                </main>

                {/* Mobile Bottom Navigation Bar (App-style) */}
                <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
                    {navigation.slice(0, 4).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                                    isActive
                                        ? "text-emerald-600 font-bold"
                                        : "text-slate-400 hover:text-slate-600 font-medium"
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                                    {item.name === "Tableau de bord" ? "Tableau" :
                                     item.name === "Paramètres Boutique" ? "Réglages" :
                                     item.name === "Produits & Stocks" ? "Produits" :
                                     item.name === "Réclamations" ? "Réclams" : item.name}
                                </span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/admin/settings"
                        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                            pathname.startsWith('/admin/settings')
                                ? "text-emerald-600 font-bold"
                                : "text-slate-400 hover:text-slate-600 font-medium"
                        }`}
                    >
                        <Settings className={`w-5 h-5 ${pathname.startsWith('/admin/settings') ? "text-emerald-600" : "text-slate-400"}`} />
                        <span className="text-[10px] mt-0.5 tracking-tight">Réglages</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}

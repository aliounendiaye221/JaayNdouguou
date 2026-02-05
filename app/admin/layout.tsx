"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    AlertCircle,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Commandes", href: "/admin/orders", icon: ShoppingBag },
        { name: "Réclamations", href: "/admin/claims", icon: AlertCircle },
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
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static
            `}>
                <div className="p-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                            <span className="text-white font-bold text-xl">JN</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">JaayNdougou</h1>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block -mt-1">Console Admin</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-1.5 mt-4">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
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

                <div className="p-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Admin</p>
                            <p className="text-[10px] text-slate-500 truncate">admin@jaayndougou.sn</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-5 py-3 w-full text-left text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group">
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold text-sm">Quitter la session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-30 sticky top-0">
                    <button
                        className="md:hidden p-2 text-slate-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <span className="hover:text-slate-600 cursor-pointer">Pages</span>
                        <span>/</span>
                        <span className="text-slate-900 font-bold">{pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase())}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3 group cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-all">
                            <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
                                AD
                            </div>
                            <span className="text-sm font-bold text-slate-700 hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}


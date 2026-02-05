"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, X, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                ? "glass shadow-md py-2"
                : "bg-gradient-to-b from-black/60 via-black/30 to-transparent py-4 backdrop-blur-[2px]"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-3xl font-heading font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent tracking-tight hover:from-emerald-300 hover:to-green-200 transition-all duration-300 transform hover:scale-105 drop-shadow-sm"
                        >
                            🌿 JaayNdougou
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1 border border-white/10 shadow-lg">
                        {["Accueil", "Marché", "À propos", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("à propos", "about").replace("marché", "market")}`}
                                className={`
                                    relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out
                                    ${scrolled
                                        ? "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                                        : "text-white hover:text-emerald-900 hover:bg-white"
                                    }
                                `}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${scrolled
                                ? "text-gray-600 hover:bg-emerald-100/50 hover:text-emerald-600"
                                : "text-white hover:bg-white/20 hover:text-white"
                                }`}
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/cart"
                            className={`p-2.5 rounded-full transition-all duration-300 relative transform hover:scale-110 active:scale-95 ${scrolled
                                ? "text-gray-600 hover:bg-emerald-100/50 hover:text-emerald-600"
                                : "text-white hover:bg-white/20 hover:text-white"
                                }`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg border-2 border-white animate-bounce-slow">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${scrolled ? "text-gray-800" : "text-white"
                                }`}
                        >
                            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl animate-fade-in-down">
                    <div className="px-6 py-6 space-y-3">
                        {["Accueil", "Marché", "À propos", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("à propos", "about").replace("marché", "market")}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center p-4 rounded-2xl text-lg font-bold text-gray-800 hover:text-emerald-600 hover:bg-emerald-50/80 transition-all border border-transparent hover:border-emerald-100"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center p-4 rounded-2xl text-lg font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all mt-4 border-t border-gray-100"
                        >
                            <User className="w-5 h-5 mr-3" />
                            Espace Admin
                        </Link>
                    </div>
                </div>
            )}

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}

// Add this to your globals.css if not present for the animation
// @keyframes fade-in-down {
//     0% { opacity: 0; transform: translateY(-10px); }
//     100% { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in-down {
//     animation: fade-in-down 0.3s ease-out forwards;
// }

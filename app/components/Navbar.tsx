"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "glass shadow-sm py-2" : "bg-transparent py-4"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-3xl font-heading font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent tracking-tight hover:from-emerald-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105"
                        >
                            🌿 JaayNdougou
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {["Accueil", "Marché", "À propos", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("à propos", "about").replace("marché", "market")}`}
                                className={`${scrolled ? "text-gray-700 hover:text-emerald-600" : "text-white/90 hover:text-white"} font-medium transition-all duration-300 relative group py-2`}
                            >
                                {item}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${scrolled ? "bg-emerald-500" : "bg-white"} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 ${scrolled ? "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50" : "text-white/90 hover:text-white hover:bg-white/10"} transition-all duration-300 transform hover:scale-110 rounded-full`}
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/cart"
                            className={`p-2 ${scrolled ? "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50" : "text-white/90 hover:text-white hover:bg-white/10"} transition-all duration-300 relative transform hover:scale-110 rounded-full`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg animate-pulse-glow border-2 border-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 ${scrolled ? "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50" : "text-white hover:bg-white/10"} rounded-lg transition-all duration-300`}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-white/20 absolute w-full left-0 shadow-xl animate-fadeInUp">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {["Accueil", "Marché", "À propos", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("à propos", "about").replace("marché", "market")}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}

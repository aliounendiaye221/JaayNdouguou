import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%">
                    <pattern id="footer-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-pattern)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="text-3xl font-heading font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6 inline-block">
                            🌿 JaayNdougou
                        </Link>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Votre marché digital de confiance pour des produits frais, locaux et de qualité. Du champ à votre assiette, sans intermédiaire.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white mb-6">Navigation</h3>
                        <ul className="space-y-4">
                            {["Accueil", "Marché", "À propos", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === "Accueil" ? "/" : `/${item.toLowerCase().replace("à propos", "about").replace("marché", "market")}`}
                                        className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white mb-6">Contact</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-400 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                </div>
                                <span>Dakar & Rufisque,<br />Sénégal</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                                    <Phone className="w-5 h-5 text-emerald-500" />
                                </div>
                                <a href="tel:+221786037913" className="hover:text-emerald-400 transition-colors">+221 78 603 79 13</a>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                                    <Mail className="w-5 h-5 text-emerald-500" />
                                </div>
                                <a href="mailto:contact@jaayndougou.sn" className="hover:text-emerald-400 transition-colors">contact@jaayndougou.sn</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white mb-6">Newsletter</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Inscrivez-vous pour recevoir nos meilleures offres et nouveautés.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-1"
                            >
                                S'inscrire
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} <span className="text-emerald-400 font-bold">JaayNdougou</span>. Tous droits réservés.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Site conçu par <span className="text-emerald-400 font-bold">ALIOUNE NDIAYE</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

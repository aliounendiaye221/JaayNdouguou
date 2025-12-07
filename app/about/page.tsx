import Navbar from "../components/Navbar";
import Image from "next/image";
import { Mail, Phone, MapPin, Lightbulb, Target, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 py-20 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center animate-fadeInUp">
                        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 drop-shadow-2xl">
                            À propos de <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">JaayNdougou</span>
                        </h1>
                        <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
                            Innovant dans le secteur agricole sénégalais pour connecter directement les producteurs aux consommateurs
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Notre Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Révolutionner l'accès aux produits agricoles frais en digitalisant le marché traditionnel sénégalais
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Lightbulb className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Notre Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Devenir la plateforme de référence pour l'agriculture digitale au Sénégal et en Afrique de l'Ouest
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Nos Valeurs</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Fraîcheur garantie, transparence totale, et soutien aux producteurs locaux sénégalais
                        </p>
                    </div>
                </div>

                {/* Founder Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Side */}
                        <div className="relative h-96 md:h-auto bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl flex items-center justify-center">
                                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-6xl font-bold shadow-inner">
                                        AN
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="inline-block px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                        <span className="text-emerald-700 font-bold">🇸🇳 Sénégal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4 w-fit">
                                <span className="text-emerald-700 font-bold text-sm">Fondateur & Développeur</span>
                            </div>

                            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-4">
                                Alioune Ndiaye
                            </h2>

                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Étudiant passionné de 22 ans en développement d'applications web et mobile,
                                déterminé à transformer le secteur agricole sénégalais grâce à l'innovation technologique.
                            </p>

                            <div className="space-y-4 mb-8">
                                <p className="text-gray-700 leading-relaxed">
                                    💡 <strong className="text-emerald-700">Vision:</strong> Créer un pont digital entre les agriculteurs
                                    et les consommateurs pour garantir des produits frais, accessibles et à prix juste.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    🚀 <strong className="text-emerald-700">Objectif:</strong> Contribuer à la modernisation de l'agriculture
                                    sénégalaise tout en soutenant l'économie locale et les producteurs.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>

                                <a
                                    href="tel:+221786037913"
                                    className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium">+221 786 03 79 13</span>
                                </a>

                                <a
                                    href="mailto:aliounendiaye2511@gmail.com"
                                    className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium">aliounendiaye2511@gmail.com</span>
                                </a>

                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium">Dakar & Rufisque, Sénégal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why JaayNdougou Section */}
                <div className="mt-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent mb-12">
                        Pourquoi choisir JaayNdougou ?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="text-4xl mb-4">🌱</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Local</h3>
                            <p className="text-gray-600">Produits cultivés par des agriculteurs sénégalais</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Livraison Express</h3>
                            <p className="text-gray-600">Recevez vos produits en moins de 2 heures</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement Flexible</h3>
                            <p className="text-gray-600">Wave, Orange Money ou cash à la livraison</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Qualité Garantie</h3>
                            <p className="text-gray-600">Fraîcheur et qualité contrôlées quotidiennement</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400 text-sm">
                        &copy; 2025 <span className="font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">JaayNdougou</span>. Tous droits réservés. Dakar, Sénégal. 🇸🇳
                    </p>
                </div>
            </footer>
        </main>
    );
}

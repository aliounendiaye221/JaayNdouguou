import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Info, Truck, Leaf, ShieldCheck } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
                <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left animate-fadeInUp">
                            <h1 className="text-4xl tracking-tight font-heading font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-2xl">
                                <span className="block xl:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                                    Jaay Ndougou,
                                </span>{" "}
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300 xl:inline">
                                    mo yomb, mo gaaw !
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-emerald-50 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-medium leading-relaxed uppercase tracking-wide">
                                Votre marché digital n°1 à Dakar et Rufisque. Des légumes frais, bio et locaux livrés directement chez vous en moins de 2h. <span className="font-bold text-white">Commandez facile, payez Wave ou Orange Money.</span>
                            </p>
                            <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                                <div className="rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105">
                                    <Link
                                        href="/market"
                                        className="w-full flex items-center justify-center px-8 py-4 border-2 border-transparent text-base font-bold rounded-full bg-white text-emerald-700 hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl md:text-lg md:px-10 gap-2"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Faire le marché
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 transform transition-all duration-300 hover:scale-105">
                                    <Link
                                        href="/about"
                                        className="w-full flex items-center justify-center px-8 py-4 border-2 border-white/80 backdrop-blur-sm bg-white/10 text-base font-bold rounded-full text-white hover:bg-white/20 hover:border-white transition-all duration-300 md:text-lg md:px-10 gap-2"
                                    >
                                        <Info className="w-5 h-5" />
                                        En savoir plus
                                    </Link>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-emerald-100">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-emerald-300" />
                                    <span className="text-sm font-medium">Livraison rapide</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-emerald-300" />
                                    <span className="text-sm font-medium">Produits 100% frais</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                    <span className="text-sm font-medium">Paiement sécurisé</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="relative h-56 w-full sm:h-72 md:h-96 lg:h-full group">
                    <Image
                        src="/hero-vegetables.png"
                        alt="Légumes frais au marché"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/50 to-transparent lg:from-emerald-900/30 lg:via-emerald-800/20 lg:to-transparent mix-blend-multiply"></div>
                    {/* Overlay pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="1" fill="white" />
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

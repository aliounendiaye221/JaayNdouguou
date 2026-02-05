"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { WHATSAPP_NUMBERS } from "../utils/whatsapp";

interface WhatsAppButtonProps {
    message?: string;
    className?: string;
}

export default function WhatsAppButton({
    message = "Bonjour! Je suis intéressé par vos produits JaayNdougou.",
    className = ""
}: WhatsAppButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleWhatsAppClick = (number: string) => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ${className}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Contact Options */}
            <div className={`flex flex-col gap-2 transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}`}>
                {WHATSAPP_NUMBERS.map((contact) => (
                    <button
                        key={contact.id}
                        onClick={() => handleWhatsAppClick(contact.number)}
                        className="group flex items-center gap-3 bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm bg-gradient-to-br ${contact.id === 'maimouna' ? 'from-orange-400 to-yellow-500' : 'from-emerald-400 to-green-600'}`}>
                            {contact.id === 'alioune' ? 'AN' : 'MS'}
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-sm font-bold text-gray-900">{contact.name}</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{contact.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Button */}
            <button
                className={`group relative p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-90 ${isOpen ? 'bg-gray-800 rotate-90 scale-110 shadow-emerald-500/20' : 'bg-gradient-to-r from-green-500 to-green-600 animate-bounce hover:animate-none'}`}
                aria-label="Contacter via WhatsApp"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MessageCircle className={`w-7 h-7 text-white transition-transform duration-500 ${isOpen ? 'rotate-[-90deg]' : ''}`} />

                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
                )}
            </button>
        </div>
    );
}

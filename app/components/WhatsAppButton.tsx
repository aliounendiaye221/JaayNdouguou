"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
    className?: string;
}

export default function WhatsAppButton({
    phoneNumber = "+221786037913",
    message = "Bonjour! Je suis intéressé par vos produits JaayNdougou.",
    className = ""
}: WhatsAppButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
                aria-label="Contacter via WhatsApp"
            >
                <MessageCircle className="w-7 h-7" />

                {/* Tooltip */}
                <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
                    Commander sur WhatsApp
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>

                {/* Ripple effect */}
                <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
            </button>
        </div>
    );
}

// WhatsApp Business Number
export const WHATSAPP_BUSINESS_NUMBER = "+221786037913";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
}

export function formatCartForWhatsApp(items: CartItem[], total: number): string {
    let message = `🌿 *Nouvelle Commande - JaayNdougou*\n\n`;
    message += `📦 *Détails de la commande:*\n\n`;

    items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Quantité: ${item.quantity} ${item.unit}\n`;
        message += `   Prix: ${item.price * item.quantity} FCFA\n\n`;
    });

    message += `💰 *Total: ${total} FCFA*\n\n`;
    message += "📍 Je souhaite passer cette commande. Merci!";

    return message;
}

export function openWhatsAppWithMessage(phoneNumber: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

export function formatProductForWhatsApp(productName: string, price: number, quantity: number = 1): string {
    let message = `🌿 *Commande Rapide - JaayNdougou*\n\n`;
    message += `Produit: *${productName}*\n`;
    message += `Quantité: ${quantity}\n`;
    message += `Prix: ${price * quantity} FCFA\n\n`;
    message += "Je souhaite commander ce produit. Merci!";

    return message;
}

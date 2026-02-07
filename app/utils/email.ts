import { Resend } from 'resend';

// Initialisation lazy — ne pas crasher si la clé n'est pas définie
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    orderItems: Array<{
        name: string;
        quantity: number;
        price: number;
        unit: string;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    paymentMethod: string;
}

export async function sendOrderConfirmationEmail(
    email: string,
    props: OrderConfirmationEmailProps
) {
    const itemsHtml = props.orderItems
        .map(
            (item) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unit}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price} FCFA</td>
        </tr>
    `
        )
        .join('');

    const paymentMethodLabel = {
        cod: 'Paiement à la livraison',
        wave: 'Wave',
        'orange-money': 'Orange Money',
    }[props.paymentMethod] || props.paymentMethod;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🌿 JaayNdougou</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Merci pour votre commande!</p>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
            Bonjour <strong>${props.customerName}</strong>,
        </p>
        
        <p style="color: #6b7280; margin-bottom: 20px;">
            Votre commande <strong>#${props.orderNumber}</strong> a été confirmée et sera livrée dans les plus brefs délais.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #10B981; margin-top: 0; font-size: 20px;">Détails de la commande</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #10B981;">Produit</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #10B981;">Quantité</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #10B981;">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="text-align: right; padding: 10px 0; border-top: 2px solid #e5e7eb;">
                <p style="margin: 5px 0; color: #6b7280;">Sous-total: <strong>${props.subtotal} FCFA</strong></p>
                <p style="margin: 5px 0; color: #6b7280;">Frais de livraison: <strong>${props.deliveryFee} FCFA</strong></p>
                <p style="margin: 10px 0; color: #10B981; font-size: 20px;">
                    <strong>Total: ${props.total} FCFA</strong>
                </p>
            </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #10B981; margin-top: 0;">Informations de livraison</h3>
            <p style="color: #6b7280; margin: 5px 0;">📍 ${props.deliveryAddress}</p>
            <p style="color: #6b7280; margin: 5px 0;">💳 ${paymentMethodLabel}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
            Pour toute question, contactez-nous au <strong>+221 78 603 79 13</strong>
        </p>
    </div>
</body>
</html>
    `;

    if (!resend) {
        console.warn('RESEND_API_KEY not configured — email not sent');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const data = await resend.emails.send({
            from: 'JaayNdougou <commandes@jaayndougou.sn>',
            to: [email],
            subject: `Confirmation de commande #${props.orderNumber}`,
            html: html,
        });

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

export async function sendContactEmail(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">📧 Nouveau message de contact</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <p><strong>Nom:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Téléphone:</strong> ${data.phone}</p>
            <p><strong>Sujet:</strong> ${data.subject}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 6px;">
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 10px 0 0 0; color: #4b5563;">${data.message}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    if (!resend) {
        console.warn('RESEND_API_KEY not configured — email not sent');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const result = await resend.emails.send({
            from: 'JaayNdougou Contact <contact@jaayndougou.sn>',
            to: ['contact@jaayndougou.sn'],
            replyTo: data.email,
            subject: `Nouveau message: ${data.subject}`,
            html: html,
        });

        return { success: true, data: result };
    } catch (error) {
        console.error('Error sending contact email:', error);
        return { success: false, error };
    }
}

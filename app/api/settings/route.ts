import { NextResponse } from 'next/server';
import { getStoreConfig } from '@/app/utils/storeConfig';

export const dynamic = 'force-dynamic';

/**
 * GET: Paramètres publics de la boutique (frais de livraison, seuil, message)
 */
export async function GET() {
    try {
        const config = await getStoreConfig();

        const publicConfig = {
            deliveryFee: config.deliveryFee,
            freeDeliveryThreshold: config.freeDeliveryThreshold,
            whatsappNumber: config.whatsappNumber,
            storeOpen: config.storeOpen,
            announcementMessage: config.announcementMessage,
        };

        const response = NextResponse.json(publicConfig);
        // Cache court (60 secondes) pour réactivité tout en soulageant la base
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
        return response;
    } catch (error) {
        console.error('Failed to get public settings:', error);
        // Valeurs par défaut de secours
        return NextResponse.json({
            deliveryFee: 1500,
            freeDeliveryThreshold: 10000,
            whatsappNumber: '+221786037913',
            storeOpen: true,
            announcementMessage: 'Livraison rapide en 2h à Dakar et Rufisque !',
        });
    }
}

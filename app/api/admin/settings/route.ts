import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getStoreConfig, updateStoreConfig } from '@/app/utils/storeConfig';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
    deliveryFee: z.number().min(0, 'Les frais de livraison ne peuvent pas être négatifs'),
    freeDeliveryThreshold: z.number().min(0, 'Le seuil de gratuité ne peut pas être négatif'),
    whatsappNumber: z.string().min(8, 'Numéro WhatsApp invalide'),
    storeOpen: z.boolean(),
    announcementMessage: z.string().nullable().optional(),
});

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const config = await getStoreConfig();
        const response = NextResponse.json(config);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return response;
    } catch (error) {
        console.error('Failed to get admin settings:', error);
        return NextResponse.json({ error: 'Échec de la récupération des paramètres' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const validated = settingsSchema.parse(body);

        const updated = await updateStoreConfig(validated);
        return NextResponse.json({ success: true, config: updated });
    } catch (error) {
        console.error('Failed to update admin settings:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Paramètres invalides', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Échec de la mise à jour des paramètres' }, { status: 500 });
    }
}

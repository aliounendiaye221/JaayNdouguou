import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const claims = await prisma.claim.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                order: true
            }
        });
        const response = NextResponse.json(claims);
        
        // Add headers to prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch {
        return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }
}

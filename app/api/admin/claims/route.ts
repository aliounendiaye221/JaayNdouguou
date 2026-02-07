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
        
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch {
        return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { claimId, status } = body;

        if (!claimId) {
            return NextResponse.json({ error: 'Claim ID is required' }, { status: 400 });
        }

        const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedClaim = await prisma.claim.update({
            where: { id: claimId },
            data: { status },
            include: {
                customer: true,
                order: true
            }
        });

        return NextResponse.json(updatedClaim);
    } catch (error) {
        console.error('Failed to update claim:', error);
        return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
    }
}

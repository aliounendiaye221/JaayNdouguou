import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { auth } from '@/auth';

// Force dynamic because we are fetching real-time data
export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [
            totalOrders,
            ordersToday,
            recentOrders,
            pendingClaims,
            totalRevenue
        ] = await Promise.all([
            // Total Orders
            prisma.order.count(),

            // Orders Today
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),

            // Recent Orders
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { customer: true }
            }),

            // Pending Claims
            prisma.claim.count({
                where: { status: 'pending' }
            }),

            // Total Revenue (Paid Orders)
            prisma.order.aggregate({
                _sum: { total: true },
                where: { paymentStatus: 'paid' }
            })
        ]);

        return NextResponse.json({
            stats: {
                totalOrders,
                ordersToday,
                pendingClaims,
                totalRevenue: totalRevenue._sum.total || 0
            },
            recentOrders
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

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
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Une seule requête SQL pour toutes les stats de commandes
        const [orderStats] = await prisma.$queryRaw<any[]>`
            SELECT
                COUNT(*)::int AS "totalOrders",
                COUNT(*) FILTER (WHERE "createdAt" >= ${startOfDay})::int AS "ordersToday",
                COUNT(*) FILTER (WHERE "createdAt" >= ${startOfWeek})::int AS "ordersThisWeek",
                COUNT(*) FILTER (WHERE "createdAt" >= ${startOfMonth})::int AS "ordersThisMonth",
                COUNT(*) FILTER (WHERE "paymentStatus" = 'paid')::int AS "paidOrders",
                COUNT(*) FILTER (WHERE "status" = 'pending')::int AS "pendingOrders",
                COUNT(*) FILTER (WHERE "status" IN ('confirmed', 'preparing', 'delivering'))::int AS "deliveringOrders",
                COUNT(*) FILTER (WHERE "status" = 'delivered')::int AS "deliveredOrders",
                COUNT(*) FILTER (WHERE "status" = 'cancelled')::int AS "cancelledOrders",
                COALESCE(SUM("total") FILTER (WHERE "paymentStatus" = 'paid'), 0)::float AS "totalRevenue",
                COALESCE(SUM("total") FILTER (WHERE "paymentStatus" = 'paid' AND "createdAt" >= ${startOfDay}), 0)::float AS "revenueToday",
                COALESCE(SUM("total") FILTER (WHERE "paymentStatus" = 'paid' AND "createdAt" >= ${startOfWeek}), 0)::float AS "revenueThisWeek",
                COALESCE(SUM("total") FILTER (WHERE "paymentStatus" = 'paid' AND "createdAt" >= ${startOfMonth}), 0)::float AS "revenueThisMonth"
            FROM "Order"
        `;

        // Requête séparée pour les claims (table différente)
        const pendingClaims = await prisma.claim.count({
            where: { status: 'pending' }
        });

        // Commandes récentes
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        const {
            totalOrders, ordersToday, ordersThisWeek, ordersThisMonth,
            paidOrders, pendingOrders, deliveringOrders, deliveredOrders, cancelledOrders,
            totalRevenue, revenueToday, revenueThisWeek, revenueThisMonth
        } = orderStats;

        // Calcul du taux de conversion
        const conversionRate = totalOrders > 0 ? parseFloat(((paidOrders / totalOrders) * 100).toFixed(1)) : 0;
        
        // Calcul de la valeur moyenne des commandes
        const averageOrderValue = paidOrders > 0 
            ? Math.round(totalRevenue / paidOrders)
            : 0;

        const stats = {
            totalOrders,
            ordersToday,
            ordersThisWeek,
            ordersThisMonth,
            paidOrders,
            pendingOrders,
            deliveringOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
            revenueToday,
            revenueThisWeek,
            revenueThisMonth,
            averageOrderValue,
            conversionRate,
            pendingClaims,
            lastUpdated: new Date().toISOString()
        };

        const response = NextResponse.json({
            stats,
            recentOrders
        });

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

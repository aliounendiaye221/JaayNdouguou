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

        const [
            totalOrders,
            ordersToday,
            ordersThisWeek,
            ordersThisMonth,
            paidOrders,
            totalRevenue,
            revenueToday,
            revenueThisWeek,
            revenueThisMonth,
            pendingOrders,
            deliveringOrders,
            deliveredOrders,
            cancelledOrders,
            pendingClaims,
            recentOrders
        ] = await Promise.all([
            // Compteurs de commandes
            prisma.order.count(),
            prisma.order.count({
                where: { createdAt: { gte: startOfDay } }
            }),
            prisma.order.count({
                where: { createdAt: { gte: startOfWeek } }
            }),
            prisma.order.count({
                where: { createdAt: { gte: startOfMonth } }
            }),
            
            // Commandes payées
            prisma.order.count({
                where: { paymentStatus: 'paid' }
            }),

            // Revenus
            prisma.order.aggregate({
                where: { paymentStatus: 'paid' },
                _sum: { total: true }
            }),
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'paid',
                    createdAt: { gte: startOfDay }
                },
                _sum: { total: true }
            }),
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'paid',
                    createdAt: { gte: startOfWeek }
                },
                _sum: { total: true }
            }),
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'paid',
                    createdAt: { gte: startOfMonth }
                },
                _sum: { total: true }
            }),

            // Statuts des commandes
            prisma.order.count({
                where: { status: 'pending' }
            }),
            prisma.order.count({
                where: { status: { in: ['confirmed', 'preparing', 'delivering'] } }
            }),
            prisma.order.count({
                where: { status: 'delivered' }
            }),
            prisma.order.count({
                where: { status: 'cancelled' }
            }),

            // Réclamations en attente
            prisma.claim.count({
                where: { status: 'pending' }
            }),

            // Commandes récentes
            prisma.order.findMany({
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
            })
        ]);

        // Calcul du taux de conversion
        const conversionRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : '0';
        
        // Calcul de la valeur moyenne des commandes
        const averageOrderValue = paidOrders > 0 
            ? Math.round((totalRevenue._sum.total || 0) / paidOrders)
            : 0;

        const stats = {
            // Commandes
            totalOrders,
            ordersToday,
            ordersThisWeek,
            ordersThisMonth,
            paidOrders,
            pendingOrders,
            deliveringOrders,
            deliveredOrders,
            cancelledOrders,

            // Revenus
            totalRevenue: totalRevenue._sum.total || 0,
            revenueToday: revenueToday._sum.total || 0,
            revenueThisWeek: revenueThisWeek._sum.total || 0,
            revenueThisMonth: revenueThisMonth._sum.total || 0,
            averageOrderValue,

            // Métriques
            conversionRate: parseFloat(conversionRate),
            pendingClaims,

            // Timestamp pour le cache
            lastUpdated: new Date().toISOString()
        };

        const response = NextResponse.json({
            stats,
            recentOrders
        });

        // Add headers to prevent caching
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

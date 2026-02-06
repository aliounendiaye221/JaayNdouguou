import { NextResponse } from 'next/server';
import { prisma, getDbInfo } from '@/app/utils/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Désactiver complètement le cache

export async function GET(request: Request) {
    const requestId = `REQ-${Date.now().toString(36)}`;
    console.log(`📥 [ADMIN/ORDERS] ${requestId} - Nouvelle requête GET`);
    
    const session = await auth();
    if (!session) {
        console.log(`❌ [ADMIN/ORDERS] ${requestId} - Non authentifié`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log(`✅ [ADMIN/ORDERS] ${requestId} - Authentifié: ${session.user?.email}`);

    try {
        // Log de traçabilité DB
        const dbInfo = getDbInfo();
        console.log(`🔌 [ADMIN/ORDERS] ${requestId} - DB: ${dbInfo.main?.host} (${dbInfo.vercelEnv})`);
        
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        
        const skip = (page - 1) * limit;
        
        // Construction des filtres dynamiques
        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customer: { firstName: { contains: search, mode: 'insensitive' } } },
                { customer: { lastName: { contains: search, mode: 'insensitive' } } },
                { customer: { phone: { contains: search } } },
            ];
        }
        
        // Requête avec pagination optimisée
        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
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
            }),
            prisma.order.count({ where })
        ]);
        
        console.log(`📊 [ADMIN/ORDERS] ${requestId} - Commandes trouvées: ${orders.length}/${totalCount}`);
        
        const response = NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + orders.length < totalCount
            }
        });

        // Add headers to prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { orderId, status, paymentStatus } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                customer: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('id');

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Supprimer d'abord les articles de la commande
        await prisma.orderItem.deleteMany({
            where: { orderId }
        });

        // Puis supprimer la commande
        const deletedOrder = await prisma.order.delete({
            where: { id: orderId }
        });

        console.log(`🗑️ Commande supprimée: ${deletedOrder.orderNumber}`);
        return NextResponse.json({ success: true, message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('Failed to delete order:', error);
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}

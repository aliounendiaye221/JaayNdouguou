import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { sendOrderConfirmationEmail } from '@/app/utils/email';
import {
    initiateWavePayment,
    initiateOrangeMoneyPayment,
} from '@/app/utils/payment';
import { z } from 'zod';
import { auth } from '@/auth';

// Validation schema
const orderSchema = z.object({
    customerInfo: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(8),
    }),
    deliveryInfo: z.object({
        address: z.string().min(5),
        city: z.string().min(2),
        phone: z.string().min(8),
        notes: z.string().optional(),
    }),
    items: z.array(
        z.object({
            productId: z.string(),
            name: z.string(),
            quantity: z.number().positive(),
            price: z.number().positive(),
            unit: z.string(),
        })
    ).min(1),
    paymentMethod: z.enum(['cod', 'wave', 'orange-money']),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validatedData = orderSchema.parse(body);
        const { customerInfo, items, paymentMethod, deliveryInfo } = validatedData;

        // Calculate totals
        const subtotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const deliveryFee = subtotal >= 10000 ? 0 : 1500; // Free delivery over 10,000 FCFA
        const total = subtotal + deliveryFee;

        // Generate order number
        const orderNumber = `JN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Handle payment processing
        let paymentId: string | undefined;
        let paymentStatus = 'pending';

        if (paymentMethod === 'wave') {
            const waveResult = await initiateWavePayment({
                amount: total,
                currency: 'XOF',
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customerPhone: customerInfo.phone,
                orderNumber,
            });

            if (waveResult.success) {
                paymentId = waveResult.transactionId;
                // If NO API KEY (Manual Mode), keep status PENDING for verification
                if (!process.env.WAVE_API_KEY) {
                    paymentStatus = 'pending';
                } else if (process.env.NODE_ENV !== 'production') {
                    // Dev simulation with keys? mark paid. 
                    // But usually dev doesn't have keys. 
                    // Let's assume without keys = manual transfer = pending
                    paymentStatus = 'pending';
                } else {
                    // Production with keys, and success returned -> likely initiated, wait for webhook
                    // But initiation success doesn't mean paid yet.
                    paymentStatus = 'pending';
                }
            } else {
                return NextResponse.json(
                    { error: 'Payment initiation failed', details: waveResult.error },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'orange-money') {
            const omResult = await initiateOrangeMoneyPayment({
                amount: total,
                currency: 'XOF',
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                customerPhone: customerInfo.phone,
                orderNumber,
            });

            if (omResult.success) {
                paymentId = omResult.transactionId;
                // Manual mode: Pending verification
                if (!process.env.ORANGE_MONEY_API_KEY) {
                    paymentStatus = 'pending';
                }
            } else {
                return NextResponse.json(
                    { error: 'Payment initiation failed', details: omResult.error },
                    { status: 400 }
                );
            }
        } else {
            // Cash on delivery
            paymentStatus = 'pending';
        }

        // Try to save to database, but fallback to simulation if it fails (e.g. on Vercel without Postgres)
        let order;
        try {
            // Create or find customer
            let customer = await prisma.customer.findUnique({
                where: { email: customerInfo.email },
            });

            if (!customer) {
                customer = await prisma.customer.create({
                    data: {
                        firstName: customerInfo.firstName,
                        lastName: customerInfo.lastName,
                        email: customerInfo.email,
                        phone: customerInfo.phone,
                        address: deliveryInfo.address,
                        city: deliveryInfo.city,
                    },
                });
            }

            order = await prisma.order.create({
                data: {
                    orderNumber,
                    customerId: customer.id,
                    deliveryAddress: deliveryInfo.address,
                    deliveryCity: deliveryInfo.city,
                    deliveryPhone: deliveryInfo.phone,
                    deliveryNotes: deliveryInfo.notes || '',
                    paymentMethod,
                    paymentStatus,
                    paymentId,
                    subtotal,
                    deliveryFee,
                    total,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
        } catch (dbError) {
            console.warn("Database operation failed, falling back to simulation mode:", dbError);
            // Mock order object for response
            order = {
                id: 'simulated-id',
                orderNumber,
                total,
                status: 'pending',
                paymentStatus,
                items: items
            };
        }

        // Send confirmation email
        try {
            await sendOrderConfirmationEmail(customerInfo.email, {
                customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                orderNumber: orderNumber,
                orderItems: items,
                subtotal,
                deliveryFee,
                total,
                deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}`,
                paymentMethod,
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        return NextResponse.json({
            success: true,
            order: {
                id: order.id || 'simulated',
                orderNumber: orderNumber,
                total: total,
                status: order.status || 'pending',
                paymentStatus: order.paymentStatus || paymentStatus,
                warning: !order.id ? "Order processed in DEMO mode (not saved to DB)" : undefined
            },
        });
    } catch (error) {
        console.error('Error creating order:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');

        if (orderNumber) {
            // Get specific order
            const order = await prisma.order.findUnique({
                where: { orderNumber },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!order) {
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ order });
        } else {
            // Get all orders (admin functionality) - Protect this!
            const session = await auth();
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const orders = await prisma.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return NextResponse.json({ orders });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

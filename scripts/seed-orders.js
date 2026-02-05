const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedOrders() {
    try {
        console.log('🌱 Seeding orders...');

        // Créer des clients
        const customer1 = await prisma.customer.upsert({
            where: { email: 'moussa.sarr@example.com' },
            update: {},
            create: {
                firstName: 'Moussa',
                lastName: 'Sarr',
                email: 'moussa.sarr@example.com',
                phone: '+221771234567',
                address: 'Cité Keur Gorgui, Rue 12',
                city: 'Dakar'
            }
        });

        const customer2 = await prisma.customer.upsert({
            where: { email: 'awa.diop@example.com' },
            update: {},
            create: {
                firstName: 'Awa',
                lastName: 'Diop',
                email: 'awa.diop@example.com',
                phone: '+221781234567',
                address: 'Parcelles Assainies, Unité 15',
                city: 'Dakar'
            }
        });

        const customer3 = await prisma.customer.upsert({
            where: { email: 'abdou.ndiaye@example.com' },
            update: {},
            create: {
                firstName: 'Abdou',
                lastName: 'Ndiaye',
                email: 'abdou.ndiaye@example.com',
                phone: '+221761234567',
                address: 'Rufisque Centre, près du marché',
                city: 'Rufisque'
            }
        });

        // Récupérer des produits existants
        const products = await prisma.product.findMany({ take: 5 });
        
        if (products.length < 2) {
            console.log('⚠️  Not enough products found. Please seed products first.');
            console.log('Run: node ./scripts/seed-real-data.js');
            return;
        }

        // Créer des commandes
        const order1 = await prisma.order.create({
            data: {
                orderNumber: 'JN-ORD-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                customerId: customer1.id,
                deliveryAddress: customer1.address || 'Cité Keur Gorgui',
                deliveryCity: customer1.city || 'Dakar',
                deliveryPhone: customer1.phone,
                deliveryNotes: 'Appeler 10 minutes avant la livraison',
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                status: 'confirmed',
                subtotal: 8500,
                deliveryFee: 1500,
                total: 10000,
                items: {
                    create: [
                        {
                            productId: products[0].id,
                            quantity: 2,
                            price: products[0].price
                        },
                        {
                            productId: products[1].id,
                            quantity: 1,
                            price: products[1].price
                        }
                    ]
                }
            }
        });

        const order2 = await prisma.order.create({
            data: {
                orderNumber: 'JN-ORD-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                customerId: customer2.id,
                deliveryAddress: customer2.address || 'Parcelles Assainies',
                deliveryCity: customer2.city || 'Dakar',
                deliveryPhone: customer2.phone,
                paymentMethod: 'wave',
                paymentStatus: 'paid',
                paymentId: 'WAVE-' + Date.now(),
                status: 'delivering',
                subtotal: 15000,
                deliveryFee: 2000,
                total: 17000,
                items: {
                    create: [
                        {
                            productId: products[2].id,
                            quantity: 3,
                            price: products[2].price
                        }
                    ]
                }
            }
        });

        const order3 = await prisma.order.create({
            data: {
                orderNumber: 'JN-ORD-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                customerId: customer3.id,
                deliveryAddress: customer3.address || 'Rufisque Centre',
                deliveryCity: customer3.city || 'Rufisque',
                deliveryPhone: customer3.phone,
                deliveryNotes: 'Livraison entre 14h et 16h',
                paymentMethod: 'orange-money',
                paymentStatus: 'paid',
                paymentId: 'OM-' + Date.now(),
                status: 'delivered',
                subtotal: 22000,
                deliveryFee: 3000,
                total: 25000,
                items: {
                    create: [
                        {
                            productId: products[0].id,
                            quantity: 5,
                            price: products[0].price
                        },
                        {
                            productId: products[1].id,
                            quantity: 2,
                            price: products[1].price
                        }
                    ]
                }
            }
        });

        console.log('✅ Orders seeded successfully!');
        console.log(`Created orders: ${order1.orderNumber}, ${order2.orderNumber}, ${order3.orderNumber}`);

    } catch (error) {
        console.error('Error seeding orders:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedOrders();

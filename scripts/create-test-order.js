const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrder() {
    try {
        console.log('🧪 Création d\'une commande de test...\n');
        
        // Créer ou trouver un client
        let customer = await prisma.customer.findFirst({
            where: { email: 'test@jaayndougou.sn' }
        });
        
        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    firstName: 'Client',
                    lastName: 'Test',
                    email: 'test@jaayndougou.sn',
                    phone: '+221701234567',
                    address: 'Test Address',
                    city: 'Dakar'
                }
            });
            console.log('✅ Client créé:', customer.firstName, customer.lastName);
        } else {
            console.log('✅ Client existant:', customer.firstName, customer.lastName);
        }
        
        // Récupérer un produit
        const product = await prisma.product.findFirst({
            where: { isAvailable: true }
        });
        
        if (!product) {
            console.log('❌ Aucun produit disponible');
            return;
        }
        
        console.log('✅ Produit sélectionné:', product.name);
        
        // Créer une commande
        const orderNumber = `JN-ORD-TEST-${Date.now().toString().slice(-6)}`;
        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerId: customer.id,
                deliveryAddress: customer.address,
                deliveryCity: customer.city,
                deliveryPhone: customer.phone,
                deliveryNotes: 'Commande de test',
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                subtotal: product.price * 2,
                deliveryFee: 1500,
                total: (product.price * 2) + 1500,
                status: 'pending',
                items: {
                    create: [{
                        productId: product.id,
                        quantity: 2,
                        price: product.price
                    }]
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                customer: true
            }
        });
        
        console.log('\n✅ COMMANDE CRÉÉE AVEC SUCCÈS!\n');
        console.log('📝 Numéro:', order.orderNumber);
        console.log('👤 Client:', order.customer.firstName, order.customer.lastName);
        console.log('💰 Total:', order.total, 'FCFA');
        console.log('📦 Articles:', order.items.length);
        console.log('📍 Statut:', order.status);
        console.log('\n🔗 Vérifiez dans l\'admin: http://localhost:3000/admin/orders');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createTestOrder();

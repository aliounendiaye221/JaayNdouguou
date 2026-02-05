const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with real data...');

    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026', 10);
    
    await prisma.admin.upsert({
        where: { email: 'admin@jaayndougou.sn' },
        update: {},
        create: {
            email: 'admin@jaayndougou.sn',
            password: hashedPassword,
            name: 'Administrateur Principal',
            role: 'super-admin',
        },
    });

    // 2. Create products
    console.log('🥬 Creating products...');
    const products = [
        { id: 'ail', name: 'Ail', price: 500, unit: 'Le kg', image: '/ail.png', category: 'Légumes', description: 'Ail frais du Sénégal', stock: 50 },
        { id: 'banane', name: 'Banane', price: 800, unit: 'Le régime', image: '/banane.png', category: 'Fruits', description: 'Bananes mûres', stock: 30 },
        { id: 'gingembre', name: 'Gingembre', price: 1200, unit: 'Le kg', image: '/gingembre.png', category: 'Tubercules', description: 'Gingembre bio', stock: 40 },
        { id: 'mangue', name: 'Mangue', price: 1500, unit: 'Les 5', image: '/mangue.png', category: 'Fruits', description: 'Mangues Kent', stock: 25 },
        { id: 'menthe_fraiche', name: 'Menthe fraîche', price: 300, unit: 'La botte', image: '/menthe_fraiche.png', category: 'Légumes', description: 'Menthe du jardin', stock: 60 },
        { id: 'orange', name: 'Orange', price: 1000, unit: 'Le kg', image: '/orange.png', category: 'Fruits', description: 'Oranges juteuses', stock: 35 },
        { id: 'piment_fort', name: 'Piment fort', price: 400, unit: 'Les 100g', image: '/piment_fort.png', category: 'Légumes', description: 'Piment très fort', stock: 70 },
        { id: 'pomme', name: 'Pomme', price: 2000, unit: 'Le kg', image: '/pomme.png', category: 'Fruits', description: 'Pommes importées', stock: 20 },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: product,
            create: product,
        });
    }

    // 3. Create sample customers
    console.log('👥 Creating customers...');
    const customers = [
        { id: 'cust1', firstName: 'Aminata', lastName: 'Diop', email: 'aminata.diop@email.sn', phone: '+221771234567', city: 'Dakar', address: 'Plateau, Rue 10' },
        { id: 'cust2', firstName: 'Moussa', lastName: 'Sy', email: 'moussa.sy@email.sn', phone: '+221772345678', city: 'Pikine', address: 'Guinaw Rails Sud' },
        { id: 'cust3', firstName: 'Fatou', lastName: 'Sarr', email: 'fatou.sarr@email.sn', phone: '+221773456789', city: 'Thiès', address: 'Cité Malick Sy' },
        { id: 'cust4', firstName: 'Ibrahima', lastName: 'Fall', email: 'ibrahima.fall@email.sn', phone: '+221774567890', city: 'Rufisque', address: 'Zone de Captage' },
        { id: 'cust5', firstName: 'Khady', lastName: 'Ndiaye', email: 'khady.ndiaye@email.sn', phone: '+221775678901', city: 'Guédiawaye', address: 'Médina Gounass' },
    ];

    for (const customer of customers) {
        await prisma.customer.upsert({
            where: { email: customer.email },
            update: customer,
            create: customer,
        });
    }

    // 4. Create sample orders
    console.log('📦 Creating orders...');
    const orders = [
        {
            id: 'ord1',
            orderNumber: 'CMD-2026-001',
            customerId: 'cust1',
            deliveryAddress: 'Plateau, Rue 10',
            deliveryCity: 'Dakar',
            deliveryPhone: '+221771234567',
            paymentMethod: 'wave',
            paymentStatus: 'paid',
            subtotal: 3500,
            deliveryFee: 1000,
            total: 4500,
            status: 'delivered',
            createdAt: new Date('2026-01-15'),
        },
        {
            id: 'ord2',
            orderNumber: 'CMD-2026-002',
            customerId: 'cust2',
            deliveryAddress: 'Guinaw Rails Sud',
            deliveryCity: 'Pikine',
            deliveryPhone: '+221772345678',
            paymentMethod: 'orange-money',
            paymentStatus: 'paid',
            subtotal: 2800,
            deliveryFee: 1500,
            total: 4300,
            status: 'delivering',
            createdAt: new Date('2026-02-01'),
        },
        {
            id: 'ord3',
            orderNumber: 'CMD-2026-003',
            customerId: 'cust3',
            deliveryAddress: 'Cité Malick Sy',
            deliveryCity: 'Thiès',
            deliveryPhone: '+221773456789',
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            subtotal: 5200,
            deliveryFee: 2000,
            total: 7200,
            status: 'preparing',
            createdAt: new Date('2026-02-04'),
        },
    ];

    for (const order of orders) {
        await prisma.order.upsert({
            where: { orderNumber: order.orderNumber },
            update: order,
            create: order,
        });
    }

    // 5. Create order items
    console.log('🛍️ Creating order items...');
    const orderItems = [
        { orderId: 'ord1', productId: 'ail', quantity: 2, price: 500 },
        { orderId: 'ord1', productId: 'banane', quantity: 3, price: 800 },
        { orderId: 'ord2', productId: 'gingembre', quantity: 1, price: 1200 },
        { orderId: 'ord2', productId: 'mangue', quantity: 1, price: 1500 },
        { orderId: 'ord3', productId: 'orange', quantity: 3, price: 1000 },
        { orderId: 'ord3', productId: 'pomme', quantity: 1, price: 2000 },
    ];

    for (const item of orderItems) {
        await prisma.orderItem.create({
            data: item,
        });
    }

    // 6. Create sample claims
    console.log('⚠️ Creating claims...');
    await prisma.claim.create({
        data: {
            customerId: 'cust1',
            orderId: 'ord1',
            subject: 'Produit endommagé',
            description: 'Les bananes sont arrivées trop mûres',
            status: 'resolved',
        },
    });

    await prisma.claim.create({
        data: {
            customerId: 'cust2',
            subject: 'Retard de livraison',
            description: 'La commande devait arriver hier',
            status: 'pending',
        },
    });

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 1 Admin user');
    console.log('  - 8 Products');
    console.log('  - 5 Customers');
    console.log('  - 3 Orders');
    console.log('  - 6 Order items');
    console.log('  - 2 Claims');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error('❌ Error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });

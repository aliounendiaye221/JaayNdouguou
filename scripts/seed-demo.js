const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            const trimmedKey = key.trim();
            if (!trimmedKey.startsWith('#')) {
                process.env[trimmedKey] = value.trim().replace(/^["']|["']$/g, '');
            }
        }
    });
}

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding demo data...');

    // 1. Create Products (if not exist)
    const products = [
        { name: 'Oignon Local', price: 400, unit: 'kg', category: 'Légumes', image: '/oignon.png' },
        { name: 'Pomme de terre', price: 500, unit: 'kg', category: 'Légumes', image: '/pomme-terre.png' },
        { name: 'Carotte', price: 600, unit: 'kg', category: 'Légumes', image: '/carotte.png' },
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { id: p.name.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: {
                id: p.name.toLowerCase().replace(/\s+/g, '-'),
                ...p
            }
        });
    }

    // 2. Create Customers
    const customers = [
        { firstName: 'Fatou', lastName: 'Diop', email: 'fatou@example.com', phone: '770000001', city: 'Dakar' },
        { firstName: 'Moussa', lastName: 'Ndiaye', email: 'moussa@example.com', phone: '770000002', city: 'Rufisque' },
    ];

    const createdCustomers = [];
    for (const c of customers) {
        const cust = await prisma.customer.upsert({
            where: { email: c.email },
            update: {},
            create: c
        });
        createdCustomers.push(cust);
    }

    // 3. Create Orders
    const orders = [
        {
            orderNumber: 'CMD-001',
            customerId: createdCustomers[0].id,
            deliveryAddress: 'Medina Rue 6',
            deliveryCity: 'Dakar',
            deliveryPhone: '770000001',
            paymentMethod: 'wave',
            paymentStatus: 'paid',
            status: 'completed',
            total: 5000,
            subtotal: 4000,
            deliveryFee: 1000
        },
        {
            orderNumber: 'CMD-002',
            customerId: createdCustomers[1].id,
            deliveryAddress: 'HLM Rufisque',
            deliveryCity: 'Rufisque',
            deliveryPhone: '770000002',
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            status: 'pending',
            total: 2500,
            subtotal: 1500,
            deliveryFee: 1000
        }
    ];

    for (const o of orders) {
        await prisma.order.upsert({
            where: { orderNumber: o.orderNumber },
            update: {},
            create: o
        });
    }

    // 4. Create Claims
    await prisma.claim.create({
        data: {
            customerId: createdCustomers[0].id,
            subject: 'Retard de livraison',
            description: 'Ma commande est arrivée avec 30min de retard.',
            status: 'pending'
        }
    });

    console.log('Demo data seeded!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

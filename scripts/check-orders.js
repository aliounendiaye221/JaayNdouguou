const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
    const count = await prisma.order.count();
    console.log(`\n📊 Total commandes: ${count}\n`);
    
    const orders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
    });
    
    if (orders.length === 0) {
        console.log('❌ Aucune commande trouvée dans la base de données\n');
    } else {
        console.log('✅ Commandes trouvées:\n');
        orders.forEach((order, i) => {
            console.log(`${i+1}. ${order.orderNumber} - ${order.customer.firstName} ${order.customer.lastName} - ${order.status} - ${order.total} FCFA`);
        });
    }
    
    await prisma.$disconnect();
}

checkOrders();

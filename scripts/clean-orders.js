const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanOrders() {
    try {
        console.log('🧹 Nettoyage des commandes de test...');
        
        // Supprimer tous les articles de commandes
        const deletedItems = await prisma.orderItem.deleteMany({});
        console.log(`✅ ${deletedItems.count} articles supprimés`);
        
        // Supprimer toutes les commandes
        const deletedOrders = await prisma.order.deleteMany({});
        console.log(`✅ ${deletedOrders.count} commandes supprimées`);
        
        // Supprimer tous les clients
        const deletedCustomers = await prisma.customer.deleteMany({});
        console.log(`✅ ${deletedCustomers.count} clients supprimés`);
        
        console.log('\n✨ Base de données nettoyée avec succès!');
        console.log('📝 Vous pouvez maintenant ajouter de vraies commandes depuis le site.');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanOrders();

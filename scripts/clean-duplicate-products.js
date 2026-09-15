require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDuplicates() {
    console.log('🧹 Début du nettoyage des produits dupliqués en base de données...');

    // 1. Mappage des IDs dupliqués vers les IDs officiels
    const duplicateMapping = [
        { duplicateId: '1', canonicalId: 'oignon-local' },
        { duplicateId: '2', canonicalId: 'pomme-de-terre' },
        { duplicateId: '6', canonicalId: 'poivron-vert' },
        { duplicateId: '7', canonicalId: 'aubergine' },
        { duplicateId: 'menthe_fraiche', canonicalId: 'menthe-fraiche' },
        { duplicateId: 'piment_fort', canonicalId: 'piment-fort' },
    ];

    // 2. Transférer les commandes existantes vers les produits canoniques
    for (const mapping of duplicateMapping) {
        const orderItemsCount = await prisma.orderItem.count({
            where: { productId: mapping.duplicateId },
        });

        if (orderItemsCount > 0) {
            console.log(`📦 Re-liaison de ${orderItemsCount} article(s) de commande de [${mapping.duplicateId}] vers [${mapping.canonicalId}]...`);
            await prisma.orderItem.updateMany({
                where: { productId: mapping.duplicateId },
                data: { productId: mapping.canonicalId },
            });
        }
    }

    // 3. Supprimer les 6 doublons
    const duplicateIds = duplicateMapping.map(m => m.duplicateId);
    const deleteResult = await prisma.product.deleteMany({
        where: { id: { in: duplicateIds } },
    });

    console.log(`✅ ${deleteResult.count} produit(s) dupliqué(s) supprimé(s) avec succès !`);

    // 4. Vérifier les produits restants
    const remainingProducts = await prisma.product.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, image: true, price: true },
    });

    console.log(`\n📋 Nombre total de produits restants : ${remainingProducts.length}`);
    remainingProducts.forEach(p => {
        console.log(`- ${p.name.padEnd(20)} [${p.id}] -> Image: ${p.image} (${p.price} FCFA)`);
    });

    await prisma.$disconnect();
}

cleanDuplicates().catch(err => {
    console.error('❌ Erreur lors du nettoyage :', err);
    process.exit(1);
});

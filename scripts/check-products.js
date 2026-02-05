const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
    try {
        const count = await prisma.product.count();
        console.log('📦 Total produits dans la base:', count);
        
        const products = await prisma.product.findMany({
            take: 5,
            select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
                category: true
            }
        });
        
        console.log('\n✅ Produits disponibles:');
        products.forEach(p => {
            console.log(`- ${p.name} (${p.category}) - ${p.price} FCFA - ${p.isAvailable ? '✓ Disponible' : '✗ Indisponible'}`);
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkProducts();

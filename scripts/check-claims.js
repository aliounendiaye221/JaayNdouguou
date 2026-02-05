const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Vérification des réclamations...\n');

    const claims = await prisma.claim.findMany({
        include: {
            customer: true,
            order: true
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total réclamations: ${claims.length}\n`);

    if (claims.length === 0) {
        console.log('❌ Aucune réclamation trouvée dans la base de données\n');
    } else {
        claims.forEach((claim, index) => {
            console.log(`${index + 1}. Réclamation #${claim.id.substring(0, 8)}`);
            console.log(`   Sujet: ${claim.subject}`);
            console.log(`   Status: ${claim.status}`);
            console.log(`   Client: ${claim.customer ? `${claim.customer.firstName} ${claim.customer.lastName}` : 'N/A'}`);
            console.log(`   Commande: ${claim.order ? claim.order.orderNumber : 'N/A'}`);
            console.log(`   Date: ${claim.createdAt.toLocaleDateString('fr-FR')}`);
            console.log('');
        });
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

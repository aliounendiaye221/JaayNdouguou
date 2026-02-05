const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Création de l\'administrateur...');

    const email = process.env.ADMIN_EMAIL || 'admin@jaayndougou.sn';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026';

    console.log(`Email: ${email}`);
    console.log(`Mot de passe: ${password}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            name: 'Administrateur Principal',
            role: 'super-admin',
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Administrateur Principal',
            role: 'super-admin',
        },
    });

    console.log('✅ Administrateur créé avec succès!');
    console.log({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    });
    console.log('\n📝 Identifiants de connexion:');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error('❌ Erreur:', e);
        await prisma.$disconnect();
        process.exit(1);
    });

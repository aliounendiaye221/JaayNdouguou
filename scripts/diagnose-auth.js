// Script de diagnostic et correction de l'authentification admin
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Utiliser DIRECT_URL pour éviter les problèmes de pooling
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log('🔌 Connexion à:', databaseUrl?.includes('pooler') ? 'Connection poolée' : 'Connection directe');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl
        }
    },
    log: ['error', 'warn']
});

async function diagnoseAndFix() {
    console.log('🔍 Diagnostic de l\'authentification admin...\n');

    try {
        // 1. Vérifier la connexion à la base de données
        console.log('1️⃣ Test de connexion à la base de données...');
        await prisma.$connect();
        console.log('✅ Connexion réussie\n');

        // 2. Vérifier les admins existants
        console.log('2️⃣ Vérification des admins existants...');
        const admins = await prisma.admin.findMany();
        console.log(`📊 Nombre d'admins trouvés: ${admins.length}`);
        
        if (admins.length > 0) {
            console.log('\n📋 Liste des admins:');
            admins.forEach((admin, index) => {
                console.log(`\n   Admin ${index + 1}:`);
                console.log(`   - ID: ${admin.id}`);
                console.log(`   - Email: ${admin.email}`);
                console.log(`   - Nom: ${admin.name}`);
                console.log(`   - Rôle: ${admin.role}`);
                console.log(`   - Créé le: ${admin.createdAt}`);
            });
        } else {
            console.log('⚠️  Aucun admin trouvé!\n');
        }

        // 3. Variables d'environnement
        console.log('\n3️⃣ Vérification des variables d\'environnement...');
        const requiredEnvVars = {
            'ADMIN_EMAIL': process.env.ADMIN_EMAIL,
            'ADMIN_DEFAULT_PASSWORD': process.env.ADMIN_DEFAULT_PASSWORD,
            'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
            'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
        };

        let envOk = true;
        for (const [key, value] of Object.entries(requiredEnvVars)) {
            if (value) {
                console.log(`✅ ${key}: ${key.includes('PASSWORD') || key.includes('SECRET') ? '[DÉFINI]' : value}`);
            } else {
                console.log(`❌ ${key}: [NON DÉFINI]`);
                envOk = false;
            }
        }

        if (!envOk) {
            console.log('\n⚠️  Certaines variables d\'environnement sont manquantes!\n');
        }

        // 4. Test du hash du mot de passe
        console.log('\n4️⃣ Test du hashing du mot de passe...');
        const testPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const isMatch = await bcrypt.compare(testPassword, hashedPassword);
        console.log(`✅ Test de hashing: ${isMatch ? 'OK' : 'ÉCHEC'}\n`);

        // 5. Vérifier si l'admin par défaut existe
        console.log('5️⃣ Vérification de l\'admin par défaut...');
        const defaultEmail = process.env.ADMIN_EMAIL || 'admin@jaayndougou.sn';
        const defaultAdmin = await prisma.admin.findUnique({
            where: { email: defaultEmail }
        });

        if (defaultAdmin) {
            console.log('✅ Admin par défaut trouvé\n');
            
            // 6. Test de validation du mot de passe
            console.log('6️⃣ Test de validation du mot de passe actuel...');
            const passwordMatch = await bcrypt.compare(testPassword, defaultAdmin.password);
            console.log(`${passwordMatch ? '✅' : '❌'} Mot de passe ${passwordMatch ? 'valide' : 'invalide'}\n`);

            if (!passwordMatch) {
                console.log('🔧 Correction du mot de passe...');
                const newHashedPassword = await bcrypt.hash(testPassword, 10);
                await prisma.admin.update({
                    where: { email: defaultEmail },
                    data: { password: newHashedPassword }
                });
                console.log('✅ Mot de passe mis à jour avec succès!\n');
            }
        } else {
            console.log('⚠️  Admin par défaut non trouvé\n');
            console.log('🔧 Création de l\'admin par défaut...');
            
            const hashedPassword = await bcrypt.hash(testPassword, 10);
            const newAdmin = await prisma.admin.create({
                data: {
                    email: defaultEmail,
                    name: 'Administrateur',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });

            console.log('✅ Admin créé avec succès!');
            console.log(`   - Email: ${newAdmin.email}`);
            console.log(`   - Mot de passe: ${testPassword}\n`);
        }

        // 7. Test final de connexion
        console.log('7️⃣ Test final de connexion...');
        const testAdmin = await prisma.admin.findUnique({
            where: { email: defaultEmail }
        });

        if (testAdmin) {
            const finalPasswordCheck = await bcrypt.compare(testPassword, testAdmin.password);
            if (finalPasswordCheck) {
                console.log('✅ Test de connexion réussi!\n');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('✨ INFORMATIONS DE CONNEXION ✨');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`📧 Email: ${defaultEmail}`);
                console.log(`🔑 Mot de passe: ${testPassword}`);
                console.log(`🌐 URL de connexion: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            } else {
                console.log('❌ Test de connexion échoué!\n');
            }
        }

        console.log('✅ Diagnostic terminé!');

    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error);
        console.error('\nDétails de l\'erreur:', error.message);
        
        if (error.code === 'P1001') {
            console.error('\n⚠️  Impossible de se connecter à la base de données.');
            console.error('Vérifiez que DATABASE_URL est correctement configuré.');
        } else if (error.code === 'P2002') {
            console.error('\n⚠️  Un admin avec cet email existe déjà.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

// Exécuter le diagnostic
diagnoseAndFix()
    .then(() => {
        console.log('\n🎉 Script terminé avec succès!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Erreur fatale:', err);
        process.exit(1);
    });

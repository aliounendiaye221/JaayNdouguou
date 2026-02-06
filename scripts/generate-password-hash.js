// Script Node.js pour générer et configurer le mot de passe admin
const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026';
    
    console.log('\n🔐 Génération du hash du mot de passe...\n');
    console.log(`Mot de passe: ${password}`);
    
    // Générer le hash avec 10 rounds (standard)
    const hash = await bcrypt.hash(password, 10);
    
    console.log(`\nHash bcrypt généré:\n${hash}\n`);
    
    // Vérifier que le hash fonctionne
    const isValid = await bcrypt.compare(password, hash);
    console.log(`✅ Validation du hash: ${isValid ? 'OK' : 'ÉCHEC'}\n`);
    
    // Générer la requête SQL
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SQL à exécuter dans la base de données:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`UPDATE "Admin"`);
    console.log(`SET password = '${hash}'`);
    console.log(`WHERE email = 'admin@jaayndougou.sn';\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

generatePasswordHash()
    .then(() => console.log('✅ Hash généré avec succès!'))
    .catch(err => console.error('❌ Erreur:', err));

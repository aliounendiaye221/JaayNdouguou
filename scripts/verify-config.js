#!/usr/bin/env node

/**
 * Script de vérification de la configuration avant déploiement
 * Vérifie que toutes les configurations critiques sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration...\n');

let errors = 0;
let warnings = 0;

// 1. Vérifier auth.ts
console.log('1️⃣  Vérification de auth.ts...');
const authPath = path.join(__dirname, '..', 'auth.ts');
if (fs.existsSync(authPath)) {
    const authContent = fs.readFileSync(authPath, 'utf8');
    
    if (authContent.includes('domain:') && authContent.includes('.jaayndougou.app')) {
        console.log('   ✅ Configuration des cookies avec domaine : OK');
    } else {
        console.log('   ❌ ERREUR : Configuration du domaine des cookies manquante');
        errors++;
    }
    
    if (authContent.includes('trustHost: true')) {
        console.log('   ✅ trustHost configuré : OK');
    } else {
        console.log('   ⚠️  WARNING : trustHost n\'est pas activé');
        warnings++;
    }
    
    if (authContent.includes('callbackUrl') && authContent.includes('csrfToken')) {
        console.log('   ✅ Tous les cookies configurés : OK');
    } else {
        console.log('   ❌ ERREUR : Configuration incomplète des cookies');
        errors++;
    }
} else {
    console.log('   ❌ ERREUR : Fichier auth.ts introuvable');
    errors++;
}

// 2. Vérifier prisma.ts
console.log('\n2️⃣  Vérification de prisma.ts...');
const prismaPath = path.join(__dirname, '..', 'app', 'utils', 'prisma.ts');
if (fs.existsSync(prismaPath)) {
    const prismaContent = fs.readFileSync(prismaPath, 'utf8');
    
    if (prismaContent.includes('retryOperation') || prismaContent.includes('$connect')) {
        console.log('   ✅ Gestion de connexion optimisée : OK');
    } else {
        console.log('   ⚠️  WARNING : Pas de gestion de retry visible');
        warnings++;
    }
    
    if (prismaContent.includes('$use')) {
        console.log('   ✅ Middleware de monitoring : OK');
    } else {
        console.log('   ⚠️  WARNING : Pas de middleware de monitoring');
        warnings++;
    }
} else {
    console.log('   ❌ ERREUR : Fichier prisma.ts introuvable');
    errors++;
}

// 3. Vérifier orders/route.ts
console.log('\n3️⃣  Vérification de orders/route.ts...');
const ordersPath = path.join(__dirname, '..', 'app', 'api', 'orders', 'route.ts');
if (fs.existsSync(ordersPath)) {
    const ordersContent = fs.readFileSync(ordersPath, 'utf8');
    
    if (ordersContent.includes('retryOperation')) {
        console.log('   ✅ Fonction de retry implémentée : OK');
    } else {
        console.log('   ❌ ERREUR : Pas de système de retry');
        errors++;
    }
    
    if (ordersContent.includes('console.log') && ordersContent.includes('✅')) {
        console.log('   ✅ Logs de succès ajoutés : OK');
    } else {
        console.log('   ⚠️  WARNING : Logs de succès manquants');
        warnings++;
    }
} else {
    console.log('   ❌ ERREUR : Fichier orders/route.ts introuvable');
    errors++;
}

// 4. Vérifier middleware.ts
console.log('\n4️⃣  Vérification de middleware.ts...');
const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    if (middlewareContent.includes('api/orders') || middlewareContent.includes('api/contact')) {
        console.log('   ✅ Routes API publiques exclues : OK');
    } else {
        console.log('   ⚠️  WARNING : Routes API peut-être bloquées');
        warnings++;
    }
} else {
    console.log('   ❌ ERREUR : Fichier middleware.ts introuvable');
    errors++;
}

// 5. Vérifier .env (optionnel, ne pas afficher les valeurs)
console.log('\n5️⃣  Vérification des variables d\'environnement...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('DATABASE_URL')) {
        console.log('   ✅ DATABASE_URL présente');
        if (envContent.includes('pgbouncer=true')) {
            console.log('   ✅ PgBouncer activé dans DATABASE_URL');
        } else {
            console.log('   ⚠️  WARNING : pgbouncer=true manquant dans DATABASE_URL');
            warnings++;
        }
    } else {
        console.log('   ⚠️  WARNING : DATABASE_URL manquante dans .env local');
        warnings++;
    }
    
    if (envContent.includes('NEXTAUTH_SECRET')) {
        console.log('   ✅ NEXTAUTH_SECRET présent');
    } else {
        console.log('   ⚠️  WARNING : NEXTAUTH_SECRET manquant');
        warnings++;
    }
} else {
    console.log('   ⚠️  WARNING : Fichier .env non trouvé (normal pour production)');
}

// Résumé
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
    console.log('✅ PARFAIT ! Tout est correctement configuré.');
    console.log('🚀 Vous pouvez déployer en toute confiance !\n');
    process.exit(0);
} else if (errors === 0) {
    console.log(`⚠️  ${warnings} avertissement(s) détecté(s)`);
    console.log('✅ Aucune erreur critique');
    console.log('📝 Vérifiez les warnings ci-dessus');
    console.log('🚀 Vous pouvez déployer (avec précaution)\n');
    process.exit(0);
} else {
    console.log(`❌ ${errors} erreur(s) critique(s) détectée(s)`);
    console.log(`⚠️  ${warnings} avertissement(s)`);
    console.log('🛑 CORRIGEZ LES ERREURS AVANT DE DÉPLOYER !\n');
    process.exit(1);
}

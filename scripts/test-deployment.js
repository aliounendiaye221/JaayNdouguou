#!/usr/bin/env node

/**
 * Script de test post-déploiement
 * Vérifie que le déploiement fonctionne correctement
 */

const https = require('https');

const DOMAIN = 'jaayndougou.app';
const TESTS = [
    { name: 'Page d\'accueil', path: '/', expectedStatus: 200 },
    { name: 'Page de connexion', path: '/login', expectedStatus: 200 },
    { name: 'API Health (orders GET)', path: '/api/orders?orderNumber=test', expectedStatus: [401, 404] }, // 401 si non authentifié, 404 si commande inexistante
];

console.log('🧪 TESTS POST-DÉPLOIEMENT - JaayNdougou\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function testEndpoint(test) {
    return new Promise((resolve) => {
        const options = {
            hostname: DOMAIN,
            port: 443,
            path: test.path,
            method: 'GET',
            headers: {
                'User-Agent': 'JaayNdougou-Test/1.0'
            }
        };

        const req = https.request(options, (res) => {
            const expectedStatuses = Array.isArray(test.expectedStatus) 
                ? test.expectedStatus 
                : [test.expectedStatus];
            
            const success = expectedStatuses.includes(res.statusCode);
            
            if (success) {
                console.log(`✅ ${test.name}: ${res.statusCode}`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: ${res.statusCode} (attendu: ${expectedStatuses.join(' ou ')})`);
                failed++;
            }
            
            resolve();
        });

        req.on('error', (error) => {
            console.log(`❌ ${test.name}: ERREUR - ${error.message}`);
            failed++;
            resolve();
        });

        req.setTimeout(10000, () => {
            console.log(`❌ ${test.name}: TIMEOUT`);
            failed++;
            req.destroy();
            resolve();
        });

        req.end();
    });
}

async function runTests() {
    for (const test of TESTS) {
        await testEndpoint(test);
    }

    console.log('='.repeat(60));
    console.log(`\n📊 Résultats: ${passed} réussi(s), ${failed} échoué(s)\n`);

    if (failed === 0) {
        console.log('✅ Tous les tests passent ! Le site est en ligne.\n');
        
        console.log('📱 Tests manuels à effectuer:');
        console.log(`   1. Connexion mobile: https://${DOMAIN}/login`);
        console.log(`   2. Passer une commande test`);
        console.log(`   3. Vérifier dans /admin/orders\n`);
        
        return 0;
    } else {
        console.log('❌ Certains tests ont échoué.');
        console.log('   Vérifiez le déploiement sur Vercel Dashboard\n');
        return 1;
    }
}

runTests().then(exitCode => process.exit(exitCode));

#!/usr/bin/env node

/**
 * Script de vérification de la configuration d'authentification
 * Vérifie que toutes les variables sont correctement configurées pour mobile
 */

console.log('🔍 Vérification de la configuration d\'authentification...\n');

const requiredEnvVars = {
  NEXTAUTH_URL: {
    expected: 'https://jaayndouguou.app',
    description: 'URL de production avec HTTPS (sans www)',
  },
  NEXTAUTH_SECRET: {
    minLength: 32,
    description: 'Secret NextAuth (minimum 32 caractères)',
  },
  DATABASE_URL: {
    pattern: /^postgresql:\/\//,
    description: 'URL de connexion PostgreSQL',
  },
};

let hasErrors = false;

// Vérification de NODE_ENV
console.log('📦 Environnement:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
if (process.env.NODE_ENV === 'production') {
  console.log('   ✅ Mode production activé\n');
} else {
  console.log('   ⚠️  Mode développement (normal en local)\n');
}

// Vérification des variables
console.log('🔐 Variables d\'environnement:');

for (const [key, config] of Object.entries(requiredEnvVars)) {
  const value = process.env[key];
  
  if (!value) {
    console.log(`   ❌ ${key}: NON DÉFINIE`);
    console.log(`      → ${config.description}`);
    hasErrors = true;
    continue;
  }

  // Vérification spécifique à NEXTAUTH_URL
  if (key === 'NEXTAUTH_URL') {
    if (value === config.expected) {
      console.log(`   ✅ ${key}: ${value}`);
    } else if (value.includes('localhost')) {
      console.log(`   ⚠️  ${key}: ${value}`);
      console.log(`      → Devrait être "${config.expected}" en production`);
      hasErrors = true;
    } else if (value.includes('www.')) {
      console.log(`   ❌ ${key}: ${value}`);
      console.log(`      → Ne devrait PAS contenir "www" → "${config.expected}"`);
      hasErrors = true;
    } else if (!value.startsWith('https://')) {
      console.log(`   ❌ ${key}: ${value}`);
      console.log(`      → Doit commencer par "https://" pour .app`);
      hasErrors = true;
    } else {
      console.log(`   ⚠️  ${key}: ${value}`);
      console.log(`      → Valeur inattendue, devrait être "${config.expected}"`);
    }
    continue;
  }

  // Vérification spécifique à NEXTAUTH_SECRET
  if (key === 'NEXTAUTH_SECRET') {
    if (value.length >= config.minLength) {
      console.log(`   ✅ ${key}: Défini (${value.length} caractères)`);
    } else {
      console.log(`   ❌ ${key}: Trop court (${value.length} caractères)`);
      console.log(`      → Minimum ${config.minLength} caractères requis`);
      hasErrors = true;
    }
    continue;
  }

  // Vérification par pattern
  if (config.pattern) {
    if (config.pattern.test(value)) {
      console.log(`   ✅ ${key}: Défini`);
    } else {
      console.log(`   ❌ ${key}: Format invalide`);
      console.log(`      → ${config.description}`);
      hasErrors = true;
    }
    continue;
  }

  console.log(`   ✅ ${key}: Défini`);
}

// Vérification de la configuration des cookies (lecture du fichier)
console.log('\n🍪 Configuration des cookies:');
const fs = require('fs');
const path = require('path');

try {
  const authFilePath = path.join(__dirname, '..', 'auth.ts');
  const authContent = fs.readFileSync(authFilePath, 'utf-8');
  
  const checks = [
    { pattern: /useSecureCookies/, name: 'useSecureCookies' },
    { pattern: /sameSite:\s*['"]lax['"]/, name: 'sameSite: lax' },
    { pattern: /secure:\s*.*production/, name: 'secure conditionnel' },
    { pattern: /domain:.*jaayndouguou\.app/, name: 'domain: .jaayndouguou.app' },
  ];

  for (const check of checks) {
    if (check.pattern.test(authContent)) {
      console.log(`   ✅ ${check.name} configuré`);
    } else {
      console.log(`   ❌ ${check.name} manquant`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.log(`   ⚠️  Impossible de lire auth.ts: ${error.message}`);
}

// Vérification de vercel.json
console.log('\n🌐 Configuration Vercel:');
try {
  const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
  const vercelContent = fs.readFileSync(vercelConfigPath, 'utf-8');
  const vercelConfig = JSON.parse(vercelContent);
  
  if (vercelConfig.redirects && vercelConfig.redirects.length > 0) {
    const wwwRedirect = vercelConfig.redirects.find(r => 
      r.has && r.has.some(h => h.value && h.value.includes('www.jaayndouguou.app'))
    );
    if (wwwRedirect) {
      console.log('   ✅ Redirection www → non-www configurée');
    } else {
      console.log('   ⚠️  Redirection www non trouvée');
    }
  } else {
    console.log('   ⚠️  Aucune redirection configurée');
  }
} catch (error) {
  console.log(`   ⚠️  Impossible de lire vercel.json: ${error.message}`);
}

// Résultat final
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ CONFIGURATION INCOMPLÈTE');
  console.log('\nActions requises:');
  console.log('1. Corrigez les erreurs ci-dessus');
  console.log('2. Sur Vercel, configurez les variables d\'environnement');
  console.log('3. Redéployez avec: vercel --prod\n');
  process.exit(1);
} else {
  console.log('✅ CONFIGURATION VALIDE');
  console.log('\nProchaines étapes:');
  console.log('1. Déployez sur Vercel: vercel --prod');
  console.log('2. Testez sur mobile après avoir vidé le cache');
  console.log('3. Vérifiez que les cookies sont bien définis\n');
  process.exit(0);
}

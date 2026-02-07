#!/usr/bin/env node

/**
 * Script to generate secure credentials for production deployment
 * Generates:
 * - NEXTAUTH_SECRET (32-byte random string, base64 encoded)
 * - Strong admin password (20 characters, mixed case, numbers, symbols)
 * - Instructions for Neon database password rotation
 */

const crypto = require('crypto');

console.log('\n🔐 Génération des Credentials Sécurisés pour JaayNdougou\n');
console.log('=' .repeat(70));

// Generate NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('\n✅ NEXTAUTH_SECRET (nouveau):');
console.log('─'.repeat(70));
console.log(nextAuthSecret);

// Generate strong admin password
function generateStrongPassword(length = 20) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

const adminPassword = generateStrongPassword(20);
console.log('\n✅ INITIAL_ADMIN_PASSWORD (nouveau):');
console.log('─'.repeat(70));
console.log(adminPassword);

// Generate a second admin password option
const adminPassword2 = generateStrongPassword(20);
console.log('\n✅ Alternative ADMIN_PASSWORD:');
console.log('─'.repeat(70));
console.log(adminPassword2);

// Instructions for Neon database
console.log('\n📊 Instructions pour la Base de Données Neon:');
console.log('─'.repeat(70));
console.log('1. Allez sur: https://console.neon.tech');
console.log('2. Sélectionnez votre projet');
console.log('3. Allez dans Settings → Reset password');
console.log('4. Copiez les nouvelles URLs de connexion:');
console.log('   - Pooled connection (avec ?pgbouncer=true) → DATABASE_URL');
console.log('   - Direct connection → DIRECT_URL');

// Generate a summary file (not committed)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const summaryContent = `# Nouvelles Credentials Générées - ${new Date().toLocaleString('fr-FR')}

## ⚠️ IMPORTANT
Ce fichier contient des credentials sensibles. Ne JAMAIS le commiter dans Git!

## NEXTAUTH_SECRET
\`\`\`
${nextAuthSecret}
\`\`\`

## INITIAL_ADMIN_PASSWORD
\`\`\`
${adminPassword}
\`\`\`

## Alternative Admin Password
\`\`\`
${adminPassword2}
\`\`\`

## Instructions Neon Database

1. **Accédez à Neon Console**: https://console.neon.tech
2. **Sélectionnez votre projet**: ep-square-hall-aiasntyk
3. **Reset Password**: Settings → Database → Reset password
4. **Copiez les nouvelles URLs**:
   - \`DATABASE_URL\`: Connection pooled (avec ?pgbouncer=true&connect_timeout=10)
   - \`DIRECT_URL\`: Direct connection (sans pgbouncer)

## Configuration Vercel

Ajoutez ces variables dans Vercel Dashboard → Settings → Environment Variables:

\`\`\`bash
# Base de données (NOUVELLES URLs après rotation Neon)
DATABASE_URL="postgresql://user:NEW_PASSWORD@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
DIRECT_URL="postgresql://user:NEW_PASSWORD@ep-square-hall-aiasntyk.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"

# NextAuth (NOUVEAU SECRET CI-DESSUS)
NEXTAUTH_URL="https://jaayndougou.app"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Configuration publique
NEXT_PUBLIC_WHATSAPP_NUMBER="+221786037913"
NEXT_PUBLIC_SITE_URL="https://jaayndougou.app"
NEXT_PUBLIC_SITE_NAME="JaayNdougou"

# Admin (NOUVEAU MOT DE PASSE CI-DESSUS)
ADMIN_EMAIL="admin@jaayndougou.sn"
INITIAL_ADMIN_PASSWORD="${adminPassword}"

# Email (Optionnel - Resend)
# RESEND_API_KEY="re_xxxxx"

# Paiements (Optionnel)
# WAVE_API_KEY="xxxxx"
# WAVE_MERCHANT_NUMBER="xxxxx"
# ORANGE_MONEY_API_KEY="xxxxx"
# ORANGE_MONEY_MERCHANT_NUMBER="xxxxx"
\`\`\`

## Prochaines Étapes

1. ✅ Credentials générées (ce fichier)
2. ⏳ Rotation du mot de passe Neon (manuel via console)
3. ⏳ Configuration des variables Vercel (manuel via dashboard)
4. ⏳ Test du déploiement
5. ⏳ Connexion admin et changement de mot de passe
`;

const fs = require('fs');
const path = require('path');

// Save to tmp directory
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

const outputFile = path.join(tmpDir, `credentials-${timestamp}.md`);
fs.writeFileSync(outputFile, summaryContent, 'utf8');

console.log('\n💾 Fichier de résumé créé:');
console.log('─'.repeat(70));
console.log(outputFile);
console.log('\n⚠️  Ce fichier contient des secrets! Gardez-le en sécurité.');

// Create .env.vercel.local template
const envVercelContent = `# Vercel Environment Variables - Generated ${new Date().toISOString()}
# ⚠️ DO NOT COMMIT THIS FILE - It's in .gitignore

# Database (Update with NEW Neon URLs after password rotation)
DATABASE_URL="postgresql://user:NEW_PASSWORD@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
DIRECT_URL="postgresql://user:NEW_PASSWORD@ep-square-hall-aiasntyk.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"

# NextAuth
NEXTAUTH_URL="https://jaayndougou.app"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Public Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER="+221786037913"
NEXT_PUBLIC_SITE_URL="https://jaayndougou.app"
NEXT_PUBLIC_SITE_NAME="JaayNdougou"

# Admin
ADMIN_EMAIL="admin@jaayndougou.sn"
INITIAL_ADMIN_PASSWORD="${adminPassword}"

# Optional - Email
# RESEND_API_KEY="re_xxxxx"

# Optional - Payments
# WAVE_API_KEY="xxxxx"
# WAVE_MERCHANT_NUMBER="xxxxx"
# ORANGE_MONEY_API_KEY="xxxxx"
# ORANGE_MONEY_MERCHANT_NUMBER="xxxxx"
`;

const envVercelFile = path.join(__dirname, '../.env.vercel.local');
fs.writeFileSync(envVercelFile, envVercelContent, 'utf8');

console.log('\n💾 Fichier .env.vercel.local créé:');
console.log('─'.repeat(70));
console.log(envVercelFile);
console.log('   → Utilisez ce fichier pour copier les variables dans Vercel Dashboard');

console.log('\n📝 Prochaines Étapes:');
console.log('─'.repeat(70));
console.log('1. Rotation Neon Password:');
console.log('   → https://console.neon.tech');
console.log('2. Copier les nouvelles DATABASE_URL et DIRECT_URL dans .env.vercel.local');
console.log('3. Configurer Vercel:');
console.log('   → Vercel Dashboard → Settings → Environment Variables');
console.log('   → Copier chaque variable depuis .env.vercel.local');
console.log('4. Redéployer:');
console.log('   → vercel --prod');

console.log('\n' + '='.repeat(70));
console.log('✅ Génération terminée avec succès!\n');

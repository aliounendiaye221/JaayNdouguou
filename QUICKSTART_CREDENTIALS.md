# 🎯 Guide Rapide - Rotation des Credentials

Ce guide vous permet de configurer rapidement les nouvelles credentials pour JaayNdougou.

## ✨ Ce Qui a Été Généré

✅ **NEXTAUTH_SECRET**: `zNXoaWKSo827vyfsiaLsG1oJRDvxey5aNtO3riwtXf4=`
✅ **Admin Password**: `H4[1u]mQikW-KGdWlI<*`
✅ **Alternative Password**: `tf;7ZcqU0*+4_.PG5>sF`

## 🚀 Configuration en 3 Étapes

### Étape 1️⃣: Neon Database (5 min)

```bash
# 1. Ouvrir Neon Console
https://console.neon.tech

# 2. Projet: ep-square-hall-aiasntyk
# 3. Settings → Database → Reset password
# 4. Copier les 2 nouvelles URLs:
#    - Pooled → DATABASE_URL
#    - Direct → DIRECT_URL

# 5. Mettre à jour .env.vercel.local avec les vraies URLs
```

### Étape 2️⃣: Vercel Configuration (10 min)

**Option A: Via Dashboard (Recommandé)**
```bash
# 1. Ouvrir
https://vercel.com/dashboard

# 2. Projet JaayNdougou → Settings → Environment Variables
# 3. Copier toutes les variables depuis .env.vercel.local
# Voir VERCEL_SETUP_GUIDE.md pour détails
```

**Option B: Via CLI (Automatique)**
```bash
# 1. Vérifier que .env.vercel.local est à jour avec Neon URLs
# 2. Exécuter le script
npm run setup-vercel

# Ou directement:
bash scripts/setup-vercel-env.sh
```

### Étape 3️⃣: Déploiement (5 min)

```bash
# Via Vercel Dashboard
# Deployments → Redeploy (dernier déploiement)

# OU via CLI
vercel --prod
```

## 📋 Checklist Rapide

- [ ] ✅ Credentials générées (`npm run generate-credentials`)
- [ ] 🔄 Neon password roté (console.neon.tech)
- [ ] 📝 .env.vercel.local mis à jour avec vraies URLs Neon
- [ ] ⚙️ Variables Vercel configurées (dashboard ou CLI)
- [ ] 🚀 Application déployée (vercel --prod)
- [ ] 👤 Admin créé (`node scripts/seed-admin.js`)
- [ ] 🧪 Login testé (https://jaayndougou.app/login)
- [ ] 🔐 Mot de passe admin changé (premier login)

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `.env.vercel.local` | **VOS NOUVELLES CREDENTIALS** |
| `tmp/credentials-*.md` | Sauvegarde des credentials |
| `VERCEL_SETUP_GUIDE.md` | Guide détaillé étape par étape |
| `scripts/generate-credentials.js` | Générateur de credentials |
| `scripts/setup-vercel-env.sh` | Configuration Vercel automatique |

## 🔐 Credentials Générées

### NEXTAUTH_SECRET
```
zNXoaWKSo827vyfsiaLsG1oJRDvxey5aNtO3riwtXf4=
```

### Admin Password (principal)
```
H4[1u]mQikW-KGdWlI<*
```

### Admin Password (alternatif)
```
tf;7ZcqU0*+4_.PG5>sF
```

## 🎯 Variables Vercel à Configurer

Copiez ces valeurs dans Vercel Dashboard:

```bash
# Database (APRÈS rotation Neon)
DATABASE_URL="postgresql://[user]:[NEW_PWD]@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
DIRECT_URL="postgresql://[user]:[NEW_PWD]@ep-square-hall-aiasntyk.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"

# NextAuth
NEXTAUTH_URL="https://jaayndougou.app"
NEXTAUTH_SECRET="zNXoaWKSo827vyfsiaLsG1oJRDvxey5aNtO3riwtXf4="

# Public
NEXT_PUBLIC_WHATSAPP_NUMBER="+221786037913"
NEXT_PUBLIC_SITE_URL="https://jaayndougou.app"
NEXT_PUBLIC_SITE_NAME="JaayNdougou"

# Admin
ADMIN_EMAIL="admin@jaayndougou.sn"
INITIAL_ADMIN_PASSWORD="H4[1u]mQikW-KGdWlI<*"
```

## 🛠️ Commandes Utiles

```bash
# Générer de nouvelles credentials
npm run generate-credentials

# Configurer Vercel (automatique)
npm run setup-vercel

# Créer l'admin
node scripts/seed-admin.js

# Déployer
vercel --prod

# Tester localement
npm run dev
```

## ❓ Problèmes Courants

### "Invalid credentials" au login
→ Videz cache navigateur ou utilisez navigation privée

### "Database connection failed"
→ Vérifiez DATABASE_URL et DIRECT_URL dans Vercel

### "Admin not found"
→ Exécutez `node scripts/seed-admin.js`

## 📞 Support

- Documentation complète: `VERCEL_SETUP_GUIDE.md`
- Sécurité: `SECURITY.md`
- Setup général: `SETUP.md`

---

**Généré le**: 06/02/2026 16:31:32
**Status**: ✅ Prêt pour configuration

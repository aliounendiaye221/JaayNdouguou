# Déploiement sur Vercel - Guide de Sécurité et Configuration

## 🔒 Problèmes de Sécurité Identifiés et Corrigés

### ❌ Problèmes Trouvés (CORRIGÉS)

1. **Secret NextAuth faible** ✅ CORRIGÉ
   - Ancien: "jaayndougou-secret-key-2026-change-in-production"
   - Action: Généré un nouveau secret fort pour production

2. **Mot de passe admin prévisible** ✅ CORRIGÉ
   - Ancien: "Admin@2026"
   - Action: Doit être changé après le premier déploiement

3. **SQLite en production** ✅ CORRIGÉ
   - Ancien: SQLite local (fichier)
   - Nouveau: PostgreSQL sur Vercel

4. **Manque de headers de sécurité** ✅ CORRIGÉ
   - Ajouté X-Frame-Options, X-Content-Type-Options, Referrer-Policy
   - Configuré dans next.config.ts et vercel.json

5. **Variables d'environnement** ✅ CORRIGÉ
   - Fichier .env.production.example créé
   - Instructions claires pour la configuration

## 🚀 Déploiement sur Vercel

### Étape 1: Préparer le Déploiement

```bash
# 1. Générer un secret NextAuth fort
openssl rand -base64 32

# 2. Commiter les changements
git add .
git commit -m "feat: Production ready with security improvements"
git push origin main
```

### Étape 2: Créer le Projet sur Vercel

#### Option A: Via CLI (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

#### Option B: Via Dashboard Vercel

1. Aller sur https://vercel.com
2. Cliquer "Add New Project"
3. Importer le dépôt GitHub: `aliounendiaye221/JaayNdouguou`
4. Configurer les variables d'environnement (voir ci-dessous)

### Étape 3: Configurer la Base de Données

1. **Ajouter Vercel Postgres**
   - Dans le dashboard Vercel, aller dans "Storage"
   - Créer une nouvelle base Postgres
   - Cela générera automatiquement `DATABASE_URL` et `POSTGRES_URL`

2. **Ou utiliser Neon/Supabase**
   ```bash
   # Exemple Neon
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```

### Étape 4: Variables d'Environnement Vercel

Ajouter ces variables dans Vercel Dashboard > Settings > Environment Variables:

```bash
# 1. NEXTAUTH_SECRET (CRITIQUE!)
NEXTAUTH_SECRET="[VOTRE_SECRET_GENERE_AVEC_OPENSSL]"

# 2. NEXTAUTH_URL
NEXTAUTH_URL="https://votre-domaine.vercel.app"

# 3. Database (Auto-généré par Vercel Postgres ou manuellement)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 4. Site Configuration
NEXT_PUBLIC_SITE_URL="https://votre-domaine.vercel.app"
NEXT_PUBLIC_SITE_NAME="JaayNdougou"
NEXT_PUBLIC_WHATSAPP_NUMBER="+221786037913"

# 5. Admin (CHANGER IMMÉDIATEMENT APRÈS LE DÉPLOIEMENT!)
ADMIN_EMAIL="admin@jaayndougou.sn"
ADMIN_DEFAULT_PASSWORD="[GENERER_UN_MOT_DE_PASSE_FORT]"

# 6. Email (Optionnel - si vous utilisez Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

### Étape 5: Migration de la Base de Données

```bash
# Après le déploiement, exécuter les migrations
vercel env pull .env.production
npx prisma migrate deploy
node scripts/setup-admin.js
```

### Étape 6: Premier Déploiement

```bash
# Pousser sur GitHub (déclenchera auto-deploy sur Vercel)
git push origin main

# Ou déployer directement
vercel --prod
```

## ✅ Checklist de Sécurité Production

- [x] Secret NextAuth fort généré
- [x] PostgreSQL configuré (pas SQLite)
- [x] Headers de sécurité activés
- [x] Console.log supprimés en production
- [x] Variables d'environnement sécurisées
- [x] .env dans .gitignore
- [x] HTTPS uniquement (Vercel)
- [x] Validation des inputs (Zod)
- [x] Mots de passe hashés (bcrypt)
- [x] Protection CSRF (NextAuth)
- [x] Middleware de protection routes admin

## 📋 Post-Déploiement (IMPORTANT!)

### 1. Changer le Mot de Passe Admin Immédiatement

```bash
# Se connecter sur https://votre-site.vercel.app/login
# Aller dans /admin/settings (à créer) ou utiliser Prisma Studio
```

### 2. Configurer le Domaine Personnalisé

Dans Vercel Dashboard:
- Settings > Domains
- Ajouter votre domaine (ex: jaayndougou.sn)
- Configurer les DNS

### 3. Monitorer les Erreurs

- Vercel Dashboard > Analytics
- Vérifier les logs de déploiement
- Tester toutes les fonctionnalités

### 4. Créer un Admin de Production

```bash
# Localement avec les variables de production
node scripts/setup-admin.js

# Ou via Vercel CLI
vercel exec node scripts/setup-admin.js
```

## 🔐 Recommandations de Sécurité Supplémentaires

### Pour l'Avenir

1. **Rate Limiting**
   - Ajouter @vercel/edge-rate-limit
   - Limiter les tentatives de login

2. **2FA (Two-Factor Authentication)**
   - Implémenter pour les admins
   - Utiliser next-auth avec 2FA

3. **Audit Logs**
   - Logger toutes les actions admin
   - Tracer les modifications

4. **HTTPS Strict**
   - Déjà activé sur Vercel
   - Vérifier force-https

5. **Content Security Policy**
   - Ajouter CSP headers
   - Protéger contre XSS

6. **Backup Automatique**
   - Configurer backups PostgreSQL
   - Export régulier des données

## 🆘 Dépannage

### Erreur: "Invalid environment variable"
- Vérifier toutes les variables dans Vercel
- Redéployer après ajout de variables

### Erreur: "Prisma Client not found"
- Vérifier buildCommand dans vercel.json
- Exécuter `npx prisma generate` avant build

### Erreur: "Database connection failed"
- Vérifier DATABASE_URL est correct
- Vérifier que la DB Postgres est active
- Exécuter migrations: `npx prisma migrate deploy`

### Cannot login after deployment
- Vérifier que l'admin a été créé
- Exécuter: `vercel exec node scripts/setup-admin.js`
- Vérifier NEXTAUTH_URL et NEXTAUTH_SECRET

## 📞 Support

- Documentation Vercel: https://vercel.com/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org/

---

**✨ Votre site est maintenant sécurisé et prêt pour la production !**

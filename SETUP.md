# JaayNdougou - Configuration et Déploiement

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Prérequis](#prérequis)
- [Installation Locale](#installation-locale)
- [Configuration](#configuration)
- [Déploiement sur Vercel](#déploiement-sur-vercel)
- [Configuration de la Base de Données](#configuration-de-la-base-de-données)
- [Sécurité](#sécurité)
- [Dépannage](#dépannage)

## 🎯 Aperçu

JaayNdougou est une plateforme e-commerce pour la vente de légumes frais au Sénégal. L'application offre :

- 🛒 Catalogue de produits avec panier d'achat
- 💳 Paiements Wave, Orange Money et paiement à la livraison
- 👤 Interface d'administration pour la gestion des commandes
- 📧 Notifications par email via Resend
- 📱 Intégration WhatsApp pour le support client
- 🔐 Authentification sécurisée avec NextAuth

## 🔧 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Vercel (pour le déploiement)
- Base de données PostgreSQL (Neon recommandé)

## 💻 Installation Locale

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/aliounendiaye221/JaayNdouguou.git
   cd JaayNdouguou
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos valeurs
   ```

4. **Générer le client Prisma**
   ```bash
   npx prisma generate
   ```

5. **Créer l'admin initial** (optionnel en développement)
   ```bash
   node scripts/seed-admin.js
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

   Accédez à http://localhost:3000

## ⚙️ Configuration

### Variables d'Environnement Requises

#### 🔴 CRITIQUES (Production)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL (pooling) | `postgresql://user:pass@host:5432/db?pgbouncer=true` |
| `DIRECT_URL` | URL de connexion directe (migrations) | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | URL de votre application | `https://jaayndougou.app` |
| `NEXTAUTH_SECRET` | Secret pour NextAuth (32+ chars) | Généré avec `openssl rand -base64 32` |
| `INITIAL_ADMIN_PASSWORD` | Mot de passe admin initial | Min 16 caractères, complexe |

#### 🟢 PUBLIQUES (Visibles côté client)

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp Business | `+221786037913` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | `https://jaayndougou.app` |
| `NEXT_PUBLIC_SITE_NAME` | Nom du site | `JaayNdougou` |

#### 🟡 OPTIONNELLES

| Variable | Description | Requis pour |
|----------|-------------|-------------|
| `RESEND_API_KEY` | Clé API Resend | Envoi d'emails |
| `WAVE_API_KEY` | Clé API Wave | Paiements Wave |
| `WAVE_MERCHANT_NUMBER` | Numéro marchand Wave | Paiements Wave |
| `ORANGE_MONEY_API_KEY` | Clé API Orange Money | Paiements Orange |
| `ORANGE_MONEY_MERCHANT_NUMBER` | Numéro marchand Orange | Paiements Orange |

### Générer un Secret Sécurisé

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 🚀 Déploiement sur Vercel

### 1. Préparer le Déploiement

**IMPORTANT**: Ne jamais commiter les fichiers `.env.production` ou `.env.local` !

```bash
# Vérifier que les fichiers sensibles sont ignorés
cat .gitignore | grep -E "\.env"
```

### 2. Créer un Projet Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre dépôt GitHub
4. Configurez le projet :
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npx prisma generate && next build`
   - **Install Command**: `npm install`

### 3. Configurer les Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```bash
# Base de données (de Neon ou Vercel Postgres)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=<générer avec openssl rand -base64 32>

# Configuration publique
NEXT_PUBLIC_WHATSAPP_NUMBER=+221786037913
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
NEXT_PUBLIC_SITE_NAME=JaayNdougou

# Admin
ADMIN_EMAIL=admin@jaayndougou.sn
INITIAL_ADMIN_PASSWORD=<mot de passe fort>

# Email (optionnel)
RESEND_API_KEY=re_xxxxx

# Paiements (optionnel)
WAVE_API_KEY=xxxxx
WAVE_MERCHANT_NUMBER=xxxxx
ORANGE_MONEY_API_KEY=xxxxx
ORANGE_MONEY_MERCHANT_NUMBER=xxxxx
```

**Conseil**: Appliquez les variables à tous les environnements (Production, Preview, Development)

### 4. Déployer

```bash
# Depuis la CLI Vercel
vercel --prod

# Ou pushez sur la branche main pour déclencher un déploiement automatique
git push origin main
```

### 5. Créer l'Admin Initial

Une fois déployé :

```bash
# Depuis la CLI Vercel
vercel env pull .env.production
node scripts/seed-admin.js
```

Ou connectez-vous à Vercel Dashboard → Database → Query et exécutez :
```sql
-- Voir scripts/reset-admin-password.sql
```

## 🗄️ Configuration de la Base de Données

### Option 1: Neon (Recommandé)

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet PostgreSQL
3. Copiez les URLs de connexion :
   - **Pooled connection**: pour `DATABASE_URL`
   - **Direct connection**: pour `DIRECT_URL`
4. Ajoutez-les aux variables d'environnement Vercel

### Option 2: Vercel Postgres

1. Dans Vercel Dashboard → Storage → Create Database
2. Sélectionnez "Postgres"
3. Les variables sont automatiquement ajoutées au projet

### Migrations Prisma

```bash
# Créer une migration
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Générer le client
npx prisma generate
```

## 🔒 Sécurité

### ⚠️ CRITIQUES

1. **Ne JAMAIS commiter** :
   - `.env`
   - `.env.production`
   - `.env.local`
   - Fichiers contenant des secrets

2. **Générer des secrets uniques** :
   - Différents pour dev/staging/prod
   - Au moins 32 caractères
   - Générés cryptographiquement

3. **Mots de passe admin** :
   - Min 16 caractères
   - Majuscules + minuscules + chiffres + symboles
   - Changer immédiatement après le premier déploiement

4. **Base de données** :
   - Toujours utiliser SSL/TLS (`sslmode=require`)
   - Rotation régulière des credentials
   - Sauvegardes automatiques activées

### 🛡️ Recommandations

- Activez l'authentification à deux facteurs (2FA) sur Vercel
- Utilisez les variables d'environnement Vercel (pas de fichiers .env)
- Surveillez les logs pour détecter les accès non autorisés
- Mettez à jour régulièrement les dépendances :
  ```bash
  npm audit
  npm audit fix
  ```

## 🐛 Dépannage

### Erreur: "Property 'claim' does not exist"

```bash
# Régénérer le client Prisma
rm -rf node_modules/.prisma
npx prisma generate
```

### Erreur de connexion à la base de données

```bash
# Vérifier les variables d'environnement
echo $DATABASE_URL

# Tester la connexion
npx prisma db pull
```

### Erreurs d'authentification

1. Vérifiez que `NEXTAUTH_URL` correspond à votre domaine
2. Vérifiez que `NEXTAUTH_SECRET` est défini
3. Videz les cookies du navigateur
4. Vérifiez les logs Vercel pour plus de détails

### Build échoue avec erreur Google Fonts

Si le build échoue avec :
```
Failed to fetch `Inter` from Google Fonts
```

C'est généralement un problème réseau temporaire. Les solutions :
1. Réessayer le build
2. Les fonts seront chargées à l'exécution si le build échoue

### Paiements ne fonctionnent pas

1. Vérifiez que les variables `WAVE_API_KEY` et/ou `ORANGE_MONEY_API_KEY` sont définies
2. En leur absence, seul le paiement à la livraison (COD) fonctionne
3. Consultez la documentation des providers de paiement pour l'intégration

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth](https://next-auth.js.org)
- [Documentation Vercel](https://vercel.com/docs)
- [Neon PostgreSQL](https://neon.tech/docs)

## 📞 Support

Pour toute question ou problème :
- Email: contact@jaayndougou.sn
- WhatsApp: +221786037913

---

**Développé avec ❤️ pour JaayNdougou**

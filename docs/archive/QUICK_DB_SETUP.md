# 🚀 Configuration Rapide Neon PostgreSQL

## Méthode Simple (Sans CLI)

### Étape 1: Créer un compte Neon (2 minutes)

1. Allez sur **https://console.neon.tech/signup**
2. Cliquez sur "Sign up with GitHub" (ou email)
3. Autorisez l'accès

### Étape 2: Créer votre base de données (1 minute)

1. Une fois connecté, cliquez sur **"Create a project"**
2. Configurez:
   - **Project name:** `jaayndougou`
   - **Database name:** `jaayndougou_db`
   - **Region:** `Europe (Frankfurt)` ou le plus proche
   - **PostgreSQL version:** 16 (recommandé)
3. Cliquez **"Create project"**

### Étape 3: Copier les credentials (30 secondes)

1. Sur la page du projet, vous verrez une **"Connection string"**
2. Cliquez sur l'icône copier 📋
3. Vous aurez quelque chose comme:
   ```
   postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/jaayndougou_db?sslmode=require
   ```

### Étape 4: Mettre à jour votre .env (30 secondes)

Ouvrez `.env` et remplacez:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/jaayndougou_db?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/jaayndougou_db?sslmode=require"
```

**⚠️ Remplacez par VOTRE URL de connexion Neon !**

### Étape 5: Initialiser la base (2 minutes)

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les tables
npx prisma migrate dev --name init

# 3. Peupler avec des données
node scripts/seed-real-data.js

# 4. Vérifier (optionnel)
npx prisma studio
```

### ✅ C'est tout !

Votre base de données PostgreSQL est prête avec:
- ✅ Tables créées
- ✅ 8 Produits
- ✅ 5 Clients
- ✅ 3 Commandes
- ✅ 1 Admin (admin@jaayndougou.sn / Admin@2026)

### 🌐 Pour Vercel (Production)

Dans Vercel Dashboard:
1. Projet → Settings → Environment Variables
2. Ajoutez la même `DATABASE_URL` et `DIRECT_URL`
3. Redéployez

---

## Alternative: Utiliser Vercel Postgres (Encore Plus Simple!)

Si vous préférez tout avoir sur Vercel:

1. **Vercel Dashboard** → Votre projet → **Storage** tab
2. Cliquez **"Create Database"**
3. Sélectionnez **"Postgres"**
4. Nom: `jaayndougou-db`
5. Cliquez **"Create"**

Les variables `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc. seront **automatiquement ajoutées** !

Ensuite juste:
```bash
# Récupérer les vars
vercel env pull .env.local

# Migrer
npx prisma migrate dev

# Seed
node scripts/seed-real-data.js
```

---

## 🆘 Problème avec npm?

Si npm ne fonctionne pas:

```bash
# Option 1: Réinstaller npm
npm install -g npm@latest

# Option 2: Utiliser npx directement
npx prisma generate
npx prisma migrate dev

# Option 3: Fixer le lock
Remove-Item package-lock.json
npm install
```

Quelle méthode voulez-vous utiliser? 🎯

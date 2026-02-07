# 🗄️ Configuration Base de Données PostgreSQL

## Option 1: Neon (Recommandé - Gratuit)

### Avantages
- ✅ 100% Gratuit (tier free)
- ✅ 0.5 GB de stockage
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Compatible Vercel

### Étapes

1. **Créer un compte**
   - Aller sur https://neon.tech
   - S'inscrire avec GitHub

2. **Créer une base de données**
   - Cliquer "Create a project"
   - Nom: `jaayndougou-db`
   - Region: `Europe (Frankfurt)` ou proche du Sénégal
   - PostgreSQL version: 16

3. **Copier les credentials**
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/jaayndougou?sslmode=require
   DIRECT_URL=postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/jaayndougou?sslmode=require
   ```

4. **Mettre à jour .env**
   ```bash
   # Remplacer dans .env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

5. **Exécuter les migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   node scripts/seed-real-data.js
   ```

## Option 2: Supabase (Alternative Gratuite)

### Avantages
- ✅ Gratuit jusqu'à 500 MB
- ✅ Interface UI complète
- ✅ Auth intégrée
- ✅ Real-time features

### Étapes

1. **Créer un compte**
   - Aller sur https://supabase.com
   - S'inscrire gratuitement

2. **Nouveau projet**
   - New Project
   - Nom: `jaayndougou`
   - Password: (générer fort)
   - Region: `Europe (Frankfurt)`

3. **Obtenir l'URL**
   - Settings → Database
   - Connection string → URI
   - Copier la connection pooling URL

4. **Configuration**
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
   ```

## Option 3: Vercel Postgres (Intégration Native)

### Avantages
- ✅ Intégration one-click avec Vercel
- ✅ Variables auto-configurées
- ✅ Gratuit jusqu'à 256 MB

### Étapes

1. **Dans Vercel Dashboard**
   - Projet → Storage → Create Database
   - Select: Postgres
   - Nom: `jaayndougou-db`
   - Create

2. **Variables automatiques**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` 
   - `POSTGRES_URL_NON_POOLING`

3. **Mise à jour .env**
   ```env
   DATABASE_URL="${POSTGRES_PRISMA_URL}"
   DIRECT_URL="${POSTGRES_URL_NON_POOLING}"
   ```

## Configuration Locale

### 1. Mettre à jour .env local

```env
# Development (Neon/Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# OU garder SQLite en local
# DATABASE_URL="file:./dev.db"
```

### 2. Migrer la base de données

```bash
# Créer et appliquer les migrations
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate

# Peupler avec des données réelles
node scripts/seed-real-data.js
```

### 3. Vérifier

```bash
# Ouvrir Prisma Studio
npx prisma studio

# Naviguer sur http://localhost:5555
# Vous verrez toutes vos données
```

## Configuration Production (Vercel)

### 1. Variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables:

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=kiU3OeEIQgsj+SmmDqehUgXlWW6c0PNtQSEQwgnulws=
NEXTAUTH_URL=https://votre-site.vercel.app
```

### 2. Déployer les migrations

```bash
# Après le déploiement
vercel env pull .env.production
npx prisma migrate deploy
node scripts/seed-real-data.js
```

## Commandes Utiles

```bash
# Voir l'état de la DB
npx prisma db pull

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer en production
npx prisma migrate deploy

# Reset complet (⚠️ DANGER - efface tout)
npx prisma migrate reset

# Studio (UI)
npx prisma studio

# Seed data
node scripts/seed-real-data.js
```

## Données de Test Créées

Le script `seed-real-data.js` créera:

✅ **1 Admin**
- Email: admin@jaayndougou.sn
- Password: Admin@2026 (ou depuis .env)

✅ **8 Produits**
- Ail, Banane, Gingembre, Mangue
- Menthe, Orange, Piment, Pomme

✅ **5 Clients**
- Aminata Diop (Dakar)
- Moussa Sy (Pikine)
- Fatou Sarr (Thiès)
- Ibrahima Fall (Rufisque)
- Khady Ndiaye (Guédiawaye)

✅ **3 Commandes**
- CMD-2026-001 (Livrée)
- CMD-2026-002 (En livraison)
- CMD-2026-003 (En préparation)

✅ **2 Réclamations**
- Produit endommagé (Résolue)
- Retard de livraison (En attente)

## Troubleshooting

### Erreur: "Can't reach database server"
```bash
# Vérifier l'URL de connexion
echo $DATABASE_URL

# Tester la connexion
npx prisma db pull
```

### Erreur: "Migration failed"
```bash
# Reset et recommencer
npx prisma migrate reset
npx prisma migrate dev
```

### Erreur: "SSL required"
```bash
# Ajouter ?sslmode=require à l'URL
DATABASE_URL="postgresql://...?sslmode=require"
```

## 🚀 Prêt !

Une fois configuré, votre admin dashboard affichera des vraies données !

Accédez à: http://localhost:3000/admin/dashboard

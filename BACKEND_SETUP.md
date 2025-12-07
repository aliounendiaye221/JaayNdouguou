# Guide de Configuration Backend - JaayNdougou

## Configuration Rapide (5 minutes)

### 1. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Email (Optionnel pour le développement)
RESEND_API_KEY="your_key_here"

# Paiements (Mode simulation par défaut)
WAVE_MERCHANT_NUMBER="+221786037913"
ORANGE_MONEY_MERCHANT_NUMBER="+221786037913"

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+221786037913"
```

### 2. Initialiser la Base de Données

```bash
npx prisma generate
npx prisma db push
```

### 3. Lancer l'Application

```bash
npm run dev
```

## Configuration Production

### Email (Resend)

1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre API key
3. Ajoutez `RESEND_API_KEY` à votre `.env.local`

**Gratuit jusqu'à 100 emails/jour**

### Paiements Wave

1. Contactez Wave pour devenir marchand: [wave.com/merchant](https://www.wave.com)
2. Obtenez vos credentials API
3. Ajoutez dans `.env.local`:
   ```
   WAVE_API_KEY="votre_clé"
   WAVE_API_SECRET="votre_secret"
   ```

### Paiements Orange Money

1. Inscrivez-vous sur [developer.orange.com](https://developer.orange.com)
2. Créez une application
3. Ajoutez dans `.env.local`:
   ```
   ORANGE_MONEY_API_KEY="votre_clé"
   ORANGE_MONEY_API_SECRET="votre_secret"
   ORANGE_MONEY_MERCHANT_ID="votre_id"
   ```

## Mode Simulation

Par défaut, les paiements fonctionnent en mode SIMULATION:
- ✅ Aucune configuration requise
- ✅ Aucun frais
- ✅ Parfait pour tester

Les paiements sont automatiquement marqués comme "payés" en développement.

## Déploiement

### Sur Vercel (Recommandé)

1. Connectez votre repository GitHub
2. Ajoutez les variables d'environnement
3. Déployez!

```bash
# Si vous utilisez SQLite, ajoutez:
DATABASE_URL="file:./prod.db"
```

### Sur Render/Railway

1. Utilisez PostgreSQL au lieu de SQLite
2. Mettez à jour `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Exécutez `npx prisma migrate dev`

## Troubleshooting

### Erreur de base de données
```bash
rm -rf prisma/dev.db
npx prisma db push
```

### Erreur Prisma Client
```bash
npx prisma generate
```

### Port déjà utilisé
```bash
# Modifiez le port dans package.json
"dev": "next dev -p 3001"
```

## Support

Pour toute question:
- WhatsApp: +221 78 603 79 13
- Email: contact@jaayndougou.sn

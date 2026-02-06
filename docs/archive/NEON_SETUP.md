# Guide: Configuration de la base de données Neon pour la production

## 🎯 Problème actuel
Votre base de données Neon n'est plus accessible. Il faut en créer une nouvelle.

## 📝 Étapes à suivre

### 1. Créer une nouvelle base de données Neon
1. Allez sur https://neon.tech
2. Connectez-vous ou créez un compte
3. Créez un nouveau projet "JaayNdougou Production"
4. Notez la connexion string qui ressemble à :
   ```
   postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Configurer les variables Vercel
Exécutez ces commandes :
```powershell
# Remplacez YOUR_NEON_URL par votre vraie URL Neon
echo 'YOUR_NEON_URL' | vercel env add DATABASE_URL production
echo 'YOUR_NEON_URL' | vercel env add DIRECT_URL production
```

### 3. Pousser le schéma vers Neon
```powershell
$env:DATABASE_URL="YOUR_NEON_URL"
$env:DIRECT_URL="YOUR_NEON_URL"
npx prisma db push
```

### 4. Créer l'admin en production
```powershell
$env:DATABASE_URL="YOUR_NEON_URL"
node scripts/seed-admin.js
```

### 5. Ajouter les produits
```powershell
$env:DATABASE_URL="YOUR_NEON_URL"
node scripts/seed-products.js
```

### 6. Redéployer
```powershell
vercel --prod
```

## ✅ Vérification
Après ces étapes, visitez :
- https://jaay-ndougou.vercel.app (site principal)
- https://jaay-ndougou.vercel.app/login (connexion admin)

## 🔐 Identifiants admin
- Email: admin@jaayndougou.sn
- Password: Admin@2026

# 🚀 Guide de Configuration Vercel - JaayNdougou

Ce guide vous accompagne étape par étape pour configurer les variables d'environnement dans Vercel.

## 📋 Prérequis

✅ Vous avez généré les nouvelles credentials avec: `node scripts/generate-credentials.js`
✅ Le fichier `.env.vercel.local` contient vos nouvelles credentials
✅ Vous avez un compte Vercel avec accès au projet JaayNdougou

## 🔐 Étape 1: Rotation du Mot de Passe Neon Database

### 1.1 Accéder à Neon Console

```bash
# Ouvrez dans votre navigateur
https://console.neon.tech
```

### 1.2 Sélectionner le Projet

1. Connectez-vous avec vos identifiants Neon
2. Sélectionnez le projet: **ep-square-hall-aiasntyk**
3. Allez dans l'onglet **Settings**

### 1.3 Réinitialiser le Mot de Passe

1. Cliquez sur **Database** dans le menu de gauche
2. Trouvez la section **Reset password**
3. Cliquez sur le bouton **Reset password**
4. Confirmez l'action

### 1.4 Copier les Nouvelles URLs

Après la réinitialisation, vous verrez deux URLs de connexion:

**1. Pooled Connection (pour DATABASE_URL):**
```
postgresql://[user]:[NEW_PASSWORD]@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10
```

**2. Direct Connection (pour DIRECT_URL):**
```
postgresql://[user]:[NEW_PASSWORD]@ep-square-hall-aiasntyk.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10
```

### 1.5 Mettre à Jour .env.vercel.local

Ouvrez le fichier `.env.vercel.local` et remplacez:

```bash
# AVANT
DATABASE_URL="postgresql://user:NEW_PASSWORD@..."
DIRECT_URL="postgresql://user:NEW_PASSWORD@..."

# APRÈS (avec les vraies URLs copiées de Neon)
DATABASE_URL="postgresql://[user]:[REAL_PASSWORD]@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
DIRECT_URL="postgresql://[user]:[REAL_PASSWORD]@ep-square-hall-aiasntyk.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"
```

## ⚙️ Étape 2: Configuration des Variables Vercel

### 2.1 Accéder à Vercel Dashboard

```bash
# Ouvrez dans votre navigateur
https://vercel.com/dashboard
```

### 2.2 Naviguer vers le Projet

1. Connectez-vous à Vercel
2. Sélectionnez votre projet: **JaayNdougou** (ou aliounendiaye221/JaayNdougou)
3. Cliquez sur **Settings** (en haut à droite)
4. Dans le menu de gauche, cliquez sur **Environment Variables**

### 2.3 Ajouter les Variables d'Environnement

Pour chaque variable dans `.env.vercel.local`, suivez ces étapes:

#### Variables à Configurer (dans l'ordre):

1. **DATABASE_URL**
   - Name: `DATABASE_URL`
   - Value: `[copier depuis .env.vercel.local]`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

2. **DIRECT_URL**
   - Name: `DIRECT_URL`
   - Value: `[copier depuis .env.vercel.local]`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

3. **NEXTAUTH_URL**
   - Name: `NEXTAUTH_URL`
   - Value: `https://jaayndougou.app`
   - Environments: ☑️ Production
   - Pour Preview/Dev, utilisez: `https://[your-project].vercel.app`
   - Cliquez sur **Save**

4. **NEXTAUTH_SECRET**
   - Name: `NEXTAUTH_SECRET`
   - Value: `[copier depuis .env.vercel.local - ligne 10]`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

5. **NEXT_PUBLIC_WHATSAPP_NUMBER**
   - Name: `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - Value: `+221786037913`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

6. **NEXT_PUBLIC_SITE_URL**
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://jaayndougou.app`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

7. **NEXT_PUBLIC_SITE_NAME**
   - Name: `NEXT_PUBLIC_SITE_NAME`
   - Value: `JaayNdougou`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

8. **ADMIN_EMAIL**
   - Name: `ADMIN_EMAIL`
   - Value: `admin@jaayndougou.sn`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

9. **INITIAL_ADMIN_PASSWORD**
   - Name: `INITIAL_ADMIN_PASSWORD`
   - Value: `[copier depuis .env.vercel.local - ligne 19]`
   - Environments: ☑️ Production ☑️ Preview ☑️ Development
   - Cliquez sur **Save**

### 2.4 Variables Optionnelles (si vous les avez)

#### Email (Resend)
- Name: `RESEND_API_KEY`
- Value: `re_[votre_clé]`
- Environments: ☑️ Production ☑️ Preview ☑️ Development

#### Paiements Wave
- Name: `WAVE_API_KEY`
- Value: `[votre_clé_wave]`
- Name: `WAVE_MERCHANT_NUMBER`
- Value: `[votre_numéro_marchand]`

#### Paiements Orange Money
- Name: `ORANGE_MONEY_API_KEY`
- Value: `[votre_clé_orange]`
- Name: `ORANGE_MONEY_MERCHANT_NUMBER`
- Value: `[votre_numéro_marchand]`

### 2.5 Vérification

Après avoir ajouté toutes les variables, vous devriez voir dans le tableau:

```
DATABASE_URL              Production, Preview, Development
DIRECT_URL                Production, Preview, Development
NEXTAUTH_URL              Production
NEXTAUTH_SECRET           Production, Preview, Development
NEXT_PUBLIC_WHATSAPP_NUMBER    Production, Preview, Development
NEXT_PUBLIC_SITE_URL      Production, Preview, Development
NEXT_PUBLIC_SITE_NAME     Production, Preview, Development
ADMIN_EMAIL               Production, Preview, Development
INITIAL_ADMIN_PASSWORD    Production, Preview, Development
[+ optionnelles si configurées]
```

## 🚀 Étape 3: Déploiement

### 3.1 Via Vercel Dashboard (Recommandé)

1. Allez dans l'onglet **Deployments**
2. Cliquez sur le bouton **Redeploy** sur le dernier déploiement
3. Cochez ☑️ **Use existing Build Cache**
4. Cliquez sur **Redeploy**

### 3.2 Via CLI Vercel (Alternative)

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Déployer en production
vercel --prod
```

### 3.3 Surveiller le Déploiement

1. Le déploiement prend généralement 2-5 minutes
2. Surveillez les logs pour détecter les erreurs
3. Vérifiez que le build se termine avec succès

## ✅ Étape 4: Validation Post-Déploiement

### 4.1 Créer le Compte Admin

Deux options:

**Option A: Via Script (si accès CLI):**
```bash
# Connectez-vous au projet Vercel
vercel env pull .env.production

# Exécutez le script de seed
node scripts/seed-admin.js
```

**Option B: Via Prisma Studio (si Neon accessible):**
```bash
# Localement avec les nouvelles credentials
npx prisma studio
```

### 4.2 Tester la Connexion Admin

1. Ouvrez votre site: `https://jaayndougou.app/login`
2. Utilisez les identifiants:
   - Email: `admin@jaayndougou.sn`
   - Mot de passe: `[celui généré dans .env.vercel.local]`
3. Vous devriez être redirigé vers `/admin/dashboard`

### 4.3 Changer le Mot de Passe Admin

⚠️ **IMPORTANT**: Changez immédiatement le mot de passe après la première connexion!

1. Dans le dashboard admin, allez dans les paramètres
2. Changez le mot de passe pour un nouveau (personnel)
3. Notez-le dans un gestionnaire de mots de passe sécurisé

### 4.4 Tests Fonctionnels

Vérifiez que tout fonctionne:

- [ ] Connexion admin réussie
- [ ] Affichage du dashboard avec statistiques
- [ ] Accès à la liste des produits
- [ ] Accès à la liste des commandes
- [ ] Navigation sans erreurs 404
- [ ] WhatsApp button visible et fonctionnel
- [ ] Images chargées correctement

## 🔍 Dépannage

### Erreur: "Invalid credentials"

**Solution:**
1. Vérifiez que `NEXTAUTH_SECRET` est correct dans Vercel
2. Videz le cache de votre navigateur
3. Essayez en navigation privée

### Erreur: "Database connection failed"

**Solution:**
1. Vérifiez que `DATABASE_URL` et `DIRECT_URL` sont corrects
2. Testez la connexion depuis Neon Console
3. Vérifiez que l'IP de Vercel est autorisée dans Neon

### Erreur: "Admin not found"

**Solution:**
1. L'admin n'a pas été créé
2. Exécutez `node scripts/seed-admin.js` avec les variables d'environnement
3. Ou créez manuellement via Prisma Studio

### Le site ne se charge pas

**Solution:**
1. Vérifiez les logs Vercel: Dashboard → Deployments → [votre déploiement] → Logs
2. Recherchez les erreurs de build ou runtime
3. Vérifiez que toutes les variables d'environnement sont définies

## 📝 Checklist Finale

Avant de marquer comme terminé:

- [ ] Mot de passe Neon roté
- [ ] Nouvelles URLs DATABASE_URL et DIRECT_URL copiées
- [ ] Toutes les variables d'environnement configurées dans Vercel
- [ ] Déploiement réussi sans erreur
- [ ] Compte admin créé
- [ ] Connexion admin testée et réussie
- [ ] Mot de passe admin changé (personnel)
- [ ] Tests fonctionnels passés
- [ ] `.env.vercel.local` stocké en sécurité (pas commité!)
- [ ] Anciennes credentials documentées comme obsolètes

## 🎉 Félicitations!

Votre application JaayNdougou est maintenant déployée avec des credentials sécurisés!

## 📞 Support

Si vous rencontrez des problèmes:

1. Consultez les logs Vercel
2. Vérifiez la documentation dans `SETUP.md` et `SECURITY.md`
3. Contactez le support technique

---

**Date de configuration**: ${new Date().toLocaleDateString('fr-FR')}
**Credentials générées**: Voir `.env.vercel.local`
**Status**: ✅ Prêt pour production

# Configuration de la Base de Données et de l'Administration - JaayNdougou

## ✅ Configuration Complétée

### 1. Base de Données SQLite
- ✅ Fichier `.env` créé avec la configuration DATABASE_URL
- ✅ Schema Prisma configuré pour SQLite
- ✅ Base de données créée dans `prisma/dev.db`

### 2. Administrateur Créé
- ✅ Script `scripts/setup-admin.js` créé et exécuté
- ✅ Utilisateur admin créé avec succès

**Identifiants de connexion:**
- Email: `admin@jaayndougou.sn`
- Mot de passe: `Admin@2026`
- Rôle: super-admin
- ID: cmj8zvmyl0000ccrgdam10cc0

### 3. Système d'Authentification
- ✅ NextAuth configuré dans `auth.ts` et `auth.config.ts`
- ✅ Middleware de protection des routes configuré
- ✅ Page de login fonctionnelle (`/login`)
- ✅ Redirection automatique vers `/admin/dashboard` après connexion

### 4. Pages Admin Disponibles
- `/admin/dashboard` - Tableau de bord avec statistiques
- `/admin/orders` - Gestion des commandes
- `/admin/orders/[id]` - Détails d'une commande
- `/admin/claims` - Gestion des réclamations

### 5. API Routes Admin
- ✅ `/api/admin/stats` - Statistiques du dashboard
- ✅ `/api/admin/orders` - Liste et gestion des commandes
- ✅ `/api/admin/claims` - Gestion des réclamations

## 🚀 Pour Démarrer le Serveur

```bash
npm run dev
```

Puis accédez à:
- **Page de connexion:** http://localhost:3000/login
- **Dashboard Admin:** http://localhost:3000/admin/dashboard (après connexion)

## 📝 Variables d'Environnement (.env)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="jaayndougou-secret-key-2026-change-in-production"
NEXT_PUBLIC_WHATSAPP_NUMBER="+221771234567"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="JaayNdougou"
ADMIN_EMAIL="admin@jaayndougou.sn"
ADMIN_DEFAULT_PASSWORD="Admin@2026"
```

## 🔧 Commandes Utiles

### Réinitialiser la base de données
```bash
npx prisma migrate reset
node scripts/setup-admin.js
```

### Voir les données dans la BDD
```bash
npx prisma studio
```

### Créer un nouvel admin
```bash
node scripts/setup-admin.js
```

### Vérifier l'admin existant
```bash
node scripts/check-admin.js
```

## ✅ Fonctionnalités Admin Opérationnelles

1. **Authentification Sécurisée**
   - Login avec email/mot de passe
   - Session gérée par NextAuth
   - Protection des routes admin par middleware

2. **Dashboard Moderne**
   - Statistiques en temps réel
   - Graphiques de revenus
   - Commandes récentes
   - Alertes de réclamations

3. **Gestion des Commandes**
   - Liste complète des commandes
   - Filtres par statut
   - Détails complets de chaque commande
   - Mise à jour du statut

4. **Gestion des Réclamations**
   - Liste des réclamations clients
   - Filtrage et recherche
   - Suivi du statut

## 🎨 Technologies Utilisées

- **Next.js 16** - Framework React
- **NextAuth 5 (beta)** - Authentification
- **Prisma** - ORM pour la base de données
- **SQLite** - Base de données (dev)
- **Tailwind CSS 4** - Styling
- **bcryptjs** - Hachage des mots de passe
- **Lucide React** - Icônes modernes

## 📱 Pour la Production

Avant de déployer en production:

1. Changer `DATABASE_URL` vers PostgreSQL
2. Générer un nouveau `NEXTAUTH_SECRET`: 
   ```bash
   openssl rand -base64 32
   ```
3. Changer le mot de passe admin
4. Mettre à jour `NEXT_PUBLIC_SITE_URL`
5. Configurer les variables d'environnement sur Vercel/Render

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Protection CSRF avec NextAuth
- ✅ Routes admin protégées par middleware
- ✅ Validation des credentials avec Zod
- ✅ Sessions sécurisées

---

**Status:** ✅ Système d'administration complètement fonctionnel et opérationnel
**Date:** 5 février 2026

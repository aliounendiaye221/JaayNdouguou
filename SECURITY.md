# 🔒 Guide de Sécurité - JaayNdougou

## 📋 Vue d'Ensemble

Ce document décrit les pratiques de sécurité recommandées pour le développement et le déploiement de JaayNdougou.

## 🚨 CRITIQUES - À Faire Immédiatement

### 1. Ne JAMAIS Commiter de Secrets

**Fichiers à NE JAMAIS commiter** :
```
.env
.env.local
.env.production
.env.*.local
*.secrets.txt
```

**Vérification avant commit** :
```bash
# Vérifier que les fichiers sensibles sont ignorés
git status

# Si un fichier .env apparaît, il NE DOIT PAS être commité
# Vérifier le .gitignore
cat .gitignore | grep -E "\.env"
```

**Si vous avez déjà commité un secret par erreur** :
```bash
# 1. Supprimer le fichier du dépôt
git rm --cached .env.production

# 2. Ajouter au .gitignore
echo ".env.production" >> .gitignore

# 3. Commiter la suppression
git commit -m "Remove sensitive .env file"
git push

# 4. CRITIQUE: Rotation immédiate des credentials
# - Changer le mot de passe de la base de données
# - Générer un nouveau NEXTAUTH_SECRET
# - Changer le mot de passe admin
# - Mettre à jour toutes les clés API

# 5. Purger l'historique Git (si nécessaire)
# Attention: Cette opération réécrit l'historique
git filter-branch --tree-filter 'rm -f .env.production' HEAD
git push --force-with-lease
```

### 2. Générer des Secrets Sécurisés

**Pour NEXTAUTH_SECRET** :
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Caractéristiques d'un bon secret** :
- ✅ Au moins 32 caractères
- ✅ Généré aléatoirement
- ✅ Différent pour dev/staging/production
- ✅ Stocké uniquement dans Vercel Environment Variables
- ❌ Jamais dans le code source
- ❌ Jamais dans les fichiers .env commités

### 3. Mots de Passe Admin Forts

**Requirements** :
- Minimum 16 caractères
- Majuscules ET minuscules
- Chiffres
- Symboles spéciaux
- Pas de mots du dictionnaire

**Exemple de génération** :
```bash
# Linux/Mac
openssl rand -base64 24

# Résultat: "Xk9#mP2$vLq7&nR3@wY5*zT8"
```

**IMPORTANT** :
1. Changer le mot de passe immédiatement après le premier déploiement
2. Ne JAMAIS utiliser "Admin@2026" ou similaire en production
3. Utiliser un gestionnaire de mots de passe

## 🛡️ Variables d'Environnement

### Configuration Vercel (Recommandée)

**Ne PAS utiliser de fichiers .env en production** :

1. Allez dans Vercel Dashboard → Votre Projet → Settings → Environment Variables
2. Ajoutez les variables une par une
3. Sélectionnez les environnements appropriés (Production, Preview, Development)
4. Cliquez sur "Save"

**Avantages** :
- ✅ Secrets chiffrés par Vercel
- ✅ Pas de risque de commit accidentel
- ✅ Accès contrôlé via permissions Vercel
- ✅ Historique des changements
- ✅ Rotation facile des credentials

### Variables Sensibles vs Publiques

**🔴 SENSIBLES (Serveur uniquement)** :
```bash
DATABASE_URL           # Credentials de base de données
DIRECT_URL            # URL directe base de données
NEXTAUTH_SECRET       # Secret de session
INITIAL_ADMIN_PASSWORD # Mot de passe admin initial
RESEND_API_KEY        # Clé API Resend
WAVE_API_KEY          # Clé API Wave
ORANGE_MONEY_API_KEY  # Clé API Orange Money
```

**🟢 PUBLIQUES (Préfixe NEXT_PUBLIC_)** :
```bash
NEXT_PUBLIC_WHATSAPP_NUMBER  # Numéro WhatsApp (visible côté client)
NEXT_PUBLIC_SITE_URL         # URL publique du site
NEXT_PUBLIC_SITE_NAME        # Nom du site
```

**Règle** : 
- Variables avec `NEXT_PUBLIC_` sont exposées au navigateur
- Ne JAMAIS y mettre de secrets ou credentials

## 🔐 Base de Données

### 1. Connexions Sécurisées

**Toujours utiliser SSL/TLS** :
```
postgresql://user:pass@host:5432/db?sslmode=require
```

**Options recommandées** :
- `sslmode=require` : Force SSL
- `connect_timeout=10` : Timeout de connexion
- `pgbouncer=true` : Pour connection pooling

### 2. Credentials

**Bonnes pratiques** :
- ✅ Utiliser des mots de passe générés (32+ caractères)
- ✅ Rotation régulière (tous les 90 jours)
- ✅ Utiliser Neon ou Vercel Postgres avec chiffrement automatique
- ✅ Activer les sauvegardes automatiques
- ❌ Ne jamais utiliser "postgres" comme mot de passe
- ❌ Ne jamais exposer le port PostgreSQL publiquement

### 3. Prisma Client

**Sécurité du client** :
```typescript
// ✅ BON: Singleton pattern
import { prisma } from '@/app/utils/prisma';

// ❌ MAUVAIS: Créer plusieurs instances
const prisma = new PrismaClient();
```

**Validation des entrées** :
```typescript
import { z } from 'zod';

// Toujours valider avant d'insérer en BDD
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(input);
if (!result.success) {
  throw new Error('Invalid input');
}
```

## 🌐 Sécurité Web

### Headers de Sécurité

Déjà configurés dans `next.config.ts` :

```typescript
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Prévient clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prévient MIME sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]
```

### Cookies Sécurisés

Configuration NextAuth dans `auth.ts` :

```typescript
cookies: {
  sessionToken: {
    name: '__Secure-next-auth.session-token',
    options: {
      httpOnly: true,    // Pas accessible via JavaScript
      sameSite: 'lax',   // Protection CSRF
      secure: true,      // HTTPS uniquement (en production)
      path: '/',
    },
  },
}
```

### CSRF Protection

NextAuth gère automatiquement la protection CSRF avec :
- Token CSRF dans les cookies
- Validation sur toutes les requêtes POST
- Rotation automatique des tokens

## 🔍 Audit et Monitoring

### Audit de Dépendances

**Exécuter régulièrement** :
```bash
# Vérifier les vulnérabilités
npm audit

# Corriger les vulnérabilités non-critiques
npm audit fix

# Corriger toutes les vulnérabilités (peut casser le code)
npm audit fix --force

# Mettre à jour les packages
npm update
```

### Surveillance des Logs

**Vercel Dashboard** :
1. Allez dans Functions → Logs
2. Recherchez les erreurs d'authentification
3. Surveillez les tentatives de connexion échouées
4. Alertez sur les patterns suspects

**Logs à surveiller** :
- Tentatives de connexion admin répétées
- Erreurs 401 (Unauthorized) fréquentes
- Accès à `/admin/*` sans auth
- Erreurs de base de données

## 🚀 Checklist de Déploiement

### Avant le Premier Déploiement

- [ ] Générer un nouveau `NEXTAUTH_SECRET` unique
- [ ] Créer un mot de passe admin fort (16+ caractères)
- [ ] Configurer les variables d'environnement dans Vercel
- [ ] Vérifier que `.env.production` n'est PAS dans Git
- [ ] Tester la connexion à la base de données
- [ ] Activer SSL/TLS sur la base de données
- [ ] Configurer les sauvegardes automatiques
- [ ] Vérifier le .gitignore

### Après le Déploiement

- [ ] Se connecter en tant qu'admin
- [ ] Changer le mot de passe admin immédiatement
- [ ] Vérifier que les emails fonctionnent (si configuré)
- [ ] Tester les paiements en mode sandbox
- [ ] Vérifier les logs Vercel pour erreurs
- [ ] Tester sur mobile (iOS et Android)
- [ ] Configurer les alertes Vercel
- [ ] Documenter les credentials (dans un coffre-fort)

### Maintenance Régulière

- [ ] Rotation des secrets (tous les 90 jours)
- [ ] Mise à jour des dépendances (mensuellement)
- [ ] Audit de sécurité (npm audit)
- [ ] Revue des logs d'accès
- [ ] Test de restauration de sauvegarde
- [ ] Vérification des permissions Vercel

## ⚠️ En Cas d'Incident de Sécurité

### 1. Credentials Exposés

**Action immédiate** :
1. Rotation de tous les credentials exposés
2. Revue des logs d'accès pour activité suspecte
3. Notification de l'équipe
4. Purge de l'historique Git si nécessaire
5. Documentation de l'incident

### 2. Accès Non Autorisé

**Si vous détectez un accès non autorisé** :
1. Changer immédiatement le mot de passe admin
2. Générer un nouveau NEXTAUTH_SECRET
3. Révoquer toutes les sessions actives
4. Examiner les logs pour l'étendue de l'intrusion
5. Vérifier l'intégrité de la base de données
6. Notifier les utilisateurs concernés si nécessaire

### 3. Vulnérabilité Découverte

**Process** :
1. Évaluer la criticité (critique/haute/moyenne/basse)
2. Développer un patch
3. Tester le patch
4. Déployer en production
5. Documenter la vulnérabilité et la correction

## 📞 Contact Sécurité

Pour signaler une vulnérabilité de sécurité :
- Email: security@jaayndougou.sn (prioritaire)
- PGP Key: [à configurer]

**Merci de NE PAS divulguer publiquement les vulnérabilités avant qu'elles ne soient corrigées.**

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Vercel Security Best Practices](https://vercel.com/docs/concepts/deployments/security)
- [Prisma Security](https://www.prisma.io/docs/guides/deployment/deployment-guides/production-best-practices)

---

**La sécurité est la responsabilité de tous. Restez vigilant !** 🔒

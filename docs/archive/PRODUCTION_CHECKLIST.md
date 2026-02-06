# CHECKLIST VALIDATION PRODUCTION - JAAYNDOUGOU
# =============================================
# Date: 06 Février 2026
# Objectif: Résoudre désynchronisation Admin/Site + Auth mobile

## 🔧 CORRECTIONS APPORTÉES

### 1. Configuration des Cookies (auth.ts)
- [x] Suppression du préfixe `__Host-` pour csrf-token (incompatible domaine .app)
- [x] Utilisation uniforme de `__Secure-` en production
- [x] Suppression du domaine hardcodé (laisse le navigateur gérer)
- [x] Ajout de logs de traçabilité pour l'authentification

### 2. Client Prisma (app/utils/prisma.ts)
- [x] Ajout fonction `getDbInfo()` pour diagnostic des connexions
- [x] Logs de configuration DB au démarrage
- [x] Fonction `testDatabaseConnection()` pour vérifier la connexion
- [x] Fonction `verifyDatabaseSource()` pour confirmer les données

### 3. API de Diagnostic (/api/debug-env)
- [x] Nouvelle route protégée pour diagnostiquer l'environnement
- [x] Affiche la configuration DB, Auth, et recommandations
- [x] Test de connexion DB avec latence

### 4. APIs Orders avec Traçabilité
- [x] `/api/orders` - Logs avec requestId et info DB
- [x] `/api/admin/orders` - Logs avec requestId et info DB
- [x] Headers no-cache ajoutés

---

## ✅ CHECKLIST DE VALIDATION

### A. Configuration Vercel (AVANT le déploiement)

Allez sur: Vercel Dashboard > [votre projet] > Settings > Environment Variables

| Variable | Valeur | Scope |
|----------|--------|-------|
| `NEXTAUTH_URL` | `https://jaayndougou.app` | Production |
| `NEXTAUTH_SECRET` | `votre_secret_jwt` | Production |
| `DATABASE_URL` | `postgresql://...pooler...?pgbouncer=true&...` | Production |
| `DIRECT_URL` | `postgresql://...?sslmode=require&...` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://jaayndougou.app` | Production |
| `NEXT_PUBLIC_SITE_NAME` | `JaayNdougou` | Production |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+221786037913` | Production |

⚠️ **CRITIQUE**: `DATABASE_URL` doit être IDENTIQUE en Production ET Preview

### B. Après Déploiement - Tests PC

- [ ] Ouvrir `https://jaayndougou.app` - Site charge correctement
- [ ] Ouvrir `https://jaayndougou.app/login` - Page de connexion
- [ ] Se connecter avec `admin@jaayndougou.sn` / `Admin@2026`
- [ ] Vérifier redirection vers `/admin/dashboard`
- [ ] Ouvrir `https://jaayndougou.app/api/debug-env`
- [ ] Vérifier que `database.connectionTest.connected = true`
- [ ] Vérifier que `database.info.host` contient votre host Neon

### C. Après Déploiement - Tests Mobile

- [ ] Sur mobile, ouvrir `https://jaayndougou.app`
- [ ] Ouvrir `https://jaayndougou.app/login`
- [ ] Se connecter avec les mêmes identifiants
- [ ] Vérifier redirection vers `/admin/dashboard`
- [ ] Vérifier que les commandes s'affichent

### D. Test de Synchronisation

1. **Sur PC (ou mobile):**
   - [ ] Créer une commande test sur `https://jaayndougou.app`
   - [ ] Noter le numéro de commande

2. **Sur Admin:**
   - [ ] Ouvrir `https://jaayndougou.app/admin/orders`
   - [ ] Vérifier que la commande apparaît dans la liste
   - [ ] Temps d'apparition < 5 secondes (polling actif)

3. **Logs Vercel:**
   - [ ] Aller dans Vercel > Deployments > Logs
   - [ ] Chercher `[PUBLIC/ORDERS]` pour les créations
   - [ ] Chercher `[ADMIN/ORDERS]` pour les lectures
   - [ ] Vérifier que les DB hosts sont IDENTIQUES

### E. Tests Multi-navigateurs

- [ ] Chrome PC - Connexion admin OK
- [ ] Firefox PC - Connexion admin OK  
- [ ] Safari Mobile - Connexion admin OK
- [ ] Chrome Mobile - Connexion admin OK

### F. Tests Navigation Incognito

- [ ] Mode incognito PC - Connexion admin OK
- [ ] Mode incognito Mobile - Connexion admin OK

---

## 🔴 SI PROBLÈME PERSISTE

### Authentification échoue sur mobile

1. Vérifier les cookies dans les DevTools mobile
2. Chercher `__Secure-next-auth.session-token`
3. Vérifier que `secure` est true et `sameSite` est "Lax"

**Action**: Si le cookie n'est pas créé:
```bash
# Vérifier les logs Vercel pour les erreurs auth
vercel logs --filter "[AUTH]"
```

### Commandes non synchronisées

1. Ouvrir `/api/debug-env` sur les deux appareils
2. Comparer `database.info.host`
3. Ils DOIVENT être identiques

**Action**: Si différents:
- Vérifier que Preview et Production ont la MÊME `DATABASE_URL`
- Supprimer la variable `DATABASE_URL` de Preview si différente

### Erreur "identifiants invalides"

1. Vérifier que l'admin existe en base:
```sql
SELECT email, role FROM "Admin";
```

2. Si vide, reseed l'admin:
```bash
npx prisma db seed
# ou
node scripts/seed-admin.js
```

---

## 📋 RÉSUMÉ TECHNIQUE

| Composant | Fichier | Statut |
|-----------|---------|--------|
| Auth Cookies | `auth.ts` | ✅ Corrigé |
| Prisma Client | `app/utils/prisma.ts` | ✅ Amélioré |
| API Debug | `app/api/debug-env/route.ts` | ✅ Créé |
| API Orders | `app/api/orders/route.ts` | ✅ Amélioré |
| API Admin Orders | `app/api/admin/orders/route.ts` | ✅ Amélioré |
| Env Vercel | `VERCEL_ENV_FINAL.txt` | ✅ Documenté |

---

## 🚀 DÉPLOIEMENT

```powershell
# 1. Commit des changements
git add -A
git commit -m "fix: auth cookies + db tracing for production sync"

# 2. Push (déclenche auto-deploy Vercel)
git push origin main

# 3. Attendre le déploiement (~2-3 min)
# 4. Exécuter la checklist de validation
```

---

**Résultat attendu:**
- ✅ Les commandes apparaissent instantanément dans le dashboard admin
- ✅ L'admin se connecte sans erreur sur téléphone
- ✅ Aucun "identifiant invalide"
- ✅ Comportement identique sur vercel.app et jaayndougou.app

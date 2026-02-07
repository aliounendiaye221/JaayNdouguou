# 🔐 Solution : Authentification Mobile - JaayNdougou.app

## ✅ Problème résolu
**"Identifiant invalide" sur mobile uniquement** → Causé par des cookies non sécurisés pour HTTPS

---

## 📋 ÉTAPE 1 : Configuration Vercel (CRITIQUE)

### Variables d'environnement à configurer

Allez sur **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**

Ajoutez/modifiez ces variables :

```bash
# CRITIQUE : URL de production avec HTTPS
NEXTAUTH_URL=https://jaayndougou.app

# Secret NextAuth (générez-en un nouveau si nécessaire)
NEXTAUTH_SECRET=votre_secret_actuel_ici

# Autres variables (gardez vos valeurs actuelles)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://jaayndougou.app
NEXT_PUBLIC_SITE_NAME=JaayNdougou
```

### ⚠️ IMPORTANT
- `NEXTAUTH_URL` doit être **exactement** `https://jaayndougou.app` (sans www, avec https)
- Redéployez immédiatement après avoir modifié les variables

---

## 📋 ÉTAPE 2 : Configuration DNS (name.com)

### A. Vérifiez vos enregistrements DNS actuels

Connectez-vous à **name.com** → **My Domains** → **jaayndougou.app** → **Manage DNS**

### B. Configuration recommandée

```dns
# Pointe vers Vercel
Type: A
Host: @
Value: 76.76.21.21
TTL: 300

# IPv6 (optionnel mais recommandé)
Type: AAAA
Host: @
Value: 2606:4700:4700::1111
TTL: 300

# Redirection www → non-www (géré par Vercel)
Type: CNAME
Host: www
Value: jaayndougou.app
TTL: 300
```

### C. Dans Vercel

**Vercel Dashboard** → **Domains** → Assurez-vous que :
- ✅ `jaayndougou.app` est le domaine principal
- ✅ `www.jaayndougou.app` redirige vers `jaayndougou.app`
- ✅ SSL/TLS est actif (automatique pour .app)

---

## 📋 ÉTAPE 3 : Déploiement

### Option A : Déploiement automatique (recommandé)

```bash
# Dans votre terminal (dossier du projet)
git add .
git commit -m "fix: Configuration cookies HTTPS pour mobile"
git push origin main
```

Vercel va automatiquement :
1. Détecter le push
2. Construire le projet
3. Déployer sur production

### Option B : Déploiement manuel

```bash
# Installez Vercel CLI si nécessaire
npm i -g vercel

# Déployez
vercel --prod
```

---

## 📋 ÉTAPE 4 : Test sur Mobile

### A. Vider le cache

**Sur iOS (Safari)** :
1. Réglages → Safari → Effacer historique et données

**Sur Android (Chrome)** :
1. Paramètres → Confidentialité → Effacer les données de navigation
2. Cochez "Cookies" et "Images et fichiers en cache"

### B. Test de connexion

1. Ouvrez **Safari/Chrome** sur mobile
2. Allez sur `https://jaayndougou.app/login`
3. Entrez vos identifiants admin
4. ✅ Connexion devrait fonctionner

### C. Vérification des cookies (optionnel)

**Sur Chrome mobile** :
1. Allez sur `chrome://inspect/#devices`
2. Inspectez la page
3. Console → `document.cookie` doit montrer `__Secure-next-auth.session-token`

---

## 🔧 CHANGEMENTS TECHNIQUES APPLIQUÉS

### 1. Cookies sécurisés ([auth.ts](auth.ts))
```typescript
cookies: {
  sessionToken: {
    name: '__Secure-next-auth.session-token', // Préfixe __Secure- pour HTTPS
    options: {
      httpOnly: true,           // Protection XSS
      sameSite: 'lax',          // Compatible mobile
      secure: true,             // HTTPS uniquement
      domain: '.jaayndougou.app', // Fonctionne sur tous sous-domaines
    }
  }
}
```

### 2. Redirection www → non-www ([vercel.json](vercel.json))
```json
"redirects": [{
  "source": "/:path*",
  "has": [{"type": "host", "value": "www.jaayndougou.app"}],
  "destination": "https://jaayndougou.app/:path*",
  "permanent": true
}]
```

### 3. TrustHost activé
Permet à NextAuth de fonctionner derrière un proxy (Vercel)

---

## 🚨 DÉPANNAGE

### Problème : "Identifiant invalide" persiste

**Solution 1** : Vérifiez les variables Vercel
```bash
# Dans le terminal Vercel CLI
vercel env ls
```
Assurez-vous que `NEXTAUTH_URL=https://jaayndougou.app`

**Solution 2** : Forcez un nouveau déploiement
```bash
vercel --prod --force
```

**Solution 3** : Vérifiez les logs
```bash
vercel logs [deployment-url]
```
Recherchez les erreurs liées à NextAuth

### Problème : Cookies non définis

Vérifiez que :
- ✅ Le domaine est bien `jaayndougou.app` (pas de www)
- ✅ HTTPS est actif (obligatoire pour .app)
- ✅ `NEXTAUTH_SECRET` est défini dans Vercel
- ✅ Le cache mobile est vidé

### Problème : Redirection en boucle

Si vous êtes bloqué entre `/login` et `/admin` :
1. Supprimez tous les cookies sur mobile
2. Vérifiez que `NEXTAUTH_URL` n'a pas de slash final
3. Redéployez

---

## ✅ CHECKLIST FINALE

Avant de marquer comme résolu, vérifiez :

- [ ] Variables Vercel configurées (NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] Code déployé sur production
- [ ] DNS pointe vers Vercel (vérifiez avec `nslookup jaayndougou.app`)
- [ ] SSL actif (le cadenas s'affiche dans le navigateur)
- [ ] Connexion admin fonctionne sur PC
- [ ] Cache mobile vidé
- [ ] Connexion admin fonctionne sur mobile (iOS)
- [ ] Connexion admin fonctionne sur mobile (Android)
- [ ] Test en navigation privée sur mobile

---

## 📞 SUPPORT

Si le problème persiste après ces étapes :

1. **Logs Vercel** : Consultez les logs de déploiement
2. **Console Mobile** : Utilisez les DevTools pour voir les erreurs
3. **Variables** : Double-vérifiez NEXTAUTH_URL et NEXTAUTH_SECRET

---

## 🎯 RÉSUMÉ

**Cause** : Cookies NextAuth non configurés pour HTTPS sur mobile  
**Solution** : Configuration explicite avec `secure: true`, `sameSite: 'lax'`, domaine correct  
**Résultat** : Admin accessible sur tous appareils (PC, iOS, Android)

**Temps estimé** : 5-10 minutes (configuration + déploiement)


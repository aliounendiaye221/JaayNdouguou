# Script de déploiement des corrections
# À exécuter après avoir vérifié les variables d'environnement sur Vercel

Write-Host "🚀 DÉPLOIEMENT DES CORRECTIONS - JaayNdougou" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Vérifier d'abord la configuration
Write-Host "1️⃣  Vérification de la configuration..." -ForegroundColor Yellow
node scripts/verify-config.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ La vérification a échoué. Corrigez les erreurs avant de continuer." -ForegroundColor Red
    exit 1
}

Write-Host "`n2️⃣  Ajout des fichiers au commit..." -ForegroundColor Yellow
git add .

Write-Host "`n3️⃣  Création du commit..." -ForegroundColor Yellow
git commit -m "fix: authentification mobile + commandes temps réel

✅ Corrections appliquées:
- Configuration cookies HTTPS pour mobile (.jaayndougou.app)
- Système de retry automatique (3 tentatives) pour enregistrement DB
- Optimisation Prisma pour Neon/PgBouncer
- Middleware optimisé (exclusion routes API publiques)
- Logs détaillés pour monitoring
- Auto-reconnexion DB en production

🎯 Résout:
- Problème connexion mobile sur domaine
- Commandes qui ne s'enregistrent pas en temps réel
- Timeouts de connexion DB"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  Aucun changement à commiter ou erreur git" -ForegroundColor Yellow
}

Write-Host "`n4️⃣  Push vers GitHub/Vercel..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DÉPLOIEMENT LANCÉ !" -ForegroundColor Green
    Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Vérifiez les variables d'environnement sur Vercel Dashboard:"
    Write-Host "      - NEXTAUTH_URL=https://jaayndougou.app" -ForegroundColor White
    Write-Host "      - DATABASE_URL avec pgbouncer=true" -ForegroundColor White
    Write-Host ""
    Write-Host "   2. Surveillez le déploiement sur Vercel Dashboard"
    Write-Host ""
    Write-Host "   3. Une fois déployé, testez:"
    Write-Host "      - Connexion mobile: https://jaayndougou.app/login"
    Write-Host "      - Commande test: Panier → Checkout → Valider"
    Write-Host "      - Vérifiez dans /admin/orders que la commande apparaît"
    Write-Host ""
    Write-Host "   4. Vérifiez les logs Vercel pour :"
    Write-Host "      '✅ Commande XXX enregistrée avec succès'" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 Documentation complète: FIXES_DEFINITIVES.md`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ ERREUR lors du push" -ForegroundColor Red
    Write-Host "Vérifiez votre connexion et les permissions Git`n"
    exit 1
}

# Script de déploiement alternatif via Vercel CLI
# Utilisé quand Git n'est pas accessible depuis PowerShell

Write-Host "🚀 DÉPLOIEMENT DIRECT VIA VERCEL CLI" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# Vérifier la configuration
Write-Host "1️⃣  Vérification de la configuration..." -ForegroundColor Yellow
node scripts/verify-config.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ La vérification a échoué." -ForegroundColor Red
    exit 1
}

Write-Host "`n2️⃣  Déploiement direct sur Vercel..." -ForegroundColor Yellow
Write-Host "    (Cela peut prendre 1-2 minutes)`n" -ForegroundColor Gray

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
    Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Vérifiez les variables d'environnement sur Vercel Dashboard:"
    Write-Host "      - NEXTAUTH_URL=https://jaayndougou.app" -ForegroundColor White
    Write-Host "      - DATABASE_URL avec pgbouncer=true" -ForegroundColor White
    Write-Host ""
    Write-Host "   2. Testez immédiatement:"
    Write-Host "      - Connexion mobile: https://jaayndougou.app/login"
    Write-Host "      - Commande test: Panier → Checkout → Valider"
    Write-Host "      - Vérifiez dans /admin/orders"
    Write-Host ""
    Write-Host "   3. Lancez les tests automatiques:"
    Write-Host "      node scripts/test-deployment.js" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Documentation: FIXES_DEFINITIVES.md`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ ERREUR lors du déploiement" -ForegroundColor Red
    Write-Host "Vérifiez votre connexion et authentification Vercel`n"
    exit 1
}

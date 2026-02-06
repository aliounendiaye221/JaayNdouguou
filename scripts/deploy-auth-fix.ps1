# Script de déploiement des corrections d'authentification
Write-Host "🚀 Déploiement des corrections d'authentification mobile..." -ForegroundColor Cyan

# Vérifier si git est disponible
try {
    git --version | Out-Null
    Write-Host "✅ Git détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "📖 Veuillez installer Git depuis https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Aller dans le répertoire du projet
Set-Location -Path $PSScriptRoot\..

# Afficher les fichiers modifiés
Write-Host "`n📝 Fichiers à commiter:" -ForegroundColor Yellow
git status --short

# Ajouter les fichiers
Write-Host "`n➕ Ajout des fichiers..." -ForegroundColor Yellow
git add auth.ts
git add .env.production.example
git add CONFIGURATION_VERCEL_EXACTE.md

# Commiter
Write-Host "`n💾 Commit des changements..." -ForegroundColor Yellow
git commit -m "fix(auth): Suppression domaine explicite cookies + guide config Vercel exacte"

# Pousser
Write-Host "`n📤 Push vers GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Déploiement réussi!" -ForegroundColor Green
    Write-Host "`n📋 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
    Write-Host "1. Allez sur https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Configurez NEXTAUTH_URL = https://jaayndougou.app" -ForegroundColor White
    Write-Host "3. Générez un nouveau NEXTAUTH_SECRET" -ForegroundColor White
    Write-Host "4. Redéployez sur Vercel" -ForegroundColor White
    Write-Host "5. Videz le cache mobile et testez" -ForegroundColor White
    Write-Host "`n📖 Guide complet: CONFIGURATION_VERCEL_EXACTE.md" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Erreur lors du push" -ForegroundColor Red
    Write-Host "Vérifiez votre connexion GitHub" -ForegroundColor Yellow
}

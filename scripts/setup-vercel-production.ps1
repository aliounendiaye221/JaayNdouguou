# Script automatisé pour configurer les variables d'environnement Vercel en production
# Usage: .\scripts\setup-vercel-production.ps1

Write-Host ""
Write-Host "🚀 CONFIGURATION VERCEL PRODUCTION" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Vercel CLI est installé
Write-Host "1️⃣  Vérification de Vercel CLI..." -ForegroundColor Yellow
$vercelVersion = vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Installez-le avec: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
Write-Host ""

# Vérifier l'authentification
Write-Host "2️⃣  Vérification de l'authentification..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vous n'êtes pas connecté" -ForegroundColor Red
    Write-Host "Exécutez: vercel login" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Connecté comme: $whoami" -ForegroundColor Green
Write-Host ""

# Lire .env.local
Write-Host "3️⃣  Lecture des variables locales..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "❌ Fichier .env.local introuvable" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
$NEXTAUTH_SECRET = ""
if ($envContent -match "NEXTAUTH_SECRET='([^']+)'") {
    $NEXTAUTH_SECRET = $Matches[1]
}

if (!$NEXTAUTH_SECRET) {
    Write-Host "❌ NEXTAUTH_SECRET introuvable dans .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Variables locales chargées" -ForegroundColor Green
Write-Host ""

# Variables à configurer
Write-Host "4️⃣  Configuration des variables d'environnement..." -ForegroundColor Yellow
Write-Host ""

$variables = @{
    "NEXTAUTH_URL" = "https://jaayndougou.app"
    "NEXTAUTH_SECRET" = $NEXTAUTH_SECRET
    "DATABASE_URL" = "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"
    "NEXT_PUBLIC_SITE_URL" = "https://jaayndougou.app"
    "NEXT_PUBLIC_SITE_NAME" = "JaayNdougou"
    "NEXT_PUBLIC_WHATSAPP_NUMBER" = "+221786037913"
}

$count = 0
foreach ($key in $variables.Keys) {
    $count++
    $value = $variables[$key]
    
    Write-Host "   [$count/6] Configuration de $key..." -ForegroundColor White
    
    # Créer un fichier temporaire avec la valeur
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    # Supprimer la variable existante (si elle existe)
    vercel env rm $key production --yes 2>&1 | Out-Null
    
    # Ajouter la nouvelle variable
    $result = Get-Content $tempFile | vercel env add $key production 2>&1
    
    # Nettoyer le fichier temporaire
    Remove-Item $tempFile -Force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "       ✅ ${key} configurée" -ForegroundColor Green
    } else {
        Write-Host "       ⚠️  ${key} - $result" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "5️⃣  Redéploiement en production..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Lancement du déploiement..." -ForegroundColor White

# Déployer
$deployResult = vercel --prod --yes 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Votre site est maintenant en ligne sur:" -ForegroundColor Cyan
    Write-Host "   https://jaayndougou.app" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERREUR DE DÉPLOIEMENT" -ForegroundColor Red
    Write-Host $deployResult
    Write-Host ""
    Write-Host "Vérifiez les logs avec: vercel logs" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Testez votre site: https://jaayndougou.app" -ForegroundColor White
Write-Host "   2. Testez la connexion admin: https://jaayndougou.app/login" -ForegroundColor White
Write-Host "   3. Surveillez les logs: vercel logs --prod" -ForegroundColor White
Write-Host ""

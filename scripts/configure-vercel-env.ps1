# Script pour configurer les variables d'environnement sur Vercel
# Assurez-vous d'être connecté à Vercel CLI (vercel login)

Write-Host "🔧 CONFIGURATION DES VARIABLES VERCEL" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Vérifier que l'utilisateur est connecté
Write-Host "1️⃣  Vérification de l'authentification Vercel..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vous n'êtes pas connecté à Vercel" -ForegroundColor Red
    Write-Host "Exécutez d'abord: vercel login`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Connecté comme: $($whoami -join '')`n" -ForegroundColor Green

# Lire les variables depuis .env
Write-Host "2️⃣  Lecture des variables depuis .env..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    Write-Host "❌ Fichier .env introuvable`n" -ForegroundColor Red
    exit 1
}

$envVars = @{}
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $envVars[$Matches[1]] = $Matches[2].Trim('"')
    }
}

Write-Host "   ✅ Variables lues depuis .env`n" -ForegroundColor Green

# Variables critiques à configurer
$criticalVars = @(
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL"
)

$optionalVars = @(
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_WHATSAPP_NUMBER"
)

Write-Host "3️⃣  Configuration des variables sur Vercel...`n" -ForegroundColor Yellow

# Variables critiques
Write-Host "   Variables CRITIQUES:" -ForegroundColor Red
foreach ($varName in $criticalVars) {
    if ($envVars.ContainsKey($varName) -and $envVars[$varName]) {
        Write-Host "   - $varName" -ForegroundColor White
        # Note: vercel env add nécessite une interaction
        # Utilisez vercel env add $varName production < value.txt
    } else {
        Write-Host "   ⚠️  $varName manquante dans .env" -ForegroundColor Yellow
    }
}

Write-Host "`n   Variables OPTIONNELLES:" -ForegroundColor Cyan
foreach ($varName in $optionalVars) {
    if ($envVars.ContainsKey($varName) -and $envVars[$varName]) {
        Write-Host "   - $varName" -ForegroundColor White
    } else {
        Write-Host "   ⚠️  $varName manquante dans .env" -ForegroundColor Yellow
    }
}

Write-Host "`n📝 PROCHAINES ÉTAPES MANUELLES:" -ForegroundColor Cyan
Write-Host "================================================`n"

Write-Host "Pour chaque variable ci-dessus, exécutez :"
Write-Host "vercel env add NOM_VARIABLE production" -ForegroundColor Yellow
Write-Host "`nExemple pour DATABASE_URL:" -ForegroundColor Gray
Write-Host "vercel env add DATABASE_URL production" -ForegroundColor White
Write-Host "# Puis collez la valeur quand demandé`n" -ForegroundColor Gray

Write-Host "OU utilisez le Dashboard Vercel :" -ForegroundColor Cyan
Write-Host "1. https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Sélectionnez votre projet" -ForegroundColor White
Write-Host "3. Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Add New → Collez nom et valeur" -ForegroundColor White
Write-Host "5. Cochez 'Production' → Save`n" -ForegroundColor White

Write-Host "Valeurs à utiliser (COPIEZ-COLLEZ) :" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
foreach ($varName in $criticalVars + $optionalVars) {
    if ($envVars.ContainsKey($varName) -and $envVars[$varName]) {
        $value = $envVars[$varName]
        # Masquer les parties sensibles
        if ($varName -eq "DATABASE_URL" -and $value -match "://([^:]+):([^@]+)@") {
            $maskedValue = $value -replace "://([^:]+):([^@]+)@", "://USER:***@"
            Write-Host "`n$varName=" -NoNewline -ForegroundColor Cyan
            Write-Host "$maskedValue" -ForegroundColor Gray
            Write-Host "(Utilisez la valeur complète depuis .env)" -ForegroundColor Yellow
        } elseif ($varName -like "*SECRET*") {
            Write-Host "`n$varName=" -NoNewline -ForegroundColor Cyan
            Write-Host "***HIDDEN***" -ForegroundColor Gray
            Write-Host "(Utilisez la valeur complète depuis .env)" -ForegroundColor Yellow
        } else {
            Write-Host "`n$varName=" -NoNewline -ForegroundColor Cyan
            Write-Host "$value" -ForegroundColor White
        }
    }
}

Write-Host "`n`n🚀 Après avoir configuré toutes les variables :" -ForegroundColor Green
Write-Host "vercel --prod --yes`n" -ForegroundColor White

# Script PowerShell pour diagnostiquer et corriger l'authentification admin
# Ce script utilise les variables d'environnement de production

Write-Host "`n🔍 DIAGNOSTIC DE L'AUTHENTIFICATION ADMIN`n" -ForegroundColor Cyan

# Charger les variables d'environnement de production
Write-Host "1️⃣ Chargement des variables d'environnement..." -ForegroundColor Yellow

$envFile = ".env.production"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ Variables d'environnement chargées`n" -ForegroundColor Green
} else {
    Write-Host "❌ Fichier .env.production non trouvé!`n" -ForegroundColor Red
    exit 1
}

# Exécuter le script de diagnostic
Write-Host "2️⃣ Exécution du diagnostic...`n" -ForegroundColor Yellow
node scripts/diagnose-auth.js

Write-Host "`n✅ Diagnostic terminé!" -ForegroundColor Green

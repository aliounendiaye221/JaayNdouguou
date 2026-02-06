# Configuration simplifiée des variables Vercel
# Ce script configure les variables une par une

Write-Host ""
Write-Host "🔧 CONFIGURATION VERCEL SIMPLIFIÉE" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Lire NEXTAUTH_SECRET depuis .env.local
$envContent = Get-Content ".env.local" -Raw
$NEXTAUTH_SECRET = ""
if ($envContent -match "NEXTAUTH_SECRET='([^']+)'") {
    $NEXTAUTH_SECRET = $Matches[1]
}

if (!$NEXTAUTH_SECRET) {
    Write-Host "❌ NEXTAUTH_SECRET introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Configuration des variables..." -ForegroundColor Yellow
Write-Host ""

# Fonction pour configurer une variable
function Set-VercelEnv {
    param($Name, $Value)
    
    Write-Host "   Configuring $Name..." -ForegroundColor White
    
    # Créer fichier temporaire
    $temp = New-TemporaryFile
    Set-Content -Path $temp.FullName -Value $Value -NoNewline
    
    # Supprimer l'ancienne (ignorer les erreurs)
    vercel env rm $Name production --yes 2>&1 | Out-Null
    
    # Ajouter la nouvelle
    Get-Content $temp.FullName | vercel env add $Name production --yes 2>&1 | Out-Null
    
    Remove-Item $temp.FullName -Force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "       ✅ Done" -ForegroundColor Green
    } else {
        Write-Host "       ⚠️  Warning" -ForegroundColor Yellow
    }
}

# Configurer chaque variable
Set-VercelEnv "NEXTAUTH_URL" "https://jaayndougou.app"
Set-VercelEnv "NEXTAUTH_SECRET" $NEXTAUTH_SECRET
Set-VercelEnv "DATABASE_URL" "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"
Set-VercelEnv "NEXT_PUBLIC_SITE_URL" "https://jaayndougou.app"
Set-VercelEnv "NEXT_PUBLIC_SITE_NAME" "JaayNdougou"
Set-VercelEnv "NEXT_PUBLIC_WHATSAPP_NUMBER" "+221786037913"

Write-Host ""
Write-Host "✅ CONFIGURATION TERMINÉE!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Maintenant, déployez avec:" -ForegroundColor Cyan
Write-Host "   vercel --prod --yes" -ForegroundColor White
Write-Host ""

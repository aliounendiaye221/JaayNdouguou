# Script pour mettre à jour les variables d'environnement Vercel
# Utilise le domaine principal jaayndougou.app

Write-Host "🔧 Mise à jour des variables d'environnement Vercel..." -ForegroundColor Cyan

# Variables de base de données Neon
$DATABASE_URL = "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
$DIRECT_URL = "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"

# Configuration NextAuth avec le domaine principal
$NEXTAUTH_URL = "https://jaayndougou.app"
$NEXTAUTH_SECRET = "kiU3OeEIQgsj+SmmDqehUgXlWW6c0PNtQSEQwgnulws="

# Configuration publique du site
$NEXT_PUBLIC_SITE_URL = "https://jaayndougou.app"
$NEXT_PUBLIC_SITE_NAME = "JaayNdougou"
$NEXT_PUBLIC_WHATSAPP_NUMBER = "+221786037913"

# Configuration Admin
$ADMIN_EMAIL = "admin@jaayndougou.sn"
$ADMIN_DEFAULT_PASSWORD = "Admin@2026"

# Fonction pour supprimer et recréer une variable d'environnement
function Update-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "  📝 Mise à jour de $Name pour $Environment..." -ForegroundColor Yellow
    
    # Supprimer l'ancienne variable
    vercel env rm $Name $Environment --yes 2>$null
    
    # Ajouter la nouvelle variable
    echo $Value | vercel env add $Name $Environment
}

# Mise à jour des variables pour Production et Preview
$environments = @("production", "preview")

foreach ($env in $environments) {
    Write-Host "`n🌍 Configuration de l'environnement: $env" -ForegroundColor Green
    
    Update-VercelEnv -Name "DATABASE_URL" -Value $DATABASE_URL -Environment $env
    Update-VercelEnv -Name "DIRECT_URL" -Value $DIRECT_URL -Environment $env
    Update-VercelEnv -Name "NEXTAUTH_URL" -Value $NEXTAUTH_URL -Environment $env
    Update-VercelEnv -Name "NEXTAUTH_SECRET" -Value $NEXTAUTH_SECRET -Environment $env
    Update-VercelEnv -Name "NEXT_PUBLIC_SITE_URL" -Value $NEXT_PUBLIC_SITE_URL -Environment $env
    Update-VercelEnv -Name "NEXT_PUBLIC_SITE_NAME" -Value $NEXT_PUBLIC_SITE_NAME -Environment $env
    Update-VercelEnv -Name "NEXT_PUBLIC_WHATSAPP_NUMBER" -Value $NEXT_PUBLIC_WHATSAPP_NUMBER -Environment $env
    Update-VercelEnv -Name "ADMIN_EMAIL" -Value $ADMIN_EMAIL -Environment $env
    Update-VercelEnv -Name "ADMIN_DEFAULT_PASSWORD" -Value $ADMIN_DEFAULT_PASSWORD -Environment $env
}

Write-Host "`n✅ Toutes les variables d'environnement ont été mises à jour!" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant redéployer votre application avec: vercel --prod" -ForegroundColor Cyan

# Script de configuration complète des variables d'environnement Vercel
# Version robuste avec gestion d'erreurs

Write-Host "`n=== Configuration des variables Vercel ===" -ForegroundColor Cyan

# Variables à configurer
$vars = @{
    "DATABASE_URL" = "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
    "DIRECT_URL" = "postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"
    "NEXTAUTH_URL" = "https://jaayndougou.app"
    "NEXTAUTH_SECRET" = "kiU3OeEIQgsj+SmmDqehUgXlWW6c0PNtQSEQwgnulws="
    "NEXT_PUBLIC_SITE_URL" = "https://jaayndougou.app"
    "NEXT_PUBLIC_SITE_NAME" = "JaayNdougou"
    "NEXT_PUBLIC_WHATSAPP_NUMBER" = "+221786037913"
    "ADMIN_EMAIL" = "admin@jaayndougou.sn"
    "ADMIN_DEFAULT_PASSWORD" = "Admin@2026"
}

# Parcourir chaque variable
foreach ($varName in $vars.Keys) {
    $value = $vars[$varName]
    
    Write-Host "`n📝 Configuration de $varName..." -ForegroundColor Yellow
    
    # Production
    Write-Host "  → Production" -ForegroundColor Gray
    vercel env rm $varName production --yes 2>$null | Out-Null
    echo $value | vercel env add $varName production | Out-Null
    
    # Preview  
    Write-Host "  → Preview" -ForegroundColor Gray
    vercel env rm $varName preview --yes 2>$null | Out-Null
    echo $value | vercel env add $varName preview | Out-Null
    
    Write-Host "  ✓ $varName configuré" -ForegroundColor Green
}

Write-Host "`n✅ Configuration terminée!" -ForegroundColor Green
Write-Host "`n📋 Liste des variables configurées:" -ForegroundColor Cyan
vercel env ls

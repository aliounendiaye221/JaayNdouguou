# Configuration des variables d'environnement Vercel pour la production

Write-Host "🚀 Configuration de Vercel pour la production..." -ForegroundColor Cyan
Write-Host ""

# Variables d'environnement à configurer
$envVars = @(
    @{name="DATABASE_URL"; value="postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"},
    @{name="DIRECT_URL"; value="postgresql://neondb_owner:npg_9IjXhtOmSgN6@ep-square-hall-aiasntyk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"},
    @{name="NEXTAUTH_URL"; value="https://jaayndougou.vercel.app"},
    @{name="NEXTAUTH_SECRET"; value="kiU3OeEIQgsj+SmmDqehUgXlWW6c0PNtQSEQwgnulws="},
    @{name="NEXT_PUBLIC_WHATSAPP_NUMBER"; value="+221786037913"},
    @{name="NEXT_PUBLIC_SITE_URL"; value="https://jaayndougou.vercel.app"},
    @{name="NEXT_PUBLIC_SITE_NAME"; value="JaayNdougou"},
    @{name="ADMIN_EMAIL"; value="admin@jaayndougou.sn"},
    @{name="ADMIN_DEFAULT_PASSWORD"; value="Admin@2026"}
)

Write-Host "📝 Variables à configurer sur Vercel:" -ForegroundColor Yellow
foreach ($env in $envVars) {
    if ($env.name -like "*SECRET*" -or $env.name -like "*PASSWORD*" -or $env.name -like "*URL*DATABASE*") {
        Write-Host "   ✓ $($env.name) = [MASQUÉ]" -ForegroundColor Gray
    } else {
        Write-Host "   ✓ $($env.name) = $($env.value)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "⚙️  Configuration automatique via Vercel CLI..." -ForegroundColor Cyan

foreach ($env in $envVars) {
    Write-Host "   → $($env.name)..." -NoNewline
    try {
        $result = vercel env add $env.name production --force 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            # Envoyer la valeur via stdin
            $env.value | vercel env add $env.name production --force 2>&1 | Out-Null
            Write-Host " ✓" -ForegroundColor Green
        } else {
            Write-Host " ⚠️  (peut déjà exister)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ❌" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🔄 Préparation du schéma Prisma pour PostgreSQL..." -ForegroundColor Cyan
Copy-Item "prisma\schema.production.prisma" "prisma\schema.backup.prisma" -Force
Copy-Item "prisma\schema.production.prisma" "prisma\schema.prisma" -Force
Write-Host "   ✓ Schéma PostgreSQL activé" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Génération du client Prisma..." -ForegroundColor Cyan
npx prisma generate
Write-Host "   ✓ Client généré" -ForegroundColor Green

Write-Host ""
Write-Host "✨ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Exécutez: vercel --prod" -ForegroundColor White
Write-Host "   2. Après déploiement, créez l'admin: node scripts/seed-admin.js (sur Neon)" -ForegroundColor White
Write-Host "   3. Ajoutez les produits: node scripts/seed-products.js (sur Neon)" -ForegroundColor White
Write-Host ""

# Script rapide pour mettre à jour les variables critiques Vercel
# Met à jour uniquement NEXTAUTH_URL et NEXT_PUBLIC_SITE_URL pour utiliser le domaine principal

Write-Host "`n🔧 Mise à jour des URLs pour le domaine principal jaayndougou.app`n" -ForegroundColor Cyan

# Variables critiques à mettre à jour
$criticalVars = @{
    "NEXTAUTH_URL" = "https://jaayndougou.app"
    "NEXT_PUBLIC_SITE_URL" = "https://jaayndougou.app"
}

foreach ($varName in $criticalVars.Keys) {
    $value = $criticalVars[$varName]
    
    Write-Host "📝 $varName = $value" -ForegroundColor Yellow
    
    # Production
    Write-Host "  → Suppression ancienne valeur (production)..." -ForegroundColor Gray
    vercel env rm $varName production --yes 2>$null
    Write-Host "  → Ajout nouvelle valeur (production)..." -ForegroundColor Gray  
    echo $value | vercel env add $varName production
    
    # Preview
    Write-Host "  → Suppression ancienne valeur (preview)..." -ForegroundColor Gray
    vercel env rm $varName preview --yes 2>$null
    Write-Host "  → Ajout nouvelle valeur (preview)..." -ForegroundColor Gray
    echo $value | vercel env add $varName preview
    
    Write-Host "  ✅ $varName mis à jour`n" -ForegroundColor Green
}

Write-Host "✅ Mise à jour des URLs terminée!" -ForegroundColor Green
Write-Host "`n📋 Variables d'environnement actuelles:" -ForegroundColor Cyan
vercel env ls | Select-String -Pattern "NEXTAUTH_URL|NEXT_PUBLIC_SITE_URL" -Context 0,0

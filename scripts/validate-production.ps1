# =====================================================
# Script de validation production JaayNdougou
# =====================================================
# Usage: .\scripts\validate-production.ps1
# =====================================================

$ErrorActionPreference = "Stop"

Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     VALIDATION PRODUCTION - JAAYNDOUGOU                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$productionUrl = "https://jaayndougou.app"
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "  Testing: $Name... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ OK ($($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ Unexpected ($($response.StatusCode))" -ForegroundColor Yellow
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ OK ($statusCode)" -ForegroundColor Green
            return $true
        } elseif ($statusCode -eq 401) {
            Write-Host "🔐 Auth required (normal)" -ForegroundColor Yellow
            return $true
        } else {
            Write-Host "❌ FAILED ($statusCode)" -ForegroundColor Red
            return $false
        }
    }
}

# =====================================================
# 1. Vérification des fichiers locaux
# =====================================================
Write-Host "`n📁 Vérification des fichiers modifiés..." -ForegroundColor Yellow

$filesToCheck = @(
    "auth.ts",
    "app/utils/prisma.ts",
    "app/api/debug-env/route.ts",
    "app/api/orders/route.ts",
    "app/api/admin/orders/route.ts"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  ❌ $file MANQUANT" -ForegroundColor Red
        $failed++
    }
}

# =====================================================
# 2. Vérification du .env local
# =====================================================
Write-Host "`n🔧 Vérification de la configuration locale..." -ForegroundColor Yellow

if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "DATABASE_URL=") {
        Write-Host "  ✅ DATABASE_URL configuré" -ForegroundColor Green
        
        if ($envContent -match "pgbouncer=true") {
            Write-Host "  ✅ PgBouncer activé" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "  ⚠️ PgBouncer non détecté (recommandé)" -ForegroundColor Yellow
        }
        
        if ($envContent -match "pooler") {
            Write-Host "  ✅ Endpoint pooler utilisé" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "  ⚠️ Endpoint non-pooler détecté" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ DATABASE_URL manquant!" -ForegroundColor Red
        $failed++
    }
    
    if ($envContent -match "NEXTAUTH_SECRET=") {
        Write-Host "  ✅ NEXTAUTH_SECRET configuré" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  ❌ NEXTAUTH_SECRET manquant!" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host "  ⚠️ Fichier .env non trouvé (normal si déploiement uniquement)" -ForegroundColor Yellow
}

# =====================================================
# 3. Test de la production (si accessible)
# =====================================================
Write-Host "`n🌐 Tests de la production ($productionUrl)..." -ForegroundColor Yellow

try {
    # Test page d'accueil
    if (Test-Endpoint "Page d'accueil" "$productionUrl") { $passed++ } else { $failed++ }
    
    # Test page login
    if (Test-Endpoint "Page login" "$productionUrl/login") { $passed++ } else { $failed++ }
    
    # Test API orders (publique)
    if (Test-Endpoint "API Orders (GET)" "$productionUrl/api/orders" -ExpectedStatus 405) { $passed++ } else { $failed++ }
    
    # Test API admin (protégée - devrait retourner 401 ou redirect)
    if (Test-Endpoint "API Admin Orders" "$productionUrl/api/admin/orders" -ExpectedStatus 401) { $passed++ } else { $failed++ }
    
} catch {
    Write-Host "  ⚠️ Production non accessible: $_" -ForegroundColor Yellow
}

# =====================================================
# 4. Résumé
# =====================================================
Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                       RÉSUMÉ                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "  Tests réussis: $passed" -ForegroundColor Green
Write-Host "  Tests échoués: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "  ✅ PRÊT POUR LE DÉPLOIEMENT" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Prochaines étapes:" -ForegroundColor White
    Write-Host "    1. git add -A" -ForegroundColor DarkGray
    Write-Host "    2. git commit -m 'fix: production sync + mobile auth'" -ForegroundColor DarkGray
    Write-Host "    3. git push origin main" -ForegroundColor DarkGray
    Write-Host "    4. Vérifier les variables Vercel (voir VERCEL_ENV_FINAL.txt)" -ForegroundColor DarkGray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  ⚠️ Corrigez les erreurs avant de déployer" -ForegroundColor Yellow
    Write-Host ""
}

# =====================================================
# 5. Instructions post-déploiement
# =====================================================
Write-Host "📋 TESTS POST-DÉPLOIEMENT À FAIRE:" -ForegroundColor Yellow
Write-Host "   1. Ouvrir $productionUrl/api/debug-env (après login)" -ForegroundColor White
Write-Host "   2. Vérifier database.connectionTest.connected = true" -ForegroundColor White
Write-Host "   3. Tester login sur mobile via $productionUrl/login" -ForegroundColor White
Write-Host "   4. Créer une commande test et vérifier dans /admin/orders" -ForegroundColor White
Write-Host ""

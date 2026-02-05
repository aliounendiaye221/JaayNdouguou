# Script de test rapide de l'authentification mobile
# Usage: .\scripts\test-mobile-auth.ps1

Write-Host "🔍 Test de configuration d'authentification mobile" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Test 1: Vérifier que le domaine est accessible
Write-Host "1️⃣ Test de connectivité HTTPS..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://jaayndouguou.app" -Method Head -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Site accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Code inattendu: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   → Vérifiez que le site est déployé sur Vercel" -ForegroundColor Red
}

Write-Host ""

# Test 2: Vérifier la redirection www
Write-Host "2️⃣ Test de redirection www..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://www.jaayndouguou.app" -Method Head -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 308 -or $response.StatusCode -eq 301) {
        $location = $response.Headers.Location
        if ($location -eq "https://jaayndouguou.app/" -or $location -eq "https://jaayndouguou.app") {
            Write-Host "   ✅ Redirection www → non-www OK" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Redirige vers: $location" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Pas de redirection détectée (Code: $($response.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Impossible de tester la redirection" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Vérifier SSL/TLS
Write-Host "3️⃣ Test SSL/TLS..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://jaayndouguou.app" -Method Head -UseBasicParsing
    Write-Host "   ✅ Certificat SSL valide" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erreur SSL: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Vérifier les headers de sécurité
Write-Host "4️⃣ Test des headers de sécurité..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://jaayndouguou.app" -Method Head -UseBasicParsing
    $headers = $response.Headers
    
    $securityHeaders = @{
        "X-Content-Type-Options" = "nosniff"
        "X-Frame-Options" = "DENY"
        "X-XSS-Protection" = "1; mode=block"
        "Referrer-Policy" = "origin-when-cross-origin"
    }
    
    foreach ($header in $securityHeaders.Keys) {
        if ($headers.ContainsKey($header)) {
            Write-Host "   ✅ $header présent" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $header manquant" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ⚠️  Impossible de vérifier les headers" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Vérifier que la page login est accessible
Write-Host "5️⃣ Test de la page de login..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://jaayndouguou.app/login" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Page /login accessible" -ForegroundColor Green
        
        # Vérifier si le contenu contient le formulaire
        if ($response.Content -match "email" -and $response.Content -match "password") {
            Write-Host "   ✅ Formulaire de connexion détecté" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Formulaire non détecté dans la page" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Vérifier la configuration locale
Write-Host "6️⃣ Vérification de la configuration locale..." -ForegroundColor Yellow

# Vérifier que auth.ts contient les bons paramètres
$authFile = Join-Path $PSScriptRoot "..\auth.ts"
if (Test-Path $authFile) {
    $authContent = Get-Content $authFile -Raw
    
    $checks = @(
        @{Pattern = "useSecureCookies"; Name = "useSecureCookies"},
        @{Pattern = "sameSite:\s*'lax'"; Name = "sameSite: 'lax'"},
        @{Pattern = "secure:.*production"; Name = "secure conditionnel"},
        @{Pattern = "\.jaayndouguou\.app"; Name = "domain: .jaayndouguou.app"}
    )
    
    foreach ($check in $checks) {
        if ($authContent -match $check.Pattern) {
            Write-Host "   ✅ $($check.Name) configuré" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $($check.Name) manquant" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ⚠️  Fichier auth.ts non trouvé" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60

# Résumé
Write-Host ""
Write-Host "📋 RÉSUMÉ ET PROCHAINES ÉTAPES" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si tous les tests sont ✅ :"
Write-Host "1. Déployez sur Vercel : git push origin main"
Write-Host "2. Configurez NEXTAUTH_URL sur Vercel Dashboard"
Write-Host "3. Testez sur mobile après avoir vidé le cache"
Write-Host ""
Write-Host "Si des tests sont ❌ :"
Write-Host "1. Consultez FIX_MOBILE_AUTH.md pour les corrections"
Write-Host "2. Exécutez : node scripts/verify-auth-config.js"
Write-Host "3. Corrigez les erreurs avant de déployer"
Write-Host ""

# Proposer d'ouvrir le guide
Write-Host "📖 Ouvrir le guide de déploiement ? (O/N)" -ForegroundColor Yellow -NoNewline
$response = Read-Host " "
if ($response -eq "O" -or $response -eq "o") {
    $guideFile = Join-Path $PSScriptRoot "..\DEPLOY_AUTH_FIX.md"
    if (Test-Path $guideFile) {
        Start-Process $guideFile
    }
}

Write-Host ""
Write-Host "✅ Test terminé" -ForegroundColor Green

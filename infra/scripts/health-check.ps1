# ==============================================================================
# L's - Auth Health Check Script
# Verifies health of PostgreSQL, Keycloak, Management API, Web Portal, & Demos
# ==============================================================================

Write-Host "`n>>> Checking L's - Auth Platform Components Health..." -ForegroundColor Cyan

function Test-PortAvailability ($hostName, $port, $name) {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect($hostName, $port, $null, $null)
        $wait = $iar.AsyncWaitHandle.WaitOne(1500, $false)
        if ($wait) {
            $tcp.EndConnect($iar)
            $tcp.Close()
            Write-Host "  [UP]   $name (Port $port is listening)" -ForegroundColor Green
            return $true
        } else {
            $tcp.Close()
            Write-Host "  [DOWN] $name (Port $port is not reachable)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  [DOWN] $name (Port $port is not reachable)" -ForegroundColor Red
        return $false
    }
}

Test-PortAvailability "localhost" 5432 "PostgreSQL Database Engine"
Test-PortAvailability "localhost" 8080 "Keycloak Protocol Engine"
Test-PortAvailability "localhost" 3001 "L's - Auth NestJS Management API"
Test-PortAvailability "localhost" 3000 "L's - Auth Next.js Web Admin Portal"
Test-PortAvailability "localhost" 4001 "Demo Application A (Liji Table)"
Test-PortAvailability "localhost" 4002 "Demo Application B (Alpha Cars)"

Write-Host "`n>>> Checking HTTP Endpoints..." -ForegroundColor Cyan

# 1. API Health Endpoint
try {
    $apiHealth = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [OK] NestJS API /api/v1/health responded: status=$($apiHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] NestJS API /api/v1/health could not be reached." -ForegroundColor Yellow
}

# 2. Keycloak OpenID Configuration Endpoint
try {
    $kcDiscovery = Invoke-RestMethod -Uri "http://localhost:8080/realms/liji-identity/.well-known/openid-configuration" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [OK] Keycloak OIDC Discovery responded: issuer=$($kcDiscovery.issuer)" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] Keycloak OIDC Discovery could not be reached on /realms/liji-identity." -ForegroundColor Yellow
}

Write-Host "`nHealth check finished.`n"


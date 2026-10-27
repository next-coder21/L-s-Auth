# ==============================================================================
# L's - Auth Development Server Stopper
# Stops local Node/pnpm and Keycloak Java development processes
# ==============================================================================

Write-Host "`n>>> Stopping L's - Auth Development Services..." -ForegroundColor Cyan

# Stop Keycloak Java Process (listening on 8080)
$kcProcess = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($kcProcess) {
    Write-Host "  Stopping Keycloak (PID: $kcProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $kcProcess -Force -ErrorAction SilentlyContinue
}

# Stop Port 3000 (Web Portal)
$webProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($webProcess) {
    Write-Host "  Stopping Web Portal (PID: $webProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $webProcess -Force -ErrorAction SilentlyContinue
}

# Stop Port 3001 (API)
$apiProcess = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($apiProcess) {
    Write-Host "  Stopping API (PID: $apiProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $apiProcess -Force -ErrorAction SilentlyContinue
}

# Stop Port 4001 (Demo App A)
$demoAProcess = Get-NetTCPConnection -LocalPort 4001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($demoAProcess) {
    Write-Host "  Stopping Demo App A (PID: $demoAProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $demoAProcess -Force -ErrorAction SilentlyContinue
}

# Stop Port 4002 (Demo App B)
$demoBProcess = Get-NetTCPConnection -LocalPort 4002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($demoBProcess) {
    Write-Host "  Stopping Demo App B (PID: $demoBProcess)..." -ForegroundColor Yellow
    Stop-Process -Id $demoBProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "  [OK] Development services stopped." -ForegroundColor Green

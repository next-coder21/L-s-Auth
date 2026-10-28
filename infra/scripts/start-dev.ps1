# ==============================================================================
# L's - Auth Development Server Starter
# Starts Keycloak, NestJS API, Next.js Web Portal, and Demo Apps
# ==============================================================================

$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root

Write-Host "`n>>> Starting L's - Auth Development Stack..." -ForegroundColor Cyan

# 1. Start Keycloak if not already running
$kcPortOpen = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect("localhost", 8080, $null, $null)
    if ($iar.AsyncWaitHandle.WaitOne(1000, $false)) {
        $tcp.EndConnect($iar)
        $tcp.Close()
        $kcPortOpen = $true
    }
} catch {}

if (-not $kcPortOpen) {
    Write-Host "  Starting Keycloak on port 8080..." -ForegroundColor Yellow
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    $kcBat = "$root\infra\keycloak\keycloak-26.1.3\bin\kc.bat"
    if (Test-Path $kcBat) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; `$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'; & '$kcBat' start-dev --db=postgres --db-url-host=localhost --db-url-port=5432 --db-url-database=liji_keycloak --db-username=postgres --db-password=Admin --http-port=8080 --import-realm" -WindowStyle Normal
    } else {
        Write-Warning "Keycloak binary not found at $kcBat. Run .\infra\scripts\setup.ps1 first."
    }
} else {
    Write-Host "  [OK] Keycloak is already running on port 8080." -ForegroundColor Green
}

# 2. Start NestJS Management API
Write-Host "  Starting NestJS Management API on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; pnpm dev:api" -WindowStyle Normal

# 3. Start Next.js Web Admin Portal
Write-Host "  Starting Next.js Web Admin Portal on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; pnpm dev:web" -WindowStyle Normal

# 4. Start Demo App A
Write-Host "  Starting Demo App A (Liji Table) on port 4001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; pnpm dev:demo-a" -WindowStyle Normal

# 5. Start Demo App B
Write-Host "  Starting Demo App B (Alpha Cars) on port 4002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; pnpm dev:demo-b" -WindowStyle Normal

Write-Host "`nAll processes launched in separate terminal windows." -ForegroundColor Green
Write-Host "Execute '.\infra\scripts\health-check.ps1' to verify once all services finish booting up." -ForegroundColor Cyan


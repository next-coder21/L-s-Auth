# ==============================================================================
# L's - Auth Docker Stack Starter
# Starts PostgreSQL, Keycloak, Management API, Web Portal, & Demo Apps in Docker
# ==============================================================================

$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root

Write-Host "`n>>> Starting L's - Auth Docker Stack..." -ForegroundColor Cyan
docker compose up -d

Write-Host "`nWaiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

& "$PSScriptRoot\health-check.ps1"


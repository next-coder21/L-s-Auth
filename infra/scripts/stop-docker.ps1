# ==============================================================================
# L's - Auth Docker Stack Stopper
# Stops all L's - Auth Docker containers
# ==============================================================================

$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root

Write-Host "`n>>> Stopping L's - Auth Docker Stack..." -ForegroundColor Cyan
docker compose down
Write-Host "  [OK] All L's - Auth services stopped." -ForegroundColor Green


# ==============================================================================
# L's - Auth Windows Local Development Setup Script
# Liji Groups - Commercial Identity Provider & Enterprise SSO Platform
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "`n>>> [1/6] Verifying Windows Environment Prerequisites..." -ForegroundColor Cyan

# 1. Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "  [OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "Node.js is not installed or not in PATH."
}

# 2. Check pnpm
try {
    $pnpmVersion = pnpm -v
    Write-Host "  [OK] pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Error "pnpm is not installed. Run 'npm install -g pnpm'."
}

# 3. Check Java 21
$javaHome = "C:\Program Files\Java\jdk-21"
if (Test-Path "$javaHome\bin\java.exe") {
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
    Write-Host "  [OK] Java 21 detected at $javaHome" -ForegroundColor Green
} else {
    try {
        $javaVer = java -version 2>&1 | Select-Object -First 1
        Write-Host "  [WARN] Default java: $javaVer. Java 21 is strongly recommended." -ForegroundColor Yellow
    } catch {
        Write-Error "Java is required for Keycloak. Please install JDK 21."
    }
}

# 4. Check PostgreSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    $psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
}
if (-not (Test-Path $psqlPath)) {
    Write-Error "psql not found in standard PostgreSQL directories."
}
Write-Host "  [OK] PostgreSQL client found at $psqlPath" -ForegroundColor Green

Write-Host "`n>>> [2/6] Ensuring PostgreSQL Databases Exist..." -ForegroundColor Cyan
$env:PGPASSWORD = "Admin"
& $psqlPath -U postgres -p 5432 -f "$PSScriptRoot\..\postgres\init-databases.sql"
Write-Host "  [OK] Databases 'liji_identity' and 'liji_keycloak' verified." -ForegroundColor Green

Write-Host "`n>>> [3/6] Setting Up Keycloak Engine..." -ForegroundColor Cyan
$keycloakDir = "$PSScriptRoot\..\keycloak"
$kcVersion = "26.1.3"
$kcTargetDir = "$keycloakDir\keycloak-$kcVersion"
$zipFile = "$keycloakDir\keycloak-$kcVersion.zip"

if (-not (Test-Path "$kcTargetDir\bin\kc.bat")) {
    if (-not (Test-Path $zipFile)) {
        Write-Host "  Downloading Keycloak $kcVersion..." -ForegroundColor Yellow
        $url = "https://github.com/keycloak/keycloak/releases/download/$kcVersion/keycloak-$kcVersion.zip"
        curl.exe -L -o $zipFile $url
    }
    Write-Host "  Extracting Keycloak $kcVersion..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $keycloakDir -Force
    Remove-Item $zipFile -Force
    Write-Host "  [OK] Keycloak extracted to $kcTargetDir" -ForegroundColor Green
} else {
    Write-Host "  [OK] Keycloak $kcVersion already present." -ForegroundColor Green
}

# Ensure realm import directory exists in Keycloak
$kcImportDir = "$kcTargetDir\data\import"
if (-not (Test-Path $kcImportDir)) {
    New-Item -ItemType Directory -Path $kcImportDir -Force | Out-Null
}
Copy-Item "$PSScriptRoot\..\keycloak\realm-import\liji-identity-realm.json" "$kcImportDir\liji-identity-realm.json" -Force
Write-Host "  [OK] Realm import file copied to Keycloak data/import." -ForegroundColor Green

Write-Host "`n>>> [4/6] Installing pnpm Monorepo Dependencies..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\.."
pnpm install

Write-Host "`n>>> [5/6] Generating Prisma Client..." -ForegroundColor Cyan
pnpm db:generate

Write-Host "`n>>> [6/6] Applying Prisma Migrations & Seed Data..." -ForegroundColor Cyan
pnpm db:migrate --name init
pnpm db:seed

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host "  L's - Auth Environment Setup Completed Successfully!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "Run '.\infra\scripts\start-dev.ps1' to start the identity platform services." -ForegroundColor Cyan

# ==============================================================================
# L's - Auth Windows Local Development Setup Script (No Docker)
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
    Write-Host "  pnpm not found. Installing pnpm globally via npm..." -ForegroundColor Yellow
    npm install -g pnpm@11.18.0
}

# 3. Check Java 21
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if ($javaCmd) {
    $javaBin = Split-Path $javaCmd.Source
    $javaHome = Split-Path $javaBin
    $env:JAVA_HOME = $javaHome
    Write-Host "  [OK] Java detected at $javaHome" -ForegroundColor Green
} else {
    $jdkDirs = Get-ChildItem "C:\Program Files\Java\jdk*", "C:\Program Files\Eclipse Adoptium\jdk*" -ErrorAction SilentlyContinue
    if ($jdkDirs) {
        $env:JAVA_HOME = $jdkDirs[0].FullName
        $env:PATH = "$($jdkDirs[0].FullName)\bin;$env:PATH"
        Write-Host "  [OK] Java detected at $($jdkDirs[0].FullName)" -ForegroundColor Green
    } else {
        Write-Error "Java 21 is required for Keycloak. Please install JDK 21 (Eclipse Temurin or Oracle)."
    }
}

# 4. Check PostgreSQL
$psqlPath = $null
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
    $psqlPath = $psqlCmd.Source
} else {
    $candidates = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending
    if ($candidates) {
        $psqlPath = $candidates[0].FullName
    }
}

if (-not $psqlPath -or -not (Test-Path $psqlPath)) {
    Write-Error "PostgreSQL client (psql.exe) not found. Please install PostgreSQL 15, 16, or 17."
}
Write-Host "  [OK] PostgreSQL client found at $psqlPath" -ForegroundColor Green

Write-Host "`n>>> [2/6] Ensuring PostgreSQL Databases Exist..." -ForegroundColor Cyan
if (-not $env:PGPASSWORD) {
    if (Test-Path "$PSScriptRoot\..\..\.env") {
        $pgPassLine = Get-Content "$PSScriptRoot\..\..\.env" | Where-Object { $_ -match "^KEYCLOAK_DB_PASSWORD=" }
        if ($pgPassLine) {
            $env:PGPASSWORD = $pgPassLine.Split('=')[1].Trim('"').Trim("'")
        }
    }
}
if (-not $env:PGPASSWORD) {
    $env:PGPASSWORD = "Admin"
}

try {
    & $psqlPath -U postgres -p 5432 -f "$PSScriptRoot\..\postgres\init-databases.sql"
    Write-Host "  [OK] Databases 'liji_identity' and 'liji_keycloak' verified." -ForegroundColor Green
} catch {
    Write-Warning "Could not connect to PostgreSQL with default password. If using a custom password, set `$env:PGPASSWORD='your_password' before running setup.ps1."
}

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

# Ensure custom theme directory is deployed to Keycloak
if (Test-Path "$PSScriptRoot\..\keycloak\themes\ls-auth") {
    Copy-Item "$PSScriptRoot\..\keycloak\themes\ls-auth" "$kcTargetDir\themes\ls-auth" -Recurse -Force
    Write-Host "  [OK] L's Auth theme deployed to Keycloak themes directory." -ForegroundColor Green
}

Write-Host "`n>>> [4/6] Installing Monorepo Dependencies..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\.."
pnpm install

Write-Host "`n>>> [5/6] Generating Prisma Client..." -ForegroundColor Cyan
pnpm db:generate

Write-Host "`n>>> [6/6] Applying Prisma Migrations & Seed Data..." -ForegroundColor Cyan
pnpm --filter @ls-auth/database run deploy
pnpm --filter @ls-auth/database run seed

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host "  L's - Auth Non-Docker Environment Setup Completed Successfully!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "Run '.\infra\scripts\start-dev.ps1' to start the local services natively." -ForegroundColor Cyan

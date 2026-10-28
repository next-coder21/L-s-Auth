# L's - Auth: Windows Local Development Guide (No Docker)

## 1. Prerequisites

- **Operating System:** Windows 10/11 with PowerShell 7 or Windows PowerShell
- **Node.js:** LTS (v20+ or v26+)
- **Package Manager:** `pnpm` (v11+)
- **Java Runtime:** JDK 21 LTS (`C:\Program Files\Java\jdk-21`)
- **PostgreSQL:** Local PostgreSQL server running on port 5432 (PostgreSQL 17+)

---

## 2. Automated Setup

Run the automated PowerShell setup script from the repository root:

```powershell
.\infra\scripts\setup.ps1
```

This script will automatically:
1. Verify Node.js, pnpm, Java 21, and PostgreSQL paths.
2. Initialize both PostgreSQL databases (`liji_identity` and `liji_keycloak`).
3. Download and extract Keycloak 26.1.3 into `infra/keycloak/` if not present.
4. Copy the development realm import configuration.
5. Install pnpm workspaces dependencies.
6. Generate Prisma client, apply database migrations, and seed initial tenant data.

---

## 3. Starting the Platform

To start all services in separate PowerShell windows:

```powershell
.\infra\scripts\start-dev.ps1
```

Or start each service individually in separate terminals:

### 1. Keycloak Identity Engine (Port 8080)
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\infra\keycloak\keycloak-26.1.3\bin\kc.bat start-dev `
  --db=postgres `
  --db-url-host=localhost `
  --db-url-port=5432 `
  --db-url-database=liji_keycloak `
  --db-username=postgres `
  --db-password=Admin `
  --http-port=8080 `
  --import-realm
```

### 2. NestJS Management API (Port 3001)
```powershell
pnpm dev:api
```

### 3. Next.js Web Admin Portal (Port 3000)
```powershell
pnpm dev:web
```

### 4. Demo Application A - Liji Table (Port 4001)
```powershell
pnpm dev:demo-a
```

### 5. Demo Application B - Alpha Cars (Port 4002)
```powershell
pnpm dev:demo-b
```

---

## 4. Health Verification

To verify that all services are operational:

```powershell
.\infra\scripts\health-check.ps1
```

To stop all background development servers:

```powershell
.\infra\scripts\stop-dev.ps1
```


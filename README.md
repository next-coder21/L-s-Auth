# L's - Auth
> **"One Identity. Every Application."**  
> Commercial Identity Provider & Enterprise Single Sign-On Platform by **Liji Groups**

---

## Overview

**L's - Auth** is a commercial-grade Identity Provider (IdP) and Single Sign-On (SSO) platform designed to provide centralized authentication and access management across Liji Groups' internal ecosystem (e.g., Liji Table, Alpha Cars, Muves) as well as external enterprise subscribers.

---

## Architectural Highlights

- **Three-Tier Architecture:**
  - **Product Experience (Layer A):** Next.js App Router administration portal with custom L's - Auth dark navy/blue visual design.
  - **Management API (Layer B):** Modular NestJS REST API with strict tenant isolation guards, role-based access, and audit trails.
  - **Identity Engine (Layer C):** Keycloak 26 protocol engine executing OIDC, OAuth 2.0 PKCE, token signing, and SAML federation.
- **Database Segregation:**
  - `liji_identity`: PostgreSQL database storing tenant organizations, memberships, apps, audit records, and subscriptions via Prisma ORM.
  - `liji_keycloak`: Dedicated PostgreSQL database storing internal identity engine state.
- **Dual Run Modes:** Runs with **Docker Compose** or **Natively (No Docker)** on Windows.

---

## Quick Start

### Mode A: Run in Docker (Recommended for any machine with Docker)

Starts PostgreSQL, Keycloak 26, NestJS API, Next.js Web Admin, and both Demo SSO applications in containers.

```powershell
# Start all containers in background
.\infra\scripts\start-docker.ps1
# Or directly: docker compose up -d

# Verify health
.\infra\scripts\health-check.ps1

# Stop containers
.\infra\scripts\stop-docker.ps1
# Or directly: docker compose down
```

---

### Mode B: Run Without Docker (Native Windows)

Prerequisites: Local PostgreSQL (port 5432), Java 21, and Node.js.

```powershell
# 1. Automated Setup (one-time setup: creates databases, downloads Keycloak, runs migrations & seed)
.\infra\scripts\setup.ps1

# 2. Start Services (opens processes in separate terminal windows)
.\infra\scripts\start-dev.ps1

# 3. Verify Health
.\infra\scripts\health-check.ps1
```

---

## Service Endpoints (Both Modes)

| Component | URL | Description |
|-----------|-----|-------------|
| **Next.js Web Admin Portal** | `http://localhost:3000` | Organization & Application Management |
| **NestJS Management API** | `http://localhost:3001/api/v1` | Product REST API |
| **API Swagger Documentation** | `http://localhost:3001/api/v1/docs` | Interactive OpenAPI Docs |
| **Keycloak Identity Engine** | `http://localhost:8080` | OIDC & SAML Protocol Engine |
| **Demo App A (Liji Table)** | `http://localhost:4001` | First OIDC SSO Application |
| **Demo App B (Alpha Cars)** | `http://localhost:4002` | Second OIDC SSO Application |

### Default Credentials
- **Admin:** `admin` / `Admin@123`
- **Developer:** `developer` / `Dev@123`

---

## Documentation

- [System Architecture](docs/architecture.md)
- [Database Schema & Models](docs/database-schema.md)
- [Security Specification & Threat Model](docs/security.md)
- [Local Development Guide](docs/local-development.md)
- [OIDC & SSO Integration Guide](docs/oidc-integration.md)
- [SAML 2.0 Federation Guide](docs/saml-integration.md)
- [Hybrid Multi-Tenant Model](docs/tenant-model.md)
- [Production Deployment Guide](docs/production-deployment.md)
- [Implementation Status Log](docs/implementation-status.md)

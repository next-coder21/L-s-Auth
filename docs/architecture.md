# L's - Auth: System Architecture
**Parent Organization:** Liji Groups  
**Product Positioning:** "One Identity. Every Application."

---

## 1. High-Level Architectural Overview

L's - Auth is structured into three discrete, decoupled layers to maintain strict separation of concerns, enterprise security posture, and long-term modularity:

```mermaid
flowchart TD
    subgraph Layer_A ["Layer A: Product Experience"]
        WebPortal["Next.js Web Portal (Port 3000)"]
        DemoAppA["Demo App A: Liji Table (Port 4001)"]
        DemoAppB["Demo App B: Alpha Cars (Port 4002)"]
    end

    subgraph Layer_B ["Layer B: Product Management API"]
        NestAPI["NestJS Management API (Port 3001)"]
        TenantGuard["Tenant Isolation Guard"]
        AuditService["Audit Logger"]
        PrismaORM["Prisma Client"]
    end

    subgraph Layer_C ["Layer C: Identity Protocol Engine"]
        Keycloak["Keycloak Server (Port 8080)"]
        RealmDev["liji-identity Realm"]
        JWKSEndpoint["JWKS Endpoint"]
        TokenEndpoint["OIDC / Token Endpoint"]
    end

    subgraph Data_Storage ["Segregated Database Layer (PostgreSQL)"]
        DB_Identity[("liji_identity (Product Metadata)")]
        DB_Keycloak[("liji_keycloak (Protocol Engine Data)")]
    end

    WebPortal -->|REST / Bearer JWT| NestAPI
    NestAPI --> TenantGuard
    TenantGuard --> PrismaORM
    PrismaORM --> DB_Identity
    NestAPI -->|Admin REST API| Keycloak

    DemoAppA -->|OIDC PKCE Auth Code| Keycloak
    DemoAppB -->|OIDC PKCE Auth Code| Keycloak
    Keycloak --> DB_Keycloak
```

---

## 2. Layer Responsibilities

### Layer A — Product Experience (Next.js App Router)
- **Administration Portal:** Organization management, user memberships, application registries, audit logging, and subscription views.
- **Brand Identity:** Dark navy and slate background palette (`#0F172A`, `#1E293B`) with restrained blue accent (`#2563EB`) and typographic wordmark for L's - Auth.
- **Consumer Applications:** Demonstrated through two production-pattern applications:
  - **Demo App A (Liji Table):** Port 4001
  - **Demo App B (Alpha Cars):** Port 4002

### Layer B — Product Management API (NestJS)
- **Tenant Scope Enforcement:** Every endpoint under `/api/v1/organizations/:organizationId/*` strictly requires authenticated active membership in the target organization.
- **Protocol Provisioning:** Keycloak client and realm provisioning executed through controlled administrative APIs.
- **Audit Trails:** Immutable recording of tenant actions, security policy modifications, and membership invitations.
- **Database Segregation:** Prisma connects solely to `liji_identity`. Keycloak internal tables are never directly accessed or queried.

### Layer C — Identity Protocol Engine (Keycloak)
- Centralized token issuance, signing, PKCE validation, session cookie lifecycle, and JWKS exposure.
- Connected exclusively to `liji_keycloak` PostgreSQL database.


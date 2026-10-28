# L's - Auth: Database Schema & Storage Architecture

## 1. Segregation Model

To ensure security boundaries and protocol integrity:
- **`liji_identity`**: Managed solely via Prisma ORM for organizations, memberships, apps, audit records, and subscriptions.
- **`liji_keycloak`**: Managed solely by Keycloak's internal migration and persistence layer. The management API never reads or writes to this database directly.

---

## 2. Relational Entity Relationship Diagram

```mermaid
erDiagram
    ORGANIZATION ||--o{ MEMBERSHIP : has
    ORGANIZATION ||--o{ APPLICATION : owns
    ORGANIZATION ||--o| SUBSCRIPTION : holds
    ORGANIZATION ||--o| IDENTITY_REALM : maps
    ORGANIZATION ||--o{ AUDIT_LOG : tracks
    ORGANIZATION ||--o{ PROVISIONING_JOB : queues

    USER ||--o{ MEMBERSHIP : belongs_to
    USER ||--o{ IDENTITY : federates

    APPLICATION ||--o| OIDC_CLIENT : configures
    APPLICATION ||--o| SAML_SERVICE_PROVIDER : configures

    ORGANIZATION {
        string id PK
        string name
        string slug UK
        string status
        string tenancyMode
        json brandingConfig
        datetime createdAt
        datetime updatedAt
    }

    USER {
        string id PK
        string displayName
        string email UK
        string accountStatus
        datetime createdAt
        datetime updatedAt
    }

    IDENTITY {
        string id PK
        string userId FK
        string issuer
        string subject
        datetime createdAt
    }

    MEMBERSHIP {
        string id PK
        string organizationId FK
        string userId FK
        string role
        string status
        datetime invitedAt
        datetime acceptedAt
    }

    APPLICATION {
        string id PK
        string organizationId FK
        string name
        string protocolType
        string applicationStatus
        datetime createdAt
    }

    OIDC_CLIENT {
        string id PK
        string applicationId FK
        string clientId UK
        string clientType
        string_array permittedRedirectUris
        string_array postLogoutRedirectUris
    }
```

---

## 3. Data Protection Rules
- **No Plaintext Passwords or Secrets:** Product database holds client ID references and metadata. Client secrets, private keys, and user password hashes remain exclusively inside Keycloak.
- **Unique Constraints:** `(issuer, subject)` in `identities`, `(organizationId, userId)` in `memberships`, and `slug` in `organizations`.


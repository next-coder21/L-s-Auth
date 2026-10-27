# L's - Auth: Hybrid Multi-Tenancy Architecture

## 1. Tenancy Modes

L's - Auth supports two distinct tenancy models to serve both high-scale commercial organizations and high-assurance enterprise customers:

### A. Shared Realm Multi-Tenancy (Standard Customers)
- Organizations reside within the central identity realm (`liji-identity`).
- Scoped by `organizationId`, membership records, and role-based permissions in the product management API.
- Low operational cost, instant provisioning, shared infrastructure.

### B. Isolated Realm Multi-Tenancy (Enterprise Customers)
- High-assurance enterprise organizations receive a dedicated Keycloak realm.
- Dedicated identity federation policies, custom SAML/OIDC identity providers, isolated user stores, and enterprise audit boundaries.
- Managed exclusively by platform administrators.

---

## 2. Membership vs. Identity Separation

- **Users** exist independently of organizations.
- **Identities** link users to identity provider subjects `(issuer, subject)`. Accounts are never merged purely based on matching email addresses.
- **Memberships** establish explicit authorization, tenant scoping, and roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
- Cross-tenant data leakage is strictly prohibited by `TenantGuard`.

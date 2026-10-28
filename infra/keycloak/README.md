# L's - Auth Identity Engine (Keycloak)

Keycloak serves as the core cryptographic and protocol engine for **L's - Auth** by Liji Groups.

## Architecture

- **Protocol Execution**: Handles OIDC, OAuth 2.0 PKCE, and SAML 2.0 assertions.
- **Database Isolation**: Connected exclusively to the `liji_keycloak` PostgreSQL database. It never touches or modifies the `liji_identity` product management database.
- **Realm Import**: Development realm configuration is version-controlled at `infra/keycloak/realm-import/liji-identity-realm.json`.

## Local Windows Run Command

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

## Default Development Accounts

- **Admin Account**: `admin` / `Admin@123` (Roles: `realm-admin`, `org-admin`, `app-user`)
- **Developer Account**: `developer` / `Dev@123` (Roles: `app-user`)


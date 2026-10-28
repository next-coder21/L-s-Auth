# L's - Auth: Security Specification & Threat Model

## 1. Identity & Protocol Security

- **PKCE Enforcement:** All OpenID Connect Authorization Code flows mandate S256 (`code_challenge_method=S256`). Plaintext code challenges are rejected.
- **JWKS Key Verification:** Tokens issued by Keycloak are cryptographically verified using remote JWKS sets via `jose`. Token signature, issuer (`iss`), audience (`aud`), and expiration (`exp`) are strictly validated.
- **No Token Confusion:** ID tokens are never treated as API access tokens. API endpoints require valid Bearer access tokens with matching resource claims.

---

## 2. Multi-Tenant Authorization Guard

```typescript
// Enforced in NestJS via TenantGuard
if (!user.isPlatformAdmin) {
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: user.id,
      status: 'ACTIVE',
    },
  });
  if (!membership) {
    throw new ForbiddenException('Cross-tenant access prohibited');
  }
}
```

- Platform administrators holding `realm-admin` are distinguished from organization administrators.
- Requests without a valid Bearer token are rejected with HTTP 401.
- Requests attempting to read or manipulate another organization's applications, members, or audit logs are rejected with HTTP 403.

---

## 3. Session & Secret Management

- **Server-Side Sessions:** Demo applications and management portals store sessions server-side with `httpOnly`, `sameSite: 'lax'`, and signed cookies.
- **Client Secrets Protection:** Confidential client secrets are never exposed to browser JavaScript or checked into source code.
- **Audit Logging:** Every administrative action is logged with timestamp, actor reference, resource ID, and outcome.


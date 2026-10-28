# L's - Auth: SAML 2.0 Integration & Federation Guide

## 1. SAML vs OIDC Architecture

L's - Auth treats OpenID Connect and SAML 2.0 as distinct protocols with dedicated configuration models:
- **OIDC:** JSON/REST-oriented, using JWTs, PKCE, and JWKS public keys.
- **SAML 2.0:** XML-based enterprise federation using signed assertions, Entity IDs, Assertion Consumer Service (ACS) URLs, and X.509 certificates.

Keycloak executes SAML protocol operations, assertions signing, XML decryption, and NameID formatting. L's - Auth management API manages the service provider registration and metadata exchange.

---

## 2. SAML Service Provider Schema Model

Defined in `packages/database/prisma/schema.prisma`:
- `entityId`: Globally unique URI identifying the SP
- `assertionConsumerServiceUrl`: Destination endpoint for HTTP-POST assertions
- `nameIdFormat`: Supported NameID formats (e.g. `emailAddress`, `persistent`)
- `signAssertions`: Strict cryptographic signature verification
- `encryptAssertions`: Assertion encryption using SP public key certificates

---

## 3. Security Considerations
- Defend against XML Signature Wrapping (XSW) attacks through strict Keycloak schema validation.
- Enforce Assertion validity windows and timestamp freshness to prevent replay attacks.


# L's - Auth: OpenID Connect & SSO Integration Guide

## 1. SSO Verification Workflow

This document explains the Single Sign-On (SSO) test scenario between **Demo App A (Liji Table)** and **Demo App B (Alpha Cars)**:

```mermaid
sequenceDiagram
    autonumber
    actor User as End User
    participant AppA as Demo App A (Liji Table :4001)
    participant KC as L's - Auth Identity Engine (:8080)
    participant AppB as Demo App B (Alpha Cars :4002)

    User->>AppA: Click "Sign In with L's - Auth"
    AppA->>AppA: Generate state & PKCE code_challenge (S256)
    AppA->>KC: Redirect to /protocol/openid-connect/auth
    KC->>User: Display L's - Auth Login Form
    User->>KC: Submit credentials (admin / Admin@123)
    KC->>KC: Validate credentials & create central SSO session cookie
    KC->>AppA: Redirect to /callback?code=AUTH_CODE&state=STATE
    AppA->>KC: POST /token with code_verifier & client_secret
    KC->>AppA: Return ID Token & Access Token
    AppA->>AppA: Verify ID Token signature via JWKS
    AppA->>User: Display Authenticated Profile & SSO banner

    Note over User,AppB: Phase 2: Central SSO Verification
    User->>AppB: Click "Open Demo App B (Alpha Cars)"
    AppB->>AppB: Generate state & PKCE challenge
    AppB->>KC: Redirect to /protocol/openid-connect/auth
    Note over KC: Keycloak detects existing central SSO session cookie!
    KC-->>AppB: Automatically redirects to /callback with AUTH_CODE (No login prompt!)
    AppB->>KC: POST /token with code_verifier & client_secret
    KC->>AppB: Return Tokens
    AppB->>User: Display Alpha Cars Dashboard: Seamlessly Authenticated via SSO!
```

---

## 2. Security Notes
- Existing central identity sessions authenticate identity, but application-specific authorization rules and organization scopes are still evaluated independently by each application.
- Public clients must use PKCE with confidential client secrets omitted.
- Tokens must always be verified against Keycloak's JWKS endpoint.

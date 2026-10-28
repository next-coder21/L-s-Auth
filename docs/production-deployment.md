# L's - Auth: Production Deployment & Operational Readiness

## 1. Production Architecture Recommendations

For production commercial deployment:
1. **Container Orchestration:** Deploy NestJS API and Next.js Web as stateless containers behind an HTTPS load balancer with TLS termination.
2. **Keycloak Cluster:** Deploy Keycloak in high-availability mode backed by AWS Aurora PostgreSQL or managed Cloud SQL.
3. **Database Segregation:** Separate physical or logical databases for `liji_identity` and `liji_keycloak`.
4. **Secret Management:** Secrets such as database credentials, SMTP passwords, and Keycloak admin credentials must be injected via AWS Secrets Manager or HashiCorp Vault.

---

## 2. Threat Modeling & Hardening Checklist
- [ ] Enforce strict HTTPS and HSTS headers.
- [ ] Mandate MFA for all organization administrators.
- [ ] Implement Redis-backed distributed rate limiting on `/login` and `/token` endpoints.
- [ ] Regular automated backups of PostgreSQL databases with point-in-time recovery testing.
- [ ] Enable Keycloak brute-force protection in production realms.


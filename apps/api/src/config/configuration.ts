export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:4001,http://localhost:4002').split(','),
  database: {
    url: process.env.DATABASE_URL,
  },
  keycloak: {
    url: process.env.KEYCLOAK_INTERNAL_URL || process.env.KEYCLOAK_URL || 'http://localhost:8080',
    issuerUrl: process.env.KEYCLOAK_ISSUER_URL || process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_DEV_REALM || 'liji-identity',
    adminUsername: process.env.KEYCLOAK_ADMIN || 'admin',
    adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || 'Admin@123',
    adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'dev-session-secret-at-least-32-chars-long',
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-at-least-32-chars-long',
  },
});

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export interface TokenValidationOptions {
  keycloakUrl: string;
  realm: string;
  clientId?: string;
  expectedIssuer?: string;
}

export interface ValidatedClaims extends JWTPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export function getJwksForRealm(keycloakUrl: string, realm: string) {
  const url = `${keycloakUrl.replace(/\/+$/, '')}/realms/${realm}/protocol/openid-connect/certs`;
  if (!jwksCache.has(url)) {
    jwksCache.set(url, createRemoteJWKSet(new URL(url)));
  }
  return jwksCache.get(url)!;
}

export async function verifyToken(
  token: string,
  options: TokenValidationOptions,
): Promise<ValidatedClaims> {
  const normalizedUrl = options.keycloakUrl.replace(/\/+$/, '');
  const issuer = options.expectedIssuer || `${normalizedUrl}/realms/${options.realm}`;
  const JWKS = getJwksForRealm(options.keycloakUrl, options.realm);

  const { payload } = await jwtVerify(token, JWKS, {
    issuer,
    audience: options.clientId ? options.clientId : undefined,
  });

  return payload as ValidatedClaims;
}

export function extractRoles(payload: ValidatedClaims, clientId?: string): string[] {
  const roles: string[] = [];
  if (payload.realm_access?.roles) {
    roles.push(...payload.realm_access.roles);
  }
  if (clientId && payload.resource_access?.[clientId]?.roles) {
    roles.push(...payload.resource_access[clientId].roles);
  }
  return Array.from(new Set(roles));
}


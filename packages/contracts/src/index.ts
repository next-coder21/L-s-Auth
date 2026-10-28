// Enums
export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum TenancyMode {
  SHARED = 'SHARED',
  ISOLATED = 'ISOLATED',
}

export enum MembershipRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
}

export enum ApplicationProtocol {
  OIDC = 'OIDC',
  SAML = 'SAML',
}

export enum ApplicationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export enum OidcClientType {
  CONFIDENTIAL = 'CONFIDENTIAL',
  PUBLIC = 'PUBLIC',
}

export enum SamlNameIdFormat {
  EMAIL = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  PERSISTENT = 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
  TRANSIENT = 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  UNSPECIFIED = 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
}

export enum ProvisioningStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

export enum AuditOutcome {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  DENIED = 'DENIED',
}

// User & Auth Context
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isPlatformAdmin?: boolean;
}

// Organizations
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  tenancyMode?: TenancyMode;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface UpdateOrganizationDto {
  name?: string;
  status?: OrganizationStatus;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface OrganizationResponseDto {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  tenancyMode: TenancyMode;
  brandingConfig?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// Memberships
export interface InviteMemberDto {
  email: string;
  role: MembershipRole;
}

export interface UpdateMemberRoleDto {
  role: MembershipRole;
  status?: MembershipStatus;
}

export interface MemberResponseDto {
  id: string;
  organizationId: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  invitedAt?: string | null;
  acceptedAt?: string | null;
  user: {
    id: string;
    displayName: string;
    email: string;
  };
}

// Applications
export interface RegisterApplicationDto {
  name: string;
  description?: string;
  protocol: ApplicationProtocol;
  // OIDC Specific
  oidcConfig?: {
    clientType: OidcClientType;
    redirectUris: string[];
    postLogoutRedirectUris?: string[];
    scopes?: string[];
  };
  // SAML Specific
  samlConfig?: {
    entityId: string;
    acsUrl: string;
    nameIdFormat?: SamlNameIdFormat;
    signingCertificate?: string;
    signAssertions?: boolean;
    encryptAssertions?: boolean;
  };
}

export interface ApplicationResponseDto {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  protocol: ApplicationProtocol;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  oidcClient?: {
    clientId: string;
    clientType: OidcClientType;
    redirectUris: string[];
    postLogoutRedirectUris: string[];
    scopes: string[];
  } | null;
  samlServiceProvider?: {
    entityId: string;
    acsUrl: string;
    nameIdFormat: string;
    signAssertions: boolean;
    encryptAssertions: boolean;
  } | null;
}

// Audit Logs
export interface AuditLogResponseDto {
  id: string;
  organizationId?: string | null;
  actorId: string;
  actorEmail?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: AuditOutcome;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  timestamp: string;
}

// Health Response
export interface HealthStatusResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
    };
    keycloak: {
      status: 'up' | 'down';
      url: string;
      latencyMs?: number;
    };
  };
  version: string;
}


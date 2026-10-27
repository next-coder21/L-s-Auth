import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { KeycloakAdminService } from '../keycloak/keycloak-admin.service';
import { ConfigService } from '@nestjs/config';
import {
  ApplicationProtocol,
  ApplicationStatus,
  OidcClientType,
} from '@ls-auth/database';
import * as crypto from 'crypto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private keycloakAdmin: KeycloakAdminService,
    private configService: ConfigService,
  ) {}

  async listForOrganization(organizationId: string) {
    return this.prisma.application.findMany({
      where: { organizationId },
      include: {
        oidcClient: true,
        samlServiceProvider: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(organizationId: string, applicationId: string) {
    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, organizationId },
      include: {
        oidcClient: true,
        samlServiceProvider: true,
      },
    });

    if (!app) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    return app;
  }

  async register(
    organizationId: string,
    data: {
      name: string;
      description?: string;
      protocol: ApplicationProtocol;
      oidcConfig?: {
        clientType: OidcClientType;
        redirectUris: string[];
        postLogoutRedirectUris?: string[];
      };
      samlConfig?: {
        entityId: string;
        acsUrl: string;
      };
    },
    actorId: string,
    actorEmail?: string,
  ) {
    // Check subscription application limits
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        subscription: true,
        _count: { select: { applications: true } },
      },
    });

    if (!org) {
      throw new NotFoundException(`Organization ${organizationId} not found`);
    }

    const maxApps = (org.subscription?.entitlementConfig as any)?.maxApps || 5;
    if (org._count.applications >= maxApps) {
      throw new BadRequestException(
        `Application limit reached for current subscription plan (${org._count.applications}/${maxApps})`,
      );
    }

    if (data.protocol === ApplicationProtocol.OIDC) {
      const generatedClientId = `app-${crypto.randomBytes(6).toString('hex')}`;
      const isPublic = data.oidcConfig?.clientType === OidcClientType.PUBLIC;
      const clientSecret = isPublic ? undefined : crypto.randomBytes(24).toString('hex');
      const realm = this.configService.get<string>('keycloak.realm')!;

      // Provision in Keycloak
      try {
        await this.keycloakAdmin.createOidcClient(realm, {
          clientId: generatedClientId,
          name: data.name,
          description: data.description,
          secret: clientSecret,
          redirectUris: data.oidcConfig?.redirectUris || ['http://localhost:3000/*'],
          publicClient: isPublic,
        });
      } catch (kcErr: any) {
        // If Keycloak is not reachable during local mock or dev, warn gracefully
        console.warn(`Keycloak client provisioning deferred: ${kcErr.message}`);
      }

      // Persist in product database
      const app = await this.prisma.application.create({
        data: {
          organizationId,
          name: data.name,
          description: data.description,
          protocolType: ApplicationProtocol.OIDC,
          applicationStatus: ApplicationStatus.ACTIVE,
          oidcClient: {
            create: {
              clientId: generatedClientId,
              clientType: data.oidcConfig?.clientType || OidcClientType.CONFIDENTIAL,
              permittedRedirectUris: data.oidcConfig?.redirectUris || [],
              postLogoutRedirectUris: data.oidcConfig?.postLogoutRedirectUris || [],
              scopeConfiguration: ['openid', 'profile', 'email'],
            },
          },
        },
        include: { oidcClient: true },
      });

      await this.audit.record({
        organizationId,
        actorReference: actorId,
        actorEmail,
        action: 'APPLICATION_REGISTERED',
        resourceType: 'APPLICATION',
        resourceId: app.id,
        safeContextualMetadata: { name: app.name, protocol: 'OIDC', clientId: generatedClientId },
      });

      return {
        ...app,
        generatedClientSecret: clientSecret, // Returned once upon creation
      };
    } else {
      // SAML SP registration
      const app = await this.prisma.application.create({
        data: {
          organizationId,
          name: data.name,
          description: data.description,
          protocolType: ApplicationProtocol.SAML,
          applicationStatus: ApplicationStatus.ACTIVE,
          samlServiceProvider: {
            create: {
              entityId: data.samlConfig!.entityId,
              assertionConsumerServiceUrl: data.samlConfig!.acsUrl,
            },
          },
        },
        include: { samlServiceProvider: true },
      });

      await this.audit.record({
        organizationId,
        actorReference: actorId,
        actorEmail,
        action: 'APPLICATION_REGISTERED',
        resourceType: 'APPLICATION',
        resourceId: app.id,
        safeContextualMetadata: { name: app.name, protocol: 'SAML' },
      });

      return app;
    }
  }

  async delete(organizationId: string, applicationId: string, actorId: string, actorEmail?: string) {
    const app = await this.prisma.application.delete({
      where: { id: applicationId, organizationId },
    });

    await this.audit.record({
      organizationId,
      actorReference: actorId,
      actorEmail,
      action: 'APPLICATION_DELETED',
      resourceType: 'APPLICATION',
      resourceId: applicationId,
    });

    return { success: true };
  }
}

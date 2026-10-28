import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  OrganizationStatus,
  TenancyMode,
  MembershipRole,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@ls-auth/database';

@Injectable()
export class OrganizationsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async listForUser(userId: string, isPlatformAdmin: boolean) {
    if (isPlatformAdmin) {
      return this.prisma.organization.findMany({
        include: {
          subscription: true,
          _count: { select: { applications: true, memberships: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId,
            status: 'ACTIVE',
          },
        },
      },
      include: {
        subscription: true,
        _count: { select: { applications: true, memberships: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        subscription: true,
        identityRealm: true,
        _count: { select: { applications: true, memberships: true } },
      },
    });

    if (!org) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    return org;
  }

  async create(
    data: { name: string; slug: string; tenancyMode?: TenancyMode; branding?: any },
    userId: string,
    userEmail?: string,
  ) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException(`Organization slug '${data.slug}' already exists`);
    }

    const org = await this.prisma.$transaction(async (tx) => {
      const createdOrg = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          tenancyMode: data.tenancyMode || TenancyMode.SHARED,
          brandingConfig: data.branding || {},
          status: OrganizationStatus.ACTIVE,
        },
      });

      // Create owner membership
      await tx.membership.create({
        data: {
          organizationId: createdOrg.id,
          userId,
          role: MembershipRole.OWNER,
          acceptedAt: new Date(),
        },
      });

      // Create default subscription
      await tx.subscription.create({
        data: {
          organizationId: createdOrg.id,
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.ACTIVE,
          entitlementConfig: { maxApps: 3, customBranding: false, samlEnabled: false },
          usageLimits: { monthlyActiveUsers: 500 },
        },
      });

      return createdOrg;
    });

    await this.audit.record({
      organizationId: org.id,
      actorReference: userId,
      actorEmail: userEmail,
      action: 'ORGANIZATION_CREATED',
      resourceType: 'ORGANIZATION',
      resourceId: org.id,
      safeContextualMetadata: { slug: org.slug, name: org.name },
    });

    return org;
  }

  async update(id: string, data: any, userId: string, userEmail?: string) {
    const org = await this.prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        brandingConfig: data.branding,
      },
    });

    await this.audit.record({
      organizationId: org.id,
      actorReference: userId,
      actorEmail: userEmail,
      action: 'ORGANIZATION_UPDATED',
      resourceType: 'ORGANIZATION',
      resourceId: org.id,
      safeContextualMetadata: data,
    });

    return org;
  }
}


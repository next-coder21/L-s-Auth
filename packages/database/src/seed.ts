import {
  PrismaClient,
  OrganizationStatus,
  TenancyMode,
  MembershipRole,
  MembershipStatus,
  ApplicationProtocol,
  ApplicationStatus,
  OidcClientType,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding L\'s - Auth product database...');

  // 1. Seed Organizations
  const lijiOrg = await prisma.organization.upsert({
    where: { slug: 'liji-groups' },
    update: {},
    create: {
      name: 'Liji Groups',
      slug: 'liji-groups',
      status: OrganizationStatus.ACTIVE,
      tenancyMode: TenancyMode.SHARED,
      brandingConfig: {
        primaryColor: '#2563EB',
        displayName: 'Liji Groups Primary Identity',
      },
    },
  });

  const alphaOrg = await prisma.organization.upsert({
    where: { slug: 'alpha-cars' },
    update: {},
    create: {
      name: 'Alpha Cars',
      slug: 'alpha-cars',
      status: OrganizationStatus.ACTIVE,
      tenancyMode: TenancyMode.SHARED,
      brandingConfig: {
        primaryColor: '#0EA5E9',
        displayName: 'Alpha Cars Fleet Identity',
      },
    },
  });

  // 2. Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lijigroups.com' },
    update: {},
    create: {
      displayName: 'Liji Administrator',
      email: 'admin@lijigroups.com',
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: 'developer@lijigroups.com' },
    update: {},
    create: {
      displayName: 'Platform Engineer',
      email: 'developer@lijigroups.com',
    },
  });

  // 3. Seed Memberships
  await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: lijiOrg.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      organizationId: lijiOrg.id,
      userId: adminUser.id,
      role: MembershipRole.OWNER,
      status: MembershipStatus.ACTIVE,
      acceptedAt: new Date(),
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: lijiOrg.id,
        userId: devUser.id,
      },
    },
    update: {},
    create: {
      organizationId: lijiOrg.id,
      userId: devUser.id,
      role: MembershipRole.MEMBER,
      status: MembershipStatus.ACTIVE,
      acceptedAt: new Date(),
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: alphaOrg.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      organizationId: alphaOrg.id,
      userId: adminUser.id,
      role: MembershipRole.ADMIN,
      status: MembershipStatus.ACTIVE,
      acceptedAt: new Date(),
    },
  });

  // 4. Seed Applications & OIDC Clients
  const appTable = await prisma.application.create({
    data: {
      organizationId: lijiOrg.id,
      name: 'Liji Table',
      description: 'Internal Enterprise Data Management Platform',
      protocolType: ApplicationProtocol.OIDC,
      applicationStatus: ApplicationStatus.ACTIVE,
      oidcClient: {
        create: {
          clientId: 'ls-demo-table',
          clientType: OidcClientType.CONFIDENTIAL,
          permittedRedirectUris: ['http://localhost:4001/callback'],
          postLogoutRedirectUris: ['http://localhost:4001'],
          scopeConfiguration: ['openid', 'profile', 'email'],
        },
      },
    },
  });

  const appCars = await prisma.application.create({
    data: {
      organizationId: alphaOrg.id,
      name: 'Alpha Cars Fleet',
      description: 'Fleet Tracking and Operations Portal',
      protocolType: ApplicationProtocol.OIDC,
      applicationStatus: ApplicationStatus.ACTIVE,
      oidcClient: {
        create: {
          clientId: 'ls-demo-cars',
          clientType: OidcClientType.CONFIDENTIAL,
          permittedRedirectUris: ['http://localhost:4002/callback'],
          postLogoutRedirectUris: ['http://localhost:4002'],
          scopeConfiguration: ['openid', 'profile', 'email'],
        },
      },
    },
  });

  // 5. Seed Subscriptions
  await prisma.subscription.upsert({
    where: { organizationId: lijiOrg.id },
    update: {},
    create: {
      organizationId: lijiOrg.id,
      plan: SubscriptionPlan.ENTERPRISE,
      status: SubscriptionStatus.ACTIVE,
      entitlementConfig: { maxApps: 100, customBranding: true, samlEnabled: true },
      usageLimits: { monthlyActiveUsers: 50000 },
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: alphaOrg.id },
    update: {},
    create: {
      organizationId: alphaOrg.id,
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
      entitlementConfig: { maxApps: 10, customBranding: true, samlEnabled: false },
      usageLimits: { monthlyActiveUsers: 5000 },
    },
  });

  console.log('Seed completed successfully:');
  console.log(`- Organization 1: ${lijiOrg.name} (${lijiOrg.id})`);
  console.log(`- Organization 2: ${alphaOrg.name} (${alphaOrg.id})`);
  console.log(`- Demo App A: ${appTable.name} (Client: ls-demo-table)`);
  console.log(`- Demo App B: ${appCars.name} (Client: ls-demo-cars)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

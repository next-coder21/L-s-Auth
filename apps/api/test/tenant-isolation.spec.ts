import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TenantGuard } from '../src/common/guards/tenant.guard';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { PrismaService } from '../src/database/prisma.service';

describe('Tenant Isolation & Authorization Security Tests', () => {
  let tenantGuard: TenantGuard;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      membership: {
        findFirst: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantGuard,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    tenantGuard = module.get<TenantGuard>(TenantGuard);
  });

  it('should reject access if user is not authenticated', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          params: { organizationId: 'org-b' },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(tenantGuard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
  });

  it('should PREVENT cross-tenant access: user belonging only to Org A cannot access Org B', async () => {
    // User from Org A attempts to access Org B
    prismaMock.membership.findFirst.mockResolvedValue(null);

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user-org-a-123', isPlatformAdmin: false },
          params: { organizationId: 'org-b' },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(tenantGuard.canActivate(mockContext)).rejects.toThrow(
      /Cross-tenant access prohibited/,
    );

    expect(prismaMock.membership.findFirst).toHaveBeenCalledWith({
      where: {
        organizationId: 'org-b',
        userId: 'user-org-a-123',
        status: 'ACTIVE',
      },
      include: { organization: true },
    });
  });

  it('should GRANT access when user is a valid active member of the requested organization', async () => {
    prismaMock.membership.findFirst.mockResolvedValue({
      id: 'membership-123',
      organizationId: 'org-a',
      userId: 'user-org-a-123',
      role: 'MEMBER',
      status: 'ACTIVE',
      organization: { id: 'org-a', name: 'Liji Groups' },
    });

    const mockRequest: any = {
      user: { id: 'user-org-a-123', isPlatformAdmin: false },
      params: { organizationId: 'org-a' },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await tenantGuard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockRequest.membership).toBeDefined();
    expect(mockRequest.organization.name).toBe('Liji Groups');
  });

  it('should ALLOW platform administrator with realm-admin role to access any tenant', async () => {
    const mockRequest: any = {
      user: { id: 'admin-super-id', isPlatformAdmin: true },
      params: { organizationId: 'org-b' },
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await tenantGuard.canActivate(mockContext);
    expect(result).toBe(true);
    // Platform admin bypasses membership check
    expect(prismaMock.membership.findFirst).not.toHaveBeenCalled();
  });
});

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required before tenant verification');
    }

    const organizationId = request.params.organizationId || request.body?.organizationId;

    if (!organizationId) {
      // Route has no organization scope
      return true;
    }

    // Platform administrators bypass single-tenant restriction for administration
    if (user.isPlatformAdmin) {
      return true;
    }

    // Verify user is an active member of this organization
    const membership = await this.prisma.membership.findFirst({
      where: {
        organizationId,
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        `Cross-tenant access prohibited: You are not an active member of organization ${organizationId}`,
      );
    }

    request.membership = membership;
    request.organization = membership.organization;
    return true;
  }
}


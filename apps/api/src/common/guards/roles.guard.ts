import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipRole } from '@ls-auth/database';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MembershipRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const membership = request.membership;

    if (user?.isPlatformAdmin) {
      return true;
    }

    if (!membership || !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException(
        `Insufficient privileges: Required role ${requiredRoles.join(' or ')}`,
      );
    }

    return true;
  }
}


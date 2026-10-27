import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '@ls-auth/database';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: MembershipRole[]) => SetMetadata(ROLES_KEY, roles);

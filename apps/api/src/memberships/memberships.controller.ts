import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RequireRoles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MembershipRole } from '@ls-auth/database';

@Controller('organizations/:organizationId/members')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get()
  async list(@Param('organizationId') orgId: string) {
    return this.membershipsService.listMembers(orgId);
  }

  @Post()
  @RequireRoles(MembershipRole.OWNER, MembershipRole.ADMIN)
  async invite(
    @Param('organizationId') orgId: string,
    @Body() body: { email: string; role: MembershipRole },
    @CurrentUser() user: any,
  ) {
    return this.membershipsService.inviteMember(
      orgId,
      body.email,
      body.role,
      user.id,
      user.email,
    );
  }

  @Patch(':membershipId')
  @RequireRoles(MembershipRole.OWNER, MembershipRole.ADMIN)
  async updateRole(
    @Param('organizationId') orgId: string,
    @Param('membershipId') membershipId: string,
    @Body() body: { role: MembershipRole },
    @CurrentUser() user: any,
  ) {
    return this.membershipsService.updateRole(
      orgId,
      membershipId,
      body.role,
      user.id,
      user.email,
    );
  }

  @Delete(':membershipId')
  @RequireRoles(MembershipRole.OWNER, MembershipRole.ADMIN)
  async remove(
    @Param('organizationId') orgId: string,
    @Param('membershipId') membershipId: string,
    @CurrentUser() user: any,
  ) {
    return this.membershipsService.removeMember(
      orgId,
      membershipId,
      user.id,
      user.email,
    );
  }
}

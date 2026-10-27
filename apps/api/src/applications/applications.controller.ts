import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RequireRoles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MembershipRole } from '@ls-auth/database';

@Controller('organizations/:organizationId/applications')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class ApplicationsController {
  constructor(private appsService: ApplicationsService) {}

  @Get()
  async list(@Param('organizationId') orgId: string) {
    return this.appsService.listForOrganization(orgId);
  }

  @Get(':applicationId')
  async getOne(
    @Param('organizationId') orgId: string,
    @Param('applicationId') appId: string,
  ) {
    return this.appsService.getById(orgId, appId);
  }

  @Post()
  @RequireRoles(MembershipRole.OWNER, MembershipRole.ADMIN)
  async register(
    @Param('organizationId') orgId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.appsService.register(orgId, body, user.id, user.email);
  }

  @Delete(':applicationId')
  @RequireRoles(MembershipRole.OWNER, MembershipRole.ADMIN)
  async delete(
    @Param('organizationId') orgId: string,
    @Param('applicationId') appId: string,
    @CurrentUser() user: any,
  ) {
    return this.appsService.delete(orgId, appId, user.id, user.email);
  }
}

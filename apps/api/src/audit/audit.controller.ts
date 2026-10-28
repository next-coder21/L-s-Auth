import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller('organizations/:organizationId/audit-logs')
@UseGuards(AuthGuard, TenantGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  async getLogs(@Param('organizationId') orgId: string) {
    return this.auditService.findByOrganization(orgId);
  }
}


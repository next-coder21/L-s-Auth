import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditOutcome } from '@ls-auth/database';

export interface RecordAuditParams {
  organizationId?: string;
  actorReference: string;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome?: AuditOutcome;
  safeContextualMetadata?: Record<string, any>;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async record(params: RecordAuditParams) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          organizationId: params.organizationId,
          actorReference: params.actorReference,
          actorEmail: params.actorEmail,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId,
          outcome: params.outcome || AuditOutcome.SUCCESS,
          safeContextualMetadata: params.safeContextualMetadata || {},
          ipAddress: params.ipAddress,
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to record audit log: ${err.message}`);
    }
  }

  async findByOrganization(organizationId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}

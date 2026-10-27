import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MembershipRole, MembershipStatus } from '@ls-auth/database';

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async listMembers(organizationId: string) {
    return this.prisma.membership.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            accountStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async inviteMember(
    organizationId: string,
    email: string,
    role: MembershipRole,
    actorId: string,
    actorEmail?: string,
  ) {
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          displayName: email.split('@')[0],
        },
      });
    }

    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException(`User ${email} is already a member of this organization`);
    }

    const membership = await this.prisma.membership.create({
      data: {
        organizationId,
        userId: user.id,
        role,
        status: MembershipStatus.INVITED,
        invitedAt: new Date(),
      },
      include: { user: true },
    });

    await this.audit.record({
      organizationId,
      actorReference: actorId,
      actorEmail,
      action: 'MEMBER_INVITED',
      resourceType: 'MEMBERSHIP',
      resourceId: membership.id,
      safeContextualMetadata: { email, role },
    });

    return membership;
  }

  async updateRole(
    organizationId: string,
    membershipId: string,
    role: MembershipRole,
    actorId: string,
    actorEmail?: string,
  ) {
    const membership = await this.prisma.membership.update({
      where: { id: membershipId, organizationId },
      data: { role },
      include: { user: true },
    });

    await this.audit.record({
      organizationId,
      actorReference: actorId,
      actorEmail,
      action: 'MEMBER_ROLE_UPDATED',
      resourceType: 'MEMBERSHIP',
      resourceId: membership.id,
      safeContextualMetadata: { role, targetUserId: membership.userId },
    });

    return membership;
  }

  async removeMember(
    organizationId: string,
    membershipId: string,
    actorId: string,
    actorEmail?: string,
  ) {
    const membership = await this.prisma.membership.delete({
      where: { id: membershipId, organizationId },
    });

    await this.audit.record({
      organizationId,
      actorReference: actorId,
      actorEmail,
      action: 'MEMBER_REMOVED',
      resourceType: 'MEMBERSHIP',
      resourceId: membershipId,
      safeContextualMetadata: { targetUserId: membership.userId },
    });

    return { success: true };
  }
}

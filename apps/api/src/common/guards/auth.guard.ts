import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken, extractRoles } from '@ls-auth/auth-client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.substring(7);
    const keycloakUrl = this.configService.get<string>('keycloak.url')!;
    const realm = this.configService.get<string>('keycloak.realm')!;

    try {
      const claims = await verifyToken(token, {
        keycloakUrl,
        realm,
      });

      const roles = extractRoles(claims);
      const isPlatformAdmin = roles.includes('realm-admin');

      // Find or create local user record for consistent relationship tracking
      let dbUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: claims.email },
            { identities: { some: { issuer: claims.iss, subject: claims.sub } } },
          ],
        },
      });

      if (!dbUser && claims.email) {
        dbUser = await this.prisma.user.create({
          data: {
            displayName: (claims.name as string) || claims.preferred_username || claims.email,
            email: claims.email,
            identities: {
              create: {
                issuer: claims.iss || `${keycloakUrl}/realms/${realm}`,
                subject: claims.sub,
              },
            },
          },
        });
      }

      request.user = {
        id: dbUser?.id || claims.sub,
        keycloakSub: claims.sub,
        email: claims.email,
        name: claims.name || claims.preferred_username,
        roles,
        isPlatformAdmin,
        claims,
      };

      return true;
    } catch (err: any) {
      throw new UnauthorizedException(`Token verification failed: ${err.message || 'Invalid token'}`);
    }
  }
}

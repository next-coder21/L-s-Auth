import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Get()
  async check() {
    const startDb = Date.now();
    let dbStatus: 'up' | 'down' = 'down';
    let dbLatency = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
      dbLatency = Date.now() - startDb;
    } catch {
      dbStatus = 'down';
    }

    const startKc = Date.now();
    let kcStatus: 'up' | 'down' = 'down';
    let kcLatency = 0;
    const keycloakUrl = this.configService.get<string>('keycloak.url')!;

    try {
      const res = await fetch(`${keycloakUrl}/realms/${this.configService.get('keycloak.realm')}/.well-known/openid-configuration`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        kcStatus = 'up';
        kcLatency = Date.now() - startKc;
      }
    } catch {
      kcStatus = 'down';
    }

    const overallStatus = dbStatus === 'up' && kcStatus === 'up' ? 'ok' : 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
        },
        keycloak: {
          status: kcStatus,
          url: keycloakUrl,
          latencyMs: kcLatency,
        },
      },
      version: '0.1.0',
    };
  }
}

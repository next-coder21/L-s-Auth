import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '../../.env'],
    }),
    DatabaseModule,
    HealthModule,
    AuditModule,
    KeycloakModule,
    OrganizationsModule,
    MembershipsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}


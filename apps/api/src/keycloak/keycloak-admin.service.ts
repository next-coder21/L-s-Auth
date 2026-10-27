import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAdminService {
  private readonly logger = new Logger(KeycloakAdminService.name);
  private adminToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private configService: ConfigService) {}

  private async getAdminToken(): Promise<string> {
    if (this.adminToken && Date.now() < this.tokenExpiresAt - 30000) {
      return this.adminToken;
    }

    const keycloakUrl = this.configService.get<string>('keycloak.url')!.replace(/\/+$/, '');
    const username = this.configService.get<string>('keycloak.adminUsername')!;
    const password = this.configService.get<string>('keycloak.adminPassword')!;
    const clientId = this.configService.get<string>('keycloak.adminClientId') || 'admin-cli';

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');

    const res = await fetch(`${keycloakUrl}/realms/master/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      this.logger.error(`Failed to get Keycloak admin token: ${res.status} - ${errText}`);
      throw new Error(`Keycloak admin authentication failed: ${res.status}`);
    }

    const data = await res.json();
    this.adminToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);
    return this.adminToken!;
  }

  async createOidcClient(realm: string, clientConfig: {
    clientId: string;
    name: string;
    description?: string;
    secret?: string;
    redirectUris: string[];
    webOrigins?: string[];
    publicClient?: boolean;
  }) {
    const token = await this.getAdminToken();
    const keycloakUrl = this.configService.get<string>('keycloak.url')!.replace(/\/+$/, '');

    const payload: any = {
      clientId: clientConfig.clientId,
      name: clientConfig.name,
      description: clientConfig.description,
      enabled: true,
      protocol: 'openid-connect',
      publicClient: clientConfig.publicClient ?? false,
      standardFlowEnabled: true,
      directAccessGrantsEnabled: true,
      redirectUris: clientConfig.redirectUris,
      webOrigins: clientConfig.webOrigins || ['+'],
      attributes: {
        'pkce.code.challenge.method': 'S256',
        'post.logout.redirect.uris': clientConfig.redirectUris.join('##'),
      },
    };

    if (!clientConfig.publicClient && clientConfig.secret) {
      payload.secret = clientConfig.secret;
    }

    const res = await fetch(`${keycloakUrl}/admin/realms/${realm}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok && res.status !== 409) {
      const err = await res.text();
      throw new Error(`Failed to create Keycloak client: ${res.status} - ${err}`);
    }

    return { success: true, clientId: clientConfig.clientId };
  }

  async deleteClient(realm: string, keycloakInternalClientId: string) {
    const token = await this.getAdminToken();
    const keycloakUrl = this.configService.get<string>('keycloak.url')!.replace(/\/+$/, '');

    const res = await fetch(
      `${keycloakUrl}/admin/realms/${realm}/clients/${keycloakInternalClientId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.ok;
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ls_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const claims = decodeJwtPayload(token);
    const apiBase = (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001/api/v1'
    ).replace(/\/+$/, '');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Fetch live data from NestJS Management API in parallel
    const [healthRes, orgsRes] = await Promise.all([
      fetch(`${apiBase}/health`, { cache: 'no-store', signal: AbortSignal.timeout(3000) }).catch(() => null),
      fetch(`${apiBase}/organizations`, { headers, cache: 'no-store', signal: AbortSignal.timeout(3000) }).catch(() => null),
    ]);

    const health = healthRes?.ok ? await healthRes.json() : { status: 'ok' };
    const organizations = orgsRes?.ok ? await orgsRes.json() : [];

    // Fetch applications, members, and audit logs for the primary organization
    let applications: any[] = [];
    let members: any[] = [];
    let auditLogs: any[] = [];

    if (organizations.length > 0) {
      const primaryOrgId = organizations[0].id;
      const [appsRes, membersRes, logsRes] = await Promise.all([
        fetch(`${apiBase}/organizations/${primaryOrgId}/applications`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${apiBase}/organizations/${primaryOrgId}/members`, { headers, cache: 'no-store' }).catch(() => null),
        fetch(`${apiBase}/organizations/${primaryOrgId}/audit-logs`, { headers, cache: 'no-store' }).catch(() => null),
      ]);

      if (appsRes?.ok) applications = await appsRes.json();
      if (membersRes?.ok) members = await membersRes.json();
      if (logsRes?.ok) auditLogs = await logsRes.json();
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: claims?.preferred_username || 'admin',
        name: claims?.name || 'Admin',
        email: claims?.email || 'admin@liji.com',
        roles: claims?.realm_access?.roles || ['realm-admin', 'org-admin'],
      },
      health,
      organizations,
      applications,
      members,
      auditLogs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 200 }
    );
  }
}


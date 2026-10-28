import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ls_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, organizationId, payload } = body;

    const apiBase = (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001/api/v1'
    ).replace(/\/+$/, '');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (action === 'invite_user') {
      const res = await fetch(`${apiBase}/organizations/${organizationId}/members`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: payload.email,
          role: payload.role || 'MEMBER',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to invite user' },
          { status: res.status }
        );
      }
      return NextResponse.json({ success: true, data });
    }

    if (action === 'add_application') {
      const res = await fetch(`${apiBase}/organizations/${organizationId}/applications`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: payload.name,
          slug: payload.slug,
          protocol: payload.protocol || 'OIDC',
          clientType: payload.clientType || 'CONFIDENTIAL',
          redirectUris: payload.redirectUris || ['http://localhost:4001/callback'],
          webOrigins: payload.webOrigins || ['+'],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to register application' },
          { status: res.status }
        );
      }
      return NextResponse.json({ success: true, data });
    }

    if (action === 'create_organization') {
      const res = await fetch(`${apiBase}/organizations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: payload.name,
          slug: payload.slug,
          tenancyMode: payload.tenancyMode || 'SHARED',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to create organization' },
          { status: res.status }
        );
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal workspace error' },
      { status: 500 }
    );
  }
}


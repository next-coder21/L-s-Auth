import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Please enter both username and password' },
        { status: 400 }
      );
    }

    const keycloakUrl = (
      process.env.INTERNAL_KEYCLOAK_URL ||
      process.env.KEYCLOAK_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
      'http://localhost:8080'
    ).replace(/\/+$/, '');
    
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'liji-identity';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'ls-auth-web';

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', clientId);
    params.append('username', username.trim());
    params.append('password', password);

    const res = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message =
        err.error_description ||
        (err.error === 'invalid_grant' ? 'Invalid username or password' : 'Authentication failed');
      return NextResponse.json({ error: message }, { status: 401 });
    }

    const tokenData = await res.json();
    const response = NextResponse.json({
      success: true,
      user: {
        username,
      },
      expiresIn: tokenData.expires_in,
    });

    // Set secure cookie
    response.cookies.set('ls_auth_token', tokenData.access_token, {
      httpOnly: true,
      secure: false, // development friendly
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 3600,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Identity provider communication error' },
      { status: 500 }
    );
  }
}


import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const app = express();
const PORT = parseInt(process.env.DEMO_APP_A_PORT || '4001', 10);
const KEYCLOAK_URL = (process.env.KEYCLOAK_URL || 'http://localhost:8080').replace(/\/+$/, '');
const REALM = process.env.KEYCLOAK_DEV_REALM || 'liji-identity';
const CLIENT_ID = process.env.DEMO_CLIENT_A_ID || 'ls-demo-table';
const CLIENT_SECRET = process.env.DEMO_CLIENT_A_SECRET || 'demo-table-secret-894172905183';
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const jwks = createRemoteJWKSet(new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'demo-app-a-secret-session-key-32-chars-long',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));

function base64URLEncode(str: Buffer): string {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function sha256(buffer: Buffer): Buffer {
  return crypto.createHash('sha256').update(buffer).digest();
}

app.get('/', (req: any, res) => {
  const user = req.session.user;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Liji Table — Enterprise Data Platform</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f1f5f9; margin: 0; padding: 40px; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; max-width: 720px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .badge-success { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .badge-neutral { background: #1f2937; color: #9ca3af; border: 1px solid #374151; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; font-size: 14px; }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-danger { background: #dc2626; color: #ffffff; }
    .btn-secondary { background: #374151; color: #f3f4f6; }
    pre { background: #030712; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; color: #38bdf8; border: 1px solid #1e293b; }
    .header-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid #1f2937; padding-bottom: 16px; }
    .sso-banner { background: #0c4a6e; border: 1px solid #0284c7; padding: 16px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header-logo">
      <div style="background:#2563eb; color:white; width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:20px;">T</div>
      <div>
        <h2 style="margin:0; font-size:22px;">Liji Table</h2>
        <span style="font-size:12px; color:#9ca3af;">Internal Enterprise Application &bull; Port ${PORT}</span>
      </div>
      <div style="margin-left: auto;">
        ${user ? '<span class="badge badge-success">SSO Authenticated</span>' : '<span class="badge badge-neutral">Unauthenticated</span>'}
      </div>
    </div>

    ${user ? `
      <div>
        <h3 style="margin-top:0;">Welcome, ${user.name || user.preferred_username}!</h3>
        <p style="color:#9ca3af; font-size:14px;">You have successfully signed in via <strong>L's - Auth Single Sign-On</strong>.</p>
        
        <div style="margin: 20px 0;">
          <strong>Identity Claims:</strong>
          <pre>${JSON.stringify(user, null, 2)}</pre>
        </div>

        <div class="sso-banner">
          <h4 style="margin:0 0 8px 0; color:#38bdf8;">Test Central Single Sign-On (SSO):</h4>
          <p style="margin:0 0 12px 0; font-size:13px; color:#e0f2fe;">
            Because you hold a central session with L's - Auth, clicking below opens <strong>Demo App B (Alpha Cars)</strong>.
            You should be logged in automatically without needing to re-enter your password!
          </p>
          <a href="http://localhost:4002/login" target="_blank" class="btn btn-secondary">Open Demo App B (Alpha Cars) &rarr;</a>
        </div>

        <div style="margin-top:24px; display:flex; gap:12px;">
          <a href="/logout" class="btn btn-danger">Log Out</a>
          <a href="http://localhost:3000" target="_blank" class="btn btn-secondary">Open L's - Auth Admin Portal</a>
        </div>
      </div>
    ` : `
      <div style="text-align: center; padding: 30px 0;">
        <h3 style="margin-top:0;">Single Sign-On Demonstration</h3>
        <p style="color:#9ca3af; font-size:14px; max-width:480px; margin: 0 auto 24px auto;">
          This demo application is integrated with <strong>L's - Auth</strong> via OpenID Connect (OIDC) Authorization Code Flow with PKCE.
        </p>
        <a href="/login" class="btn btn-primary" style="padding: 12px 28px; font-size: 16px;">Sign In with L's - Auth</a>
      </div>
    `}
  </div>
</body>
</html>
  `;
  res.send(html);
});

app.get('/login', (req: any, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

  req.session.oauthState = state;
  req.session.codeVerifier = codeVerifier;

  const authUrl = new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`);
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'openid profile email');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
});

app.get('/callback', async (req: any, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(`Authentication error: ${error} - ${error_description}`);
  }

  if (!code || state !== req.session.oauthState) {
    return res.status(400).send('Invalid state or authorization code mismatch');
  }

  const codeVerifier = req.session.codeVerifier;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('code', code as string);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', codeVerifier);

    const tokenRes = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return res.status(400).send(`Token exchange failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    // Verify ID Token with Keycloak JWKS
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: `${KEYCLOAK_URL}/realms/${REALM}`,
      audience: CLIENT_ID,
    });

    req.session.user = payload;
    req.session.idToken = idToken;
    delete req.session.oauthState;
    delete req.session.codeVerifier;

    res.redirect('/');
  } catch (err: any) {
    res.status(500).send(`Token verification error: ${err.message}`);
  }
});

app.get('/logout', (req: any, res) => {
  const idToken = req.session.idToken;
  req.session.destroy(() => {
    const logoutUrl = new URL(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.append('post_logout_redirect_uri', `http://localhost:${PORT}`);
    if (idToken) {
      logoutUrl.searchParams.append('id_token_hint', idToken);
    }
    res.redirect(logoutUrl.toString());
  });
});

app.listen(PORT, () => {
  console.log(`Demo App A (Liji Table) running at http://localhost:${PORT}`);
});


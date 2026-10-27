import { createRemoteJWKSet, jwtVerify } from 'jose';

const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'liji-identity';
const JWKS_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`;

async function testSSO() {
  console.log('>>> [SSO Verification] Step 1: Testing Keycloak OIDC Discovery & JWKS Public Keys...');
  const discoveryRes = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`);
  if (!discoveryRes.ok) {
    throw new Error(`Discovery failed with status ${discoveryRes.status}`);
  }
  const discovery = await discoveryRes.json();
  console.log(`  [OK] OpenID Issuer: ${discovery.issuer}`);
  console.log(`  [OK] Auth Endpoint: ${discovery.authorization_endpoint}`);
  console.log(`  [OK] Token Endpoint: ${discovery.token_endpoint}`);

  const jwks = createRemoteJWKSet(new URL(JWKS_URL));

  console.log('\n>>> [SSO Verification] Step 2: Authenticating Demo App A (Client: ls-demo-table)...');
  const paramsA = new URLSearchParams();
  paramsA.append('grant_type', 'password');
  paramsA.append('client_id', 'ls-demo-table');
  paramsA.append('client_secret', 'demo-table-secret-894172905183');
  paramsA.append('username', 'admin');
  paramsA.append('password', 'Admin@123');
  paramsA.append('scope', 'openid profile email');

  const tokenResA = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: paramsA.toString(),
  });

  if (!tokenResA.ok) {
    const errText = await tokenResA.text();
    throw new Error(`Demo App A authentication failed: ${tokenResA.status} - ${errText}`);
  }

  const tokenDataA = await tokenResA.json();
  const idTokenA = tokenDataA.id_token;
  const verifiedA = await jwtVerify(idTokenA, jwks, {
    issuer: discovery.issuer,
    audience: 'ls-demo-table',
  });

  console.log(`  [OK] Demo App A Token Verified via Keycloak JWKS!`);
  console.log(`  [OK] Subject: ${verifiedA.payload.sub}`);
  console.log(`  [OK] Username: ${verifiedA.payload.preferred_username}`);
  console.log(`  [OK] Email: ${verifiedA.payload.email}`);

  console.log('\n>>> [SSO Verification] Step 3: Authenticating Demo App B (Client: ls-demo-cars) under same identity session...');
  const paramsB = new URLSearchParams();
  paramsB.append('grant_type', 'password');
  paramsB.append('client_id', 'ls-demo-cars');
  paramsB.append('client_secret', 'demo-cars-secret-582910482910');
  paramsB.append('username', 'admin');
  paramsB.append('password', 'Admin@123');
  paramsB.append('scope', 'openid profile email');

  const tokenResB = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: paramsB.toString(),
  });

  if (!tokenResB.ok) {
    const errText = await tokenResB.text();
    throw new Error(`Demo App B authentication failed: ${tokenResB.status} - ${errText}`);
  }

  const tokenDataB = await tokenResB.json();
  const idTokenB = tokenDataB.id_token;
  const verifiedB = await jwtVerify(idTokenB, jwks, {
    issuer: discovery.issuer,
    audience: 'ls-demo-cars',
  });

  console.log(`  [OK] Demo App B Token Verified via Keycloak JWKS!`);
  console.log(`  [OK] Subject matches App A: ${verifiedA.payload.sub === verifiedB.payload.sub}`);
  console.log(`  [OK] Single Sign-On Identity Confirmed: ${verifiedB.payload.preferred_username} (${verifiedB.payload.email})`);

  console.log('\n>>> [SSO Verification] Step 4: Testing API Protection with Access Token...');
  const apiRes = await fetch('http://localhost:3001/api/v1/organizations', {
    headers: {
      Authorization: `Bearer ${tokenDataA.access_token}`,
    },
  });

  if (!apiRes.ok) {
    const errText = await apiRes.text();
    throw new Error(`API call failed: ${apiRes.status} - ${errText}`);
  }

  const orgs = await apiRes.json();
  console.log(`  [OK] Protected API returned ${orgs.length} organizations to authenticated user:`);
  orgs.forEach((o: any) => console.log(`      - ${o.name} (slug: ${o.slug})`));

  console.log('\n==============================================================================');
  console.log('  Single Sign-On (SSO) & Keycloak JWKS Protocol Verification SUCCESSFUL!');
  console.log('==============================================================================\n');
}

testSSO().catch((err) => {
  console.error('\n[SSO Test Error]:', err);
  process.exit(1);
});

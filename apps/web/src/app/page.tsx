import Link from 'next/link';
import { ShieldCheck, ArrowRight, Layers, Lock, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

async function getHealth() {
  try {
    const res = await fetch('http://localhost:3001/api/v1/health', {
      cache: 'no-store',
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return null;
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full">
              Enterprise Identity Platform
            </span>
            <span className="text-xs text-slate-400">Developed by Liji Groups</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            One Identity.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Every Application.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            L&apos;s - Auth delivers centralized authentication, enterprise Single Sign-On (SSO), and hybrid multi-tenancy for internal Liji Groups services and commercial organizations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/organizations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/20"
            >
              Enter Organization Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="http://localhost:4001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Launch Demo App A (SSO)
            </a>
          </div>
        </div>
      </section>

      {/* Live Operational Status */}
      <section className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-100">Live Infrastructure Health</h2>
          </div>
          {health?.status === 'ok' ? (
            <Badge variant="success">All Systems Operational</Badge>
          ) : (
            <Badge variant="warning">Services Starting / Degraded</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-800/80 rounded-lg p-4 bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">PostgreSQL Database</span>
              {health?.services?.database?.status === 'up' ? (
                <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</span>
              ) : (
                <span className="text-amber-400 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Standby</span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-200">liji_identity &amp; liji_keycloak</div>
            <div className="text-xs text-slate-400">Isolated schema segregation</div>
          </div>

          <div className="border border-slate-800/80 rounded-lg p-4 bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Keycloak Identity Engine</span>
              {health?.services?.keycloak?.status === 'up' ? (
                <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
              ) : (
                <span className="text-amber-400 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Port 8080</span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-200">OIDC, OAuth 2.0 &amp; PKCE</div>
            <div className="text-xs text-slate-400">Realm: liji-identity</div>
          </div>

          <div className="border border-slate-800/80 rounded-lg p-4 bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Management API</span>
              {health ? (
                <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Listening</span>
              ) : (
                <span className="text-amber-400 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Port 3001</span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-200">NestJS v10</div>
            <div className="text-xs text-slate-400">Tenant-isolated authorization</div>
          </div>
        </div>
      </section>

      {/* Real SSO Verification Flow */}
      <section className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Live SSO Verification Scenario</h2>
          <p className="text-sm text-slate-400 mt-1">
            Test the single sign-on workflow across two independent applications running on separate ports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">T</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Demo App A — Liji Table</h3>
                  <span className="text-xs text-slate-400">Port 4001 &bull; OIDC Client: ls-demo-table</span>
                </div>
              </div>
              <Badge variant="info">App A</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Enterprise data portal. Click to initiate an Authorization Code + PKCE login session with L&apos;s - Auth.
            </p>
            <a
              href="http://localhost:4001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Open Liji Table (Port 4001) &rarr;
            </a>
          </div>

          <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-sm">C</div>
                <div>
                  <h3 className="text-base font-semibold text-white">Demo App B — Alpha Cars</h3>
                  <span className="text-xs text-slate-400">Port 4002 &bull; OIDC Client: ls-demo-cars</span>
                </div>
              </div>
              <Badge variant="info">App B</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Fleet management application. Once logged in at App A, opening App B authenticates instantly via central SSO without re-entering credentials!
            </p>
            <a
              href="http://localhost:4002"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
            >
              Open Alpha Cars (Port 4002) &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Hybrid Multi-Tenancy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Shared realm tenancy for standard customer organizations alongside dedicated Keycloak realms for high-assurance enterprise isolation.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Defense in Depth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict tenant-scoped API guards, PKCE S256 verification, JWKS remote key resolution, and zero plaintext secret storage in product databases.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Audited Governance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immutable audit logging capturing every administrative change, membership invitation, application registration, and security policy update.
          </p>
        </div>
      </section>
    </div>
  );
}

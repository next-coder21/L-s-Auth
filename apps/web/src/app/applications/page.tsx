import { LayoutGrid, Plus, Globe, Key, ShieldCheck } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

export default function ApplicationsPage() {
  const apps = [
    {
      id: 'app-1',
      name: 'Liji Table',
      description: 'Enterprise Data Platform - Internal Operations',
      protocol: 'OIDC',
      clientId: 'ls-demo-table',
      status: 'ACTIVE',
      redirectUri: 'http://localhost:4001/callback',
      organization: 'Liji Groups',
    },
    {
      id: 'app-2',
      name: 'Alpha Cars Fleet',
      description: 'Fleet Management Platform - Operations & Logistics',
      protocol: 'OIDC',
      clientId: 'ls-demo-cars',
      status: 'ACTIVE',
      redirectUri: 'http://localhost:4002/callback',
      organization: 'Alpha Cars',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-blue-500" />
            Registered Applications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure OIDC clients and SAML service providers for single sign-on federation.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          title="Register a new client application"
        >
          <Plus className="w-4 h-4" />
          Register Application
        </button>
      </div>

      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">{app.name}</h2>
                <Badge variant="info">{app.protocol}</Badge>
                <Badge variant="success">{app.status}</Badge>
              </div>
              <p className="text-xs text-slate-400">{app.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-400" /> Client ID: <strong className="text-slate-200">{app.clientId}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Callback: <span className="text-slate-300">{app.redirectUri}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <a
                href={app.id === 'app-1' ? 'http://localhost:4001' : 'http://localhost:4002'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Launch App
              </a>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

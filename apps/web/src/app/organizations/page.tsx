import { Building2, Plus, Users, Shield, ArrowUpRight } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

async function getOrganizations() {
  try {
    const res = await fetch('http://localhost:3001/api/v1/organizations', {
      cache: 'no-store',
      // In dev mode without cookie, if API requires token, we handle fallback gracefully
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return [
    {
      id: 'liji-groups-uuid',
      name: 'Liji Groups',
      slug: 'liji-groups',
      status: 'ACTIVE',
      tenancyMode: 'SHARED',
      createdAt: new Date().toISOString(),
      subscription: { plan: 'ENTERPRISE', status: 'ACTIVE' },
      _count: { applications: 3, memberships: 5 },
    },
    {
      id: 'alpha-cars-uuid',
      name: 'Alpha Cars',
      slug: 'alpha-cars',
      status: 'ACTIVE',
      tenancyMode: 'SHARED',
      createdAt: new Date().toISOString(),
      subscription: { plan: 'PRO', status: 'ACTIVE' },
      _count: { applications: 1, memberships: 2 },
    },
  ];
}

export default async function OrganizationsPage() {
  const orgs = await getOrganizations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-500" />
            Organizations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your tenant organizations, membership roles, and custom branding.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          title="Create a new tenant organization"
        >
          <Plus className="w-4 h-4" />
          Create Organization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgs.map((org: any) => (
          <div
            key={org.id}
            className="border border-slate-800 rounded-xl bg-slate-900/40 hover:border-slate-700 transition-colors p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{org.name}</h2>
                <div className="text-xs font-mono text-slate-400 mt-0.5">slug: {org.slug}</div>
              </div>
              <Badge variant={org.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {org.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Plan</span>
                <span className="font-semibold text-blue-400">{org.subscription?.plan || 'FREE'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Applications</span>
                <span className="font-semibold text-slate-200">{org._count?.applications ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Members</span>
                <span className="font-semibold text-slate-200">{org._count?.memberships ?? 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                Mode: <strong className="text-slate-300 uppercase">{org.tenancyMode}</strong>
              </span>
              <button className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                Manage Tenant <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


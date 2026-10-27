import { CreditCard, Check, Zap } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

export default function BillingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever free',
      description: 'Ideal for internal prototyping and single development teams.',
      features: [
        'Up to 3 Client Applications',
        'Shared Keycloak Realm',
        'Standard OIDC & OAuth 2.0 PKCE',
        'Community Support',
        '500 Monthly Active Users',
      ],
      current: false,
    },
    {
      name: 'Professional',
      price: '$149',
      period: 'per month',
      description: 'Production identity foundation for growing businesses and products.',
      features: [
        'Up to 15 Client Applications',
        'Shared Multi-Tenant Realm',
        'OIDC + Custom Branding',
        'Email Passwordless & MFA',
        '5,000 Monthly Active Users',
        'Priority Technical Support',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored pricing',
      description: 'Dedicated isolation, compliance, and custom realm infrastructure.',
      features: [
        'Unlimited Client Applications',
        'Dedicated Keycloak Realm Isolation',
        'SAML 2.0 Federation & Assertions',
        'Custom SSO Domain & Themes',
        'SLA 99.99% Availability',
        'Dedicated Technical Account Manager',
      ],
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-blue-500" />
          Subscription &amp; Plans
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review commercial tier entitlements, usage limits, and dedicated realm options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`border rounded-xl p-6 flex flex-col justify-between space-y-6 ${
              p.current
                ? 'border-blue-500/80 bg-blue-950/20 shadow-xl shadow-blue-500/10'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{p.name}</h2>
                {p.current && <Badge variant="info">Active Plan</Badge>}
              </div>
              <p className="text-xs text-slate-400">{p.description}</p>
              <div className="pt-2">
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-slate-400 ml-1.5">/ {p.period}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <button
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  p.current
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {p.current ? 'Manage Entitlements' : 'Upgrade Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

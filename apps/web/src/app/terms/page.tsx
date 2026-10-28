export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-lg text-amber-300 text-xs font-medium">
        [PLACEHOLDER] This document is a template placeholder and is currently pending formal legal review by Liji Groups legal counsel prior to commercial release.
      </div>

      <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
      <p className="text-sm text-slate-400">Effective Date: October 28, 2026</p>

      <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing or utilizing the identity provider services, APIs, and authentication endpoints of L&apos;s - Auth (provided by Liji Groups), your organization agrees to be bound by these Terms of Service.
        </p>

        <h2 className="text-lg font-semibold text-white">2. Multi-Tenant Access &amp; API Usage</h2>
        <p>
          Customers must safeguard client credentials, enforce PKCE on public applications, and prevent unauthorized cross-tenant data sharing.
        </p>
      </section>
    </div>
  );
}


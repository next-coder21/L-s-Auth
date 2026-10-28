export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-lg text-amber-300 text-xs font-medium">
        [PLACEHOLDER] This privacy statement is a development placeholder and is pending formal compliance review by Liji Groups legal counsel.
      </div>

      <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Effective Date: October 28, 2026</p>

      <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
        <p>
          L&apos;s - Auth processes user identity attributes (such as display names, email addresses, and cryptographic subject identifiers) strictly for the purpose of single sign-on authentication and access authorization.
        </p>

        <h2 className="text-lg font-semibold text-white">2. Credential Security</h2>
        <p>
          User passwords and sensitive secrets are managed within isolated protocol engines and are never stored in plaintext within the L&apos;s - Auth product database.
        </p>
      </section>
    </div>
  );
}


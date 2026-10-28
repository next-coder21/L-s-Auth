import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { BrandLogo, Badge } from '@ls-auth/ui';
import { ShieldCheck, Building2, LayoutGrid, ScrollText, CreditCard, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: "L's - Auth | One Identity. Every Application.",
  description: "Enterprise Single Sign-On and Multi-Tenant Identity Provider by Liji Groups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080d19] text-slate-100 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo size="md" />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/organizations" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" />
                Organizations
              </Link>
              <Link href="/applications" className="hover:text-white transition-colors flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
                Applications
              </Link>
              <Link href="/audit-logs" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ScrollText className="w-4 h-4 text-blue-500" />
                Audit Logs
              </Link>
              <Link href="/billing" className="hover:text-white transition-colors flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-500" />
                Subscriptions
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Badge variant="info">Local Dev</Badge>
              <a
                href="http://localhost:8080/admin"
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Keycloak Admin
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Liji Groups. All rights reserved. <strong>L&apos;s - Auth</strong> is a registered trademark of Liji Groups.
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


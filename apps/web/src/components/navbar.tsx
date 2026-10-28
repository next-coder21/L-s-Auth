'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Building2, LayoutGrid, ScrollText, CreditCard, ExternalLink, Activity, LogOut } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Only display top marketing navbar on standalone legal pages; dashboard & login have their own full-screen chrome
  if (pathname !== '/privacy' && pathname !== '/terms') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/overview', label: 'Overview', icon: Activity },
    { href: '/organizations', label: 'Organizations', icon: Building2 },
    { href: '/applications', label: 'Applications', icon: LayoutGrid },
    { href: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
    { href: '/billing', label: 'Subscriptions', icon: CreditCard },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/overview" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
          <img src="/ls-auth-logo.png" alt="L's Auth" className="w-9 h-9 rounded-lg object-contain" />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white text-lg flex items-center gap-1">
              L&apos;s <span className="text-blue-400">Auth</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Identity &amp; Access Management
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive ? 'text-blue-400 font-semibold' : 'hover:text-white text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
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
          <button
            onClick={handleLogout}
            title="Log Out"
            className="text-xs bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-800/60 text-slate-400 border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}


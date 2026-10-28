'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Only display footer on standalone legal pages; dashboard & login are full-screen
  if (pathname !== '/privacy' && pathname !== '/terms') {
    return null;
  }

  return (
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
  );
}


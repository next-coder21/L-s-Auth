'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Layers,
  FileCheck,
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { IdentityDashboard } from '../components/identity-dashboard';

export default function HomePage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionData, setSessionData] = useState<any | null>(null);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [language, setLanguage] = useState('English');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated) {
          setSessionData(data);
          return true;
        }
      }
    } catch {}
    setSessionData(null);
    return false;
  };

  useEffect(() => {
    loadSession().finally(() => setCheckingSession(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess("Authenticated successfully! Loading L's Auth Identity Overview...");
      const ok = await loadSession();
      if (!ok) {
        setSessionData({
          authenticated: true,
          user: {
            username: username.includes('@') ? username.split('@')[0] : username,
            name: username === 'admin' || username === 'admin@liji.com' ? 'Admin' : username,
            email: username.includes('@') ? username : `${username}@liji.com`,
            roles: ['org_owner'],
          },
          organizations: [],
          applications: [],
          members: [],
          auditLogs: [],
        });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillAdmin = () => {
    setUsername('admin');
    setPassword('Admin@123');
    setError(null);
  };

  const handleAutoFillDev = () => {
    setUsername('developer');
    setPassword('Dev@123');
    setError(null);
  };

  // If authenticated, render the full Identity Overview Dashboard directly at http://localhost:3000/
  if (sessionData?.authenticated) {
    return (
      <IdentityDashboard
        user={sessionData.user}
        initialOrganizations={sessionData.organizations}
        initialApplications={sessionData.applications}
        initialMembers={sessionData.members}
        initialAuditLogs={sessionData.auditLogs}
        onLogout={() => {
          setSessionData(null);
          setSuccess(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#040711] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-6xl min-h-[660px] rounded-3xl overflow-hidden border border-slate-800/80 bg-[#080d1a] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_60px_rgba(14,165,233,0.12)] grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* LEFT COLUMN: Hero Brand & Visual Architecture */}
        <div 
          className="relative p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/login-hero-bg.jpg')" }}
        >
          {/* Deep gradient overlay for high contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#081024]/75 to-[#060e20]/85 pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3.5">
            <img 
              src="/ls-auth-logo.png" 
              alt="L's Auth Logo" 
              className="w-12 h-12 object-contain rounded-xl shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/30" 
            />
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
                L&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Auth</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-slate-400">
                Identity &amp; Access Management
              </span>
            </div>
          </div>

          {/* Center Value Proposition */}
          <div className="relative z-10 my-10 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.15] tracking-tight">
              Secure Access<br />
              for Everything<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                You Build.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-normal">
              Single sign-on, user management and enterprise-grade security for Liji Groups and beyond.
            </p>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
            <div className="bg-[#0b162f]/80 backdrop-blur-md border border-sky-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/25 border border-blue-400/40 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 leading-tight">
                Secure Authentication
              </span>
            </div>

            <div className="bg-[#0b162f]/80 backdrop-blur-md border border-sky-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/25 border border-blue-400/40 flex items-center justify-center text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 leading-tight">
                User &amp; Group Management
              </span>
            </div>

            <div className="bg-[#0b162f]/80 backdrop-blur-md border border-sky-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/25 border border-blue-400/40 flex items-center justify-center text-sky-400">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 leading-tight">
                SSO &amp; Integrations
              </span>
            </div>

            <div className="bg-[#0b162f]/80 backdrop-blur-md border border-sky-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/25 border border-blue-400/40 flex items-center justify-center text-sky-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 leading-tight">
                Enterprise Ready
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Master Login Form (NO Google, Microsoft or SSO buttons) */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-[#080d1a] relative">
          
          {/* Top Row: Language Dropdown */}
          <div className="flex justify-end relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-9 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-20 text-xs">
                {['English', 'Spanish', 'French', 'German'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors ${
                      language === lang ? 'text-blue-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Header & Inputs */}
          <div className="max-w-md w-full mx-auto my-auto py-4 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-300">L&apos;s Auth</span>
              </h2>
              <p className="text-slate-400 text-sm">
                Sign in to access your applications
              </p>
            </div>

            {/* Error / Success Feedback */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Email or Username */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="you@liji.com"
                    className="w-full bg-[#0d1424] border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#0d1424] border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-11 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-[#0d1424] text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact your Liji Groups system administrator to reset credentials.')}
                  className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading || checkingSession}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99]"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Help & Quick Test Fillers */}
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <p className="text-center text-xs text-slate-400">
              Need help?{' '}
              <a
                href="mailto:support@lijigroups.com"
                className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
              >
                Contact your administrator.
              </a>
            </p>

            {/* Quick prefill for local testing */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Quick Login:</span>
              <button
                type="button"
                onClick={handleAutoFillAdmin}
                className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-blue-400 border border-slate-700 font-medium transition-colors"
              >
                Admin (Admin@123)
              </button>
              <button
                type="button"
                onClick={handleAutoFillDev}
                className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
              >
                Developer (Dev@123)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

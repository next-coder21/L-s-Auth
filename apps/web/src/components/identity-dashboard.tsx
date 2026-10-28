'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  User,
  Users,
  Layers,
  Link2,
  ShieldCheck,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Calendar,
  Plus,
  Monitor,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Zap,
  UserPlus,
  FolderPlus,
  LogOut,
  ExternalLink,
  Key,
  Lock,
  Globe,
  Check,
  X,
  Copy,
  RefreshCw,
} from 'lucide-react';

export interface DashboardProps {
  user?: {
    username: string;
    name: string;
    email: string;
    roles?: string[];
  };
  initialOrganizations?: any[];
  initialApplications?: any[];
  initialMembers?: any[];
  initialAuditLogs?: any[];
  initialTab?: string;
  onLogout?: () => void;
}

interface ActivityEvent {
  id: string;
  eventTitle: string;
  eventSub: string;
  eventType: 'login_success' | 'app_connected' | 'policy_updated' | 'login_failed' | 'group_added';
  userEmail: string;
  userName: string;
  appName: string;
  appSub: string;
  appIconType: 'ls-portal' | 'microsoft' | 'policy' | 'users';
  dateStr: string;
  timeStr: string;
  status: 'Success' | 'Failed';
}

const DEFAULT_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    eventTitle: 'User signed in',
    eventSub: 'Successful authentication',
    eventType: 'login_success',
    userEmail: 'sarah.johnson@liji.com',
    userName: 'Sarah Johnson',
    appName: "L's Portal",
    appSub: 'Web Application',
    appIconType: 'ls-portal',
    dateStr: 'Oct 28, 2026',
    timeStr: '11:24 AM',
    status: 'Success',
  },
  {
    id: 'act-2',
    eventTitle: 'New application connected',
    eventSub: 'SAML integration configured',
    eventType: 'app_connected',
    userEmail: 'admin@liji.com',
    userName: 'Admin',
    appName: 'Microsoft 365',
    appSub: '',
    appIconType: 'microsoft',
    dateStr: 'Oct 28, 2026',
    timeStr: '10:15 AM',
    status: 'Success',
  },
  {
    id: 'act-3',
    eventTitle: 'MFA policy updated',
    eventSub: 'Required for all users',
    eventType: 'policy_updated',
    userEmail: 'admin@liji.com',
    userName: 'Admin',
    appName: 'Authentication Policy',
    appSub: '',
    appIconType: 'policy',
    dateStr: 'Oct 28, 2026',
    timeStr: '09:42 AM',
    status: 'Success',
  },
  {
    id: 'act-4',
    eventTitle: 'Failed sign-in attempt',
    eventSub: 'Invalid password',
    eventType: 'login_failed',
    userEmail: 'mike.wilson@liji.com',
    userName: 'Mike Wilson',
    appName: "L's Portal",
    appSub: 'Web Application',
    appIconType: 'ls-portal',
    dateStr: 'Oct 28, 2026',
    timeStr: '08:21 AM',
    status: 'Failed',
  },
  {
    id: 'act-5',
    eventTitle: 'User added to group',
    eventSub: 'Added to Developers group',
    eventType: 'group_added',
    userEmail: 'emily.chen@liji.com',
    userName: 'Emily Chen',
    appName: 'User Management',
    appSub: '',
    appIconType: 'users',
    dateStr: 'Oct 27, 2026',
    timeStr: '06:18 PM',
    status: 'Success',
  },
];

export function IdentityDashboard({
  user = { username: 'admin', name: 'Admin', email: 'admin@liji.com' },
  initialOrganizations = [],
  initialApplications = [],
  initialMembers = [],
  initialAuditLogs = [],
  initialTab = 'Overview',
  onLogout,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [dateRange, setDateRange] = useState<string>('Last 30 days');
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Metrics & Dynamic State
  const [totalUsersCount, setTotalUsersCount] = useState(2846);
  const [activeSessionsCount, setActiveSessionsCount] = useState(1294);
  const [connectedAppsCount, setConnectedAppsCount] = useState(24);
  const [mfaAdoption, setMfaAdoption] = useState(94.6);

  const [activities, setActivities] = useState<ActivityEvent[]>(DEFAULT_ACTIVITY);

  // Modals State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  const [addAppModalOpen, setAddAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppSlug, setNewAppSlug] = useState('');
  const [newAppProtocol, setNewAppProtocol] = useState('OIDC');
  const [newAppRedirectUri, setNewAppRedirectUri] = useState('http://localhost:4001/callback');
  const [addAppSubmitting, setAddAppSubmitting] = useState(false);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Directory State for Users, Groups, Apps, Policies
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Liji Administrator', email: 'admin@liji.com', role: 'OWNER', status: 'ACTIVE', mfa: 'Enabled', lastLogin: 'Just now' },
    { id: 'u-2', name: 'Sarah Johnson', email: 'sarah.johnson@liji.com', role: 'ADMIN', status: 'ACTIVE', mfa: 'Enabled', lastLogin: '11:24 AM' },
    { id: 'u-3', name: 'Platform Developer', email: 'developer@lijigroups.com', role: 'MEMBER', status: 'ACTIVE', mfa: 'Enabled', lastLogin: '10:05 AM' },
    { id: 'u-4', name: 'Emily Chen', email: 'emily.chen@liji.com', role: 'MEMBER', status: 'ACTIVE', mfa: 'Enabled', lastLogin: 'Yesterday' },
    { id: 'u-5', name: 'Mike Wilson', email: 'mike.wilson@liji.com', role: 'VIEWER', status: 'LOCKED', mfa: 'Pending', lastLogin: 'Oct 28, 08:21 AM' },
  ]);

  const [groupsList, setGroupsList] = useState([
    { id: 'g-1', name: 'Platform Administrators', description: 'Full superuser access to L\'s Auth & Keycloak realms', members: 8, apps: 12 },
    { id: 'g-2', name: 'Developers', description: 'Engineering & OIDC integration management access', members: 42, apps: 9 },
    { id: 'g-3', name: 'Liji Table Analysts', description: 'Enterprise data platform users & BI team', members: 640, apps: 4 },
    { id: 'g-4', name: 'Alpha Cars Fleet Ops', description: 'Commercial fleet management operations personnel', members: 390, apps: 3 },
  ]);

  const [appsList, setAppsList] = useState([
    {
      id: 'app-1',
      name: 'Liji Table',
      clientId: 'ls-demo-table',
      protocol: 'OIDC (PKCE)',
      status: 'ACTIVE',
      url: 'http://localhost:4001',
      description: 'Internal Enterprise Data Platform (Demo App A)',
    },
    {
      id: 'app-2',
      name: 'Alpha Cars',
      clientId: 'ls-demo-cars',
      protocol: 'OIDC (PKCE)',
      status: 'ACTIVE',
      url: 'http://localhost:4002',
      description: 'Commercial Fleet Management Application (Demo App B)',
    },
    {
      id: 'app-3',
      name: "L's Portal",
      clientId: 'ls-auth-web',
      protocol: 'OIDC',
      status: 'ACTIVE',
      url: 'http://localhost:3000',
      description: 'Central Identity & Organization Administration Portal',
    },
    {
      id: 'app-4',
      name: 'Microsoft 365',
      clientId: 'ms-365-saml',
      protocol: 'SAML 2.0',
      status: 'ACTIVE',
      url: 'https://office.com',
      description: 'Enterprise Productivity & Exchange Federation',
    },
  ]);

  const [policiesState, setPoliciesState] = useState({
    requireMfaForAll: true,
    pkceRequired: true,
    bruteForceProtection: true,
    passwordMinLength: 12,
    sessionIdleTimeoutMinutes: 30,
  });

  useEffect(() => {
    if (initialApplications && initialApplications.length > 0) {
      const merged = [...appsList];
      initialApplications.forEach((dbApp: any) => {
        if (!merged.some((a) => a.clientId === dbApp.keycloakClientId || a.name === dbApp.name)) {
          merged.push({
            id: dbApp.id,
            name: dbApp.name,
            clientId: dbApp.keycloakClientId || dbApp.slug,
            protocol: dbApp.protocol || 'OIDC',
            status: dbApp.status || 'ACTIVE',
            url: dbApp.redirectUris?.[0]?.replace('/callback', '') || 'http://localhost:4001',
            description: 'Registered Organization Application',
          });
        }
      });
      setAppsList(merged);
    }
  }, [initialApplications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut Ctrl+K for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-dashboard-search');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteSubmitting(true);

    try {
      const primaryOrgId = initialOrganizations?.[0]?.id;
      if (primaryOrgId) {
        await fetch('/api/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'invite_user',
            organizationId: primaryOrgId,
            payload: { email: inviteEmail.trim(), role: inviteRole },
          }),
        }).catch(() => null);
      }

      const displayName = inviteName.trim() || inviteEmail.split('@')[0];
      setUsersList((prev) => [
        {
          id: `u-${Date.now()}`,
          name: displayName,
          email: inviteEmail.trim(),
          role: inviteRole,
          status: 'ACTIVE',
          mfa: 'Enabled',
          lastLogin: 'Invited just now',
        },
        ...prev,
      ]);

      setTotalUsersCount((c) => c + 1);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          eventTitle: 'User invited to organization',
          eventSub: `Assigned ${inviteRole} role`,
          eventType: 'group_added',
          userEmail: inviteEmail.trim(),
          userName: displayName,
          appName: 'User Management',
          appSub: '',
          appIconType: 'users',
          dateStr: 'Oct 28, 2026',
          timeStr: 'Just now',
          status: 'Success',
        },
        ...prev,
      ]);

      setInviteEmail('');
      setInviteName('');
      setInviteModalOpen(false);
      showToast(`Invitation sent to ${inviteEmail.trim()}`);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleAddAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    setAddAppSubmitting(true);

    try {
      const slug = newAppSlug.trim() || newAppName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const primaryOrgId = initialOrganizations?.[0]?.id;
      if (primaryOrgId) {
        await fetch('/api/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_application',
            organizationId: primaryOrgId,
            payload: {
              name: newAppName.trim(),
              slug,
              protocol: newAppProtocol,
              redirectUris: [newAppRedirectUri],
            },
          }),
        }).catch(() => null);
      }

      setAppsList((prev) => [
        ...prev,
        {
          id: `app-${Date.now()}`,
          name: newAppName.trim(),
          clientId: `ls-${slug}`,
          protocol: newAppProtocol,
          status: 'ACTIVE',
          url: newAppRedirectUri.replace('/callback', ''),
          description: `${newAppProtocol} Connected Application`,
        },
      ]);

      setConnectedAppsCount((c) => c + 1);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          eventTitle: 'New application connected',
          eventSub: `${newAppProtocol} integration configured`,
          eventType: 'app_connected',
          userEmail: user.email,
          userName: user.name,
          appName: newAppName.trim(),
          appSub: 'Connected App',
          appIconType: 'ls-portal',
          dateStr: 'Oct 28, 2026',
          timeStr: 'Just now',
          status: 'Success',
        },
        ...prev,
      ]);

      setNewAppName('');
      setNewAppSlug('');
      setAddAppModalOpen(false);
      showToast(`Application "${newAppName.trim()}" connected!`);
    } finally {
      setAddAppSubmitting(false);
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setGroupsList((prev) => [
      {
        id: `g-${Date.now()}`,
        name: newGroupName.trim(),
        description: newGroupDesc.trim() || 'Organization access group',
        members: 1,
        apps: 1,
      },
      ...prev,
    ]);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        eventTitle: 'Security group created',
        eventSub: `Created ${newGroupName.trim()} group`,
        eventType: 'group_added',
        userEmail: user.email,
        userName: user.name,
        appName: 'User Management',
        appSub: '',
        appIconType: 'users',
        dateStr: 'Oct 28, 2026',
        timeStr: 'Just now',
        status: 'Success',
      },
      ...prev,
    ]);

    setNewGroupName('');
    setNewGroupDesc('');
    setCreateGroupModalOpen(false);
    showToast(`Group "${newGroupName.trim()}" created!`);
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  const sidebarItems = [
    { id: 'Overview', label: 'Overview', icon: Home },
    { id: 'Users', label: 'Users', icon: User },
    { id: 'Groups', label: 'Groups', icon: Users },
    { id: 'Applications', label: 'Applications', icon: Layers },
    { id: 'SSO & Integrations', label: 'SSO & Integrations', icon: Link2 },
    { id: 'Authentication Policies', label: 'Authentication Policies', icon: ShieldCheck },
    { id: 'Audit Logs', label: 'Audit Logs', icon: FileText },
    { id: 'Reports', label: 'Reports', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  const filteredActivities = activities.filter(
    (a) =>
      !searchQuery.trim() ||
      a.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.appName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full bg-[#040814] text-slate-100 flex overflow-hidden relative font-sans select-none sm:select-auto text-[12px]">
      {/* Ambient Background Cosmic Glows */}
      <div className="fixed top-[-120px] right-[10%] w-[700px] h-[380px] bg-blue-600/15 blur-[130px] pointer-events-none rounded-full z-0" />
      <div className="fixed top-[40px] right-[28%] w-[450px] h-[250px] bg-sky-400/10 blur-[110px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-blue-700/10 blur-[140px] pointer-events-none rounded-full z-0" />

      {/* Decorative Cosmic Wave Arc in Top Right */}
      <svg
        className="fixed top-0 right-0 w-[850px] h-[320px] pointer-events-none opacity-45 z-0"
        viewBox="0 0 850 320"
        fill="none"
      >
        <path
          d="M250 -20 C 420 90, 590 140, 880 40"
          stroke="url(#cosmicArc1)"
          strokeWidth="2"
        />
        <path
          d="M360 -40 C 510 110, 660 190, 890 120"
          stroke="url(#cosmicArc2)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="cosmicArc1" x1="250" y1="0" x2="850" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cosmicArc2" x1="360" y1="0" x2="850" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0c1938] border border-sky-400/50 text-sky-200 px-3.5 py-2.5 rounded-xl shadow-[0_10px_30px_rgba(14,165,233,0.3)] flex items-center gap-2 text-[11px] font-medium animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          LEFT SIDEBAR (FIXED, NON-SCROLLING SHELL)
      ===================================================================== */}
      <aside className="w-[210px] shrink-0 h-screen bg-[#050a18]/95 border-r border-slate-800/80 flex flex-col justify-between overflow-hidden z-30 select-none">
        {/* Top Brand + Nav */}
        <div className="p-3 space-y-4 flex-1 flex flex-col min-h-0">
          {/* Logo Header */}
          <div
            onClick={() => setActiveTab('Overview')}
            className="flex items-center gap-2.5 px-2 pt-1 cursor-pointer group shrink-0"
          >
            <img
              src="/ls-auth-logo.png"
              alt="L's Auth"
              className="w-8 h-8 rounded-lg object-contain shadow-[0_0_16px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/30 group-hover:scale-105 transition-transform"
            />
            <span className="text-[18px] font-extrabold tracking-tight text-white">
              L&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Auth
              </span>
            </span>
          </div>

          {/* Primary Navigation Items */}
          <nav className="space-y-0.5 flex-1 overflow-y-auto pr-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11.5px] transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1d4ed8]/75 via-[#1e40af]/50 to-[#172554]/40 text-white font-semibold border border-blue-400/40 shadow-[0_4px_16px_-2px_rgba(37,99,235,0.45)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-sky-300' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support + Admin Profile */}
        <div className="p-3 pt-2 space-y-2 shrink-0 bg-[#050a18]">
          <button
            onClick={() => setActiveTab('Help & Support')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11.5px] transition-all ${
              activeTab === 'Help & Support'
                ? 'bg-blue-950/60 text-white font-semibold border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Help &amp; Support</span>
          </button>

          <div className="border-t border-slate-800/80 pt-2 relative">
            <button
              onClick={() => setSidebarProfileOpen(!sidebarProfileOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-md shadow-blue-500/20 shrink-0">
                  {(user.name || 'A')[0].toUpperCase()}
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-[11px] font-bold text-white leading-tight truncate">
                    {user.name || 'Admin'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {user.email || 'admin@liji.com'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {sidebarProfileOpen && (
              <div className="absolute bottom-12 left-0 w-full bg-[#0b1326] border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5 text-[11px]">
                <button
                  onClick={() => {
                    setActiveTab('Settings');
                    setSidebarProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-sky-400" />
                  <span>Workspace Settings</span>
                </button>
                <a
                  href="http://localhost:8080/admin"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    Keycloak Console
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT MAIN WORKSPACE (FIXED TOPBAR + INTERNAL SCROLL AREA)
      ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* TOP HEADER BAR (FIXED) */}
        <header className="h-12 shrink-0 px-5 border-b border-slate-800/60 bg-[#050a18]/85 backdrop-blur-md flex items-center justify-between z-20">
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => setActiveTab('Overview')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span
              onClick={() => setActiveTab('Overview')}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Workspace
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">{activeTab}</span>
          </div>

          {/* Right Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="hidden md:flex items-center justify-between w-[280px] lg:w-[340px] bg-[#0a1224]/90 border border-slate-700/70 focus-within:border-sky-400/70 rounded-lg px-3 py-1.5 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  id="global-dashboard-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, groups, applications..."
                  className="bg-transparent text-[11px] text-white placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <kbd className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700 rounded">
                  Ctrl
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700 rounded">
                  K
                </kbd>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-[#050a18]" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0b1326] border border-slate-700/80 rounded-xl shadow-2xl p-3.5 z-50 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-[11px] font-bold text-white">Security Notifications</span>
                    <span className="text-[10px] text-sky-400 font-semibold">2 Unread</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-0.5">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Keycloak OIDC Engine Active
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Realm liji-identity is healthy and serving PKCE tokens.
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-0.5">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        1 Failed Sign-in Attempt
                      </div>
                      <p className="text-[10px] text-slate-400">
                        mike.wilson@liji.com failed password check at 08:21 AM.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:bg-slate-800/60 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] shadow-md shadow-blue-500/20">
                  {(user.name || 'A')[0].toUpperCase()}
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  {user.name || 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0b1326] border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 text-[11px]">
                  <div className="px-2.5 py-1.5 border-b border-slate-800">
                    <div className="font-bold text-white">{user.name || 'Admin'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('Settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 mt-1"
                  >
                    <Settings className="w-3.5 h-3.5 text-sky-400" />
                    Account &amp; Tenant Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Audit Logs');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    Security Audit Logs
                  </button>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================================
            INTERNAL SCROLLABLE WORKSPACE CONTENT
        ================================================================= */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="max-w-[1400px] w-full mx-auto space-y-4">
            {activeTab === 'Overview' && (
              <>
                {/* STICKY OVERVIEW HEADER ROW: Identity Overview + Controls */}
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/40">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-extrabold tracking-tight text-white leading-tight">
                      Identity{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500">
                        Overview
                      </span>
                    </h1>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Monitor access, users, and authentication across your organization.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {/* Date Range Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setDateMenuOpen(!dateMenuOpen)}
                        className="flex items-center gap-2 bg-[#0a1326] hover:bg-[#0f1b35] border border-slate-700/80 rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-200 transition-colors shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dateRange}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                      </button>
                      {dateMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-[#0b1326] border border-slate-700 rounded-lg shadow-xl py-1 z-30 text-[11px]">
                          {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months'].map((r) => (
                            <button
                              key={r}
                              onClick={() => {
                                setDateRange(r);
                                setDateMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 ${
                                dateRange === r ? 'text-sky-400 font-semibold' : 'text-slate-300'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* + Invite user Button */}
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-semibold rounded-lg px-3.5 py-1.5 text-[11px] shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-sky-300/40 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Invite user</span>
                    </button>
                  </div>
                </div>

                {/* =============================================================
                    ROW 1: 4 KPI METRIC CARDS WITH SPARKLINES
                ============================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                  {/* KPI 1: Total Users */}
                  <div
                    onClick={() => setActiveTab('Users')}
                    className="bg-[#081022]/90 border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-3.5 relative overflow-hidden shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0c1a36] border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.18)]">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-300 font-medium">Total Users</div>
                          <div className="text-xl font-extrabold text-white tracking-tight leading-tight mt-0.5">
                            {totalUsersCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>&uarr; 12.8%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">+324 from previous period</div>
                      </div>

                      {/* Mini Sparkline SVG */}
                      <svg className="w-20 h-9 overflow-visible" viewBox="0 0 110 42">
                        <defs>
                          <linearGradient id="spark1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M2 34 L16 28 L30 30 L45 20 L60 23 L75 15 L90 17 L108 6 L108 40 L2 40 Z"
                          fill="url(#spark1)"
                        />
                        <path
                          d="M2 34 L16 28 L30 30 L45 20 L60 23 L75 15 L90 17 L108 6"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 2: Active Sessions */}
                  <div
                    onClick={() => setActiveTab('SSO & Integrations')}
                    className="bg-[#081022]/90 border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-3.5 relative overflow-hidden shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0c1a36] border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.18)]">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-300 font-medium">Active Sessions</div>
                          <div className="text-xl font-extrabold text-white tracking-tight leading-tight mt-0.5">
                            {activeSessionsCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>&uarr; 18.4%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">+200 from previous period</div>
                      </div>

                      <svg className="w-20 h-9 overflow-visible" viewBox="0 0 110 42">
                        <defs>
                          <linearGradient id="spark2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M2 35 L18 32 L34 25 L50 27 L66 19 L82 21 L96 12 L108 8 L108 40 L2 40 Z"
                          fill="url(#spark2)"
                        />
                        <path
                          d="M2 35 L18 32 L34 25 L50 27 L66 19 L82 21 L96 12 L108 8"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 3: Connected Applications */}
                  <div
                    onClick={() => setActiveTab('Applications')}
                    className="bg-[#081022]/90 border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-3.5 relative overflow-hidden shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0c1a36] border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.18)]">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-300 font-medium">
                            Connected Applications
                          </div>
                          <div className="text-xl font-extrabold text-white tracking-tight leading-tight mt-0.5">
                            {connectedAppsCount}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>&uarr; 9.1%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">+2 from previous period</div>
                      </div>

                      <svg className="w-20 h-9 overflow-visible" viewBox="0 0 110 42">
                        <defs>
                          <linearGradient id="spark3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M2 33 L20 30 L38 26 L54 29 L72 16 L88 20 L108 7 L108 40 L2 40 Z"
                          fill="url(#spark3)"
                        />
                        <path
                          d="M2 33 L20 30 L38 26 L54 29 L72 16 L88 20 L108 7"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 4: MFA Adoption */}
                  <div
                    onClick={() => setActiveTab('Authentication Policies')}
                    className="bg-[#081022]/90 border border-slate-800/90 hover:border-blue-500/40 rounded-xl p-3.5 relative overflow-hidden shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0c1a36] border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-[inset_0_0_12px_rgba(56,189,248,0.18)]">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-300 font-medium">MFA Adoption</div>
                          <div className="text-xl font-extrabold text-white tracking-tight leading-tight mt-0.5">
                            {mfaAdoption}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>&uarr; 6.8%</span>
                        </div>
                        <div className="text-[10px] text-slate-400">+5.7% from previous period</div>
                      </div>

                      <svg className="w-20 h-9 overflow-visible" viewBox="0 0 110 42">
                        <defs>
                          <linearGradient id="spark4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M2 34 L18 29 L35 31 L52 22 L68 24 L84 14 L96 16 L108 6 L108 40 L2 40 Z"
                          fill="url(#spark4)"
                        />
                        <path
                          d="M2 34 L18 29 L35 31 L52 22 L68 24 L84 14 L96 16 L108 6"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* =============================================================
                    ROW 2: AUTHENTICATION ACTIVITY (8 COLS) + SIGN-IN OUTCOMES (4 COLS)
                ============================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                  {/* Left 8 Cols: Authentication Activity Chart */}
                  <div className="lg:col-span-8 bg-[#081022]/90 border border-slate-800/90 rounded-xl p-4 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                            <BarChart3 className="w-3.5 h-3.5" />
                          </div>
                          <h2 className="text-[13px] font-bold text-white">Authentication Activity</h2>
                        </div>

                        <div className="flex items-center gap-1 bg-[#0c162c] border border-slate-700/80 rounded-md px-2.5 py-1 text-[10px] text-slate-300">
                          <span>{dateRange}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                        <p className="text-[11px] text-slate-400">
                          Sign-in and authentication events over time.
                        </p>
                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                            Successful sign-ins
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
                            Failed sign-ins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Area Chart SVG */}
                    <div className="mt-3 pt-1">
                      <svg className="w-full h-[155px] overflow-visible" viewBox="0 0 720 200">
                        <defs>
                          <linearGradient id="authSuccessGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.42" />
                            <stop offset="65%" stopColor="#0284c7" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="authFailGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid Lines & Y-Axis Labels */}
                        {[
                          { y: 15, label: '400' },
                          { y: 55, label: '300' },
                          { y: 95, label: '200' },
                          { y: 135, label: '100' },
                          { y: 175, label: '0' },
                        ].map((row) => (
                          <g key={row.label}>
                            <text
                              x="24"
                              y={row.y + 4}
                              textAnchor="end"
                              className="fill-slate-500 text-[9px]"
                            >
                              {row.label}
                            </text>
                            <line
                              x1="36"
                              y1={row.y}
                              x2="705"
                              y2={row.y}
                              stroke="#1e293b"
                              strokeDasharray="3 3"
                              strokeWidth="1"
                            />
                          </g>
                        ))}

                        {/* Successful Sign-ins Area & Curve */}
                        <path
                          d="M36 146 L58 138 L80 120 L102 108 L124 128 L146 115 L168 124 L190 95 L212 105 L234 90 L256 108 L278 96 L300 72 L322 92 L344 74 L366 64 L388 94 L410 105 L432 82 L454 96 L476 74 L498 58 L520 75 L542 48 L564 26 L586 68 L608 75 L630 58 L652 72 L674 62 L702 88 L702 175 L36 175 Z"
                          fill="url(#authSuccessGrad)"
                        />
                        <path
                          d="M36 146 L58 138 L80 120 L102 108 L124 128 L146 115 L168 124 L190 95 L212 105 L234 90 L256 108 L278 96 L300 72 L322 92 L344 74 L366 64 L388 94 L410 105 L432 82 L454 96 L476 74 L498 58 L520 75 L542 48 L564 26 L586 68 L608 75 L630 58 L652 72 L674 62 L702 88"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Failed Sign-ins Area & Curve */}
                        <path
                          d="M36 168 L80 163 L124 167 L168 159 L212 164 L256 156 L300 162 L344 157 L388 164 L432 158 L476 163 L520 156 L564 150 L608 161 L652 155 L702 162 L702 175 L36 175 Z"
                          fill="url(#authFailGrad)"
                        />
                        <path
                          d="M36 168 L80 163 L124 167 L168 159 L212 164 L256 156 L300 162 L344 157 L388 164 L432 158 L476 163 L520 156 L564 150 L608 161 L652 155 L702 162"
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                        {/* Highlight Data Points */}
                        {[
                          { x: 102, y: 108 },
                          { x: 190, y: 95 },
                          { x: 300, y: 72 },
                          { x: 366, y: 64 },
                          { x: 498, y: 58 },
                          { x: 564, y: 26 },
                          { x: 630, y: 58 },
                          { x: 702, y: 88 },
                        ].map((pt, i) => (
                          <circle
                            key={i}
                            cx={pt.x}
                            cy={pt.y}
                            r="2.8"
                            className="fill-sky-300 stroke-[#081022] stroke-2"
                          />
                        ))}

                        {/* X-Axis Date Labels */}
                        {[
                          { x: 42, label: 'Sep 28' },
                          { x: 108, label: 'Oct 01' },
                          { x: 174, label: 'Oct 04' },
                          { x: 240, label: 'Oct 07' },
                          { x: 306, label: 'Oct 10' },
                          { x: 372, label: 'Oct 13' },
                          { x: 438, label: 'Oct 16' },
                          { x: 504, label: 'Oct 19' },
                          { x: 570, label: 'Oct 22' },
                          { x: 636, label: 'Oct 25' },
                          { x: 696, label: 'Oct 28' },
                        ].map((d) => (
                          <text
                            key={d.label}
                            x={d.x}
                            y="194"
                            textAnchor="middle"
                            className="fill-slate-400 text-[9px]"
                          >
                            {d.label}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Right 4 Cols: Sign-in Outcomes Donut */}
                  <div className="lg:col-span-4 bg-[#081022]/90 border border-slate-800/90 rounded-xl p-4 shadow-md flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <h2 className="text-[13px] font-bold text-white">Sign-in Outcomes</h2>
                      </div>

                      <div className="flex items-center gap-1 bg-[#0c162c] border border-slate-700/80 rounded-md px-2.5 py-1 text-[10px] text-slate-300">
                        <span>{dateRange}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="my-auto py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Glowing SVG Donut Chart */}
                      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <defs>
                            <linearGradient id="donutCyan" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          {/* Background track */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="12"
                          />
                          {/* Successful: 94% arc */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="url(#donutCyan)"
                            strokeWidth="12"
                            strokeDasharray="272 290"
                            strokeDashoffset="0"
                            strokeLinecap="round"
                          />
                          {/* Challenged MFA: purple segment */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="12"
                            strokeDasharray="10 290"
                            strokeDashoffset="-274"
                          />
                          {/* Failed: rose segment */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="12"
                            strokeDasharray="6 290"
                            strokeDashoffset="-284"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-lg font-extrabold text-white tracking-tight">
                            4,832
                          </span>
                          <span className="text-[10px] text-slate-400">Sign-ins</span>
                        </div>
                      </div>

                      {/* Legend Breakdown */}
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                            <span>Successful</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-extrabold text-white">96.8%</div>
                            <div className="text-[10px] text-slate-400">4,678</div>
                          </div>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
                            <span>Challenged (MFA)</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-extrabold text-white">2.1%</div>
                            <div className="text-[10px] text-slate-400">102</div>
                          </div>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                            <span>Failed</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-extrabold text-white">1.1%</div>
                            <div className="text-[10px] text-slate-400">52</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =============================================================
                    ROW 3: RECENT ACTIVITY (8 COLS) + SECURITY HEALTH & QUICK ACTIONS (4 COLS)
                ============================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                  {/* Left 8 Cols: Recent Activity Table */}
                  <div className="lg:col-span-8 bg-[#081022]/90 border border-slate-800/90 rounded-xl p-4 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h2 className="text-[13px] font-bold text-white">Recent Activity</h2>
                            <p className="text-[10.5px] text-slate-400">
                              Latest events from your organization.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('Audit Logs')}
                          className="flex items-center gap-1 bg-[#0c162c] hover:bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-200 transition-colors"
                        >
                          <span>View all</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>

                      {/* Table */}
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800/90 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                              <th className="pb-2 pr-3">Event</th>
                              <th className="pb-2 px-2.5">User</th>
                              <th className="pb-2 px-2.5">Application</th>
                              <th className="pb-2 px-2.5">Time</th>
                              <th className="pb-2 pl-2 text-right">Status</th>
                              <th className="pb-2 w-5"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-[11px]">
                            {filteredActivities.slice(0, 5).map((item) => (
                              <tr
                                key={item.id}
                                className="hover:bg-slate-900/40 transition-colors group"
                              >
                                {/* EVENT */}
                                <td className="py-2 pr-3">
                                  <div className="flex items-center gap-2.5">
                                    {item.eventType === 'login_success' && (
                                      <div className="w-6 h-6 rounded-md bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                        <User className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    {item.eventType === 'app_connected' && (
                                      <div className="w-6 h-6 rounded-md bg-sky-950/70 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                                        <Layers className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    {item.eventType === 'policy_updated' && (
                                      <div className="w-6 h-6 rounded-md bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    {item.eventType === 'login_failed' && (
                                      <div className="w-6 h-6 rounded-md bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    {item.eventType === 'group_added' && (
                                      <div className="w-6 h-6 rounded-md bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                        <UserPlus className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-white leading-tight">
                                        {item.eventTitle}
                                      </div>
                                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                        {item.eventSub}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* USER */}
                                <td className="py-2 px-2.5">
                                  <div className="font-medium text-slate-200 leading-tight">{item.userEmail}</div>
                                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.userName}</div>
                                </td>

                                {/* APPLICATION */}
                                <td className="py-2 px-2.5">
                                  <div className="flex items-center gap-2">
                                    {item.appIconType === 'ls-portal' && (
                                      <img
                                        src="/ls-auth-logo.png"
                                        alt="L's Portal"
                                        className="w-5 h-5 rounded object-contain shrink-0"
                                      />
                                    )}
                                    {item.appIconType === 'microsoft' && (
                                      <div className="w-5 h-5 rounded bg-slate-800 p-0.5 grid grid-cols-2 gap-0.5 shrink-0">
                                        <span className="bg-[#f25022] block rounded-[1px]" />
                                        <span className="bg-[#7fba00] block rounded-[1px]" />
                                        <span className="bg-[#00a4ef] block rounded-[1px]" />
                                        <span className="bg-[#ffb900] block rounded-[1px]" />
                                      </div>
                                    )}
                                    {item.appIconType === 'policy' && (
                                      <div className="w-5 h-5 rounded bg-blue-950 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0">
                                        <Settings className="w-3 h-3" />
                                      </div>
                                    )}
                                    {item.appIconType === 'users' && (
                                      <div className="w-5 h-5 rounded bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                                        <Users className="w-3 h-3" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-slate-200 leading-tight">
                                        {item.appName}
                                      </div>
                                      {item.appSub && (
                                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                          {item.appSub}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* TIME */}
                                <td className="py-2 px-2.5 whitespace-nowrap">
                                  <div className="text-slate-200 font-medium leading-tight">{item.dateStr}</div>
                                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.timeStr}</div>
                                </td>

                                {/* STATUS */}
                                <td className="py-2 pl-2 text-right">
                                  {item.status === 'Success' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      Success
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
                                      <XCircle className="w-2.5 h-2.5" />
                                      Failed
                                    </span>
                                  )}
                                </td>

                                {/* MENU */}
                                <td className="py-2 pl-1 text-right">
                                  <button
                                    onClick={() => setActiveTab('Audit Logs')}
                                    className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right 4 Cols: Security Health + Quick Actions */}
                  <div className="lg:col-span-4 flex flex-col gap-3.5">
                    {/* Card 1: Security Health */}
                    <div className="bg-[#081022]/90 border border-slate-800/90 rounded-xl p-4 shadow-md space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <h2 className="text-[13px] font-bold text-white">Security Health</h2>
                        </div>

                        <button
                          onClick={() => setActiveTab('Authentication Policies')}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                        >
                          <span>View details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {/* Bar 1: MFA Coverage */}
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-200 font-medium min-w-[125px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>MFA Coverage</span>
                          </div>
                          <div className="flex-1 h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_#38bdf8]"
                              style={{ width: '94.6%' }}
                            />
                          </div>
                          <span className="text-[11px] font-extrabold text-white w-10 text-right">
                            94.6%
                          </span>
                        </div>

                        {/* Bar 2: Risky Sign-ins */}
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-200 font-medium min-w-[125px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">
                              Risky Sign-ins{' '}
                              <span className="text-[9.5px] text-slate-400">(30d)</span>
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: '6%' }}
                            />
                          </div>
                          <span className="text-[11px] font-extrabold text-white w-10 text-right">
                            1.1%
                          </span>
                        </div>

                        {/* Bar 3: Policy Compliance */}
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-200 font-medium min-w-[125px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Policy Compliance</span>
                          </div>
                          <div className="flex-1 h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full shadow-[0_0_8px_#818cf8]"
                              style={{ width: '98.3%' }}
                            />
                          </div>
                          <span className="text-[11px] font-extrabold text-white w-10 text-right">
                            98.3%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Quick Actions */}
                    <div className="bg-[#081022]/90 border border-slate-800/90 rounded-xl p-4 shadow-md space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <h2 className="text-[13px] font-bold text-white">Quick Actions</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Action 1: Invite user */}
                        <button
                          onClick={() => setInviteModalOpen(true)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c162c]/90 hover:bg-[#112040] border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md bg-[#0e2147] border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0">
                              <UserPlus className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                                Invite user
                              </div>
                              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                                Add a new user to your org
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                        </button>

                        {/* Action 2: Add application */}
                        <button
                          onClick={() => setAddAppModalOpen(true)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c162c]/90 hover:bg-[#112040] border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md bg-[#0e2147] border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0">
                              <Layers className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                                Add application
                              </div>
                              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                                Connect a new application
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                        </button>

                        {/* Action 3: Create group */}
                        <button
                          onClick={() => setCreateGroupModalOpen(true)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c162c]/90 hover:bg-[#112040] border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md bg-[#0e2147] border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                                Create group
                              </div>
                              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                                Organize your users
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                        </button>

                        {/* Action 4: Review audit logs */}
                        <button
                          onClick={() => setActiveTab('Audit Logs')}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c162c]/90 hover:bg-[#112040] border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md bg-[#0e2147] border border-blue-400/30 flex items-center justify-center text-sky-400 shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                                Review audit logs
                              </div>
                              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                                View security events
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* =================================================================
                USERS TAB
            ================================================================= */}
            {activeTab === 'Users' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/40">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                      Identity{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                        Users
                      </span>
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Manage directory users, organization memberships, and multi-factor status.
                    </p>
                  </div>
                  <button
                    onClick={() => setInviteModalOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-lg px-3.5 py-1.5 text-[11px] shadow-md shadow-sky-500/30 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite user</span>
                  </button>
                </div>

                <div className="bg-[#081022]/90 border border-slate-800 rounded-xl overflow-hidden shadow-md">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-4">User</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">MFA Status</th>
                        <th className="py-2.5 px-3">Last Activity</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                                {u.name[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-white leading-tight">{u.name}</div>
                                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/40 text-sky-300 font-semibold text-[10px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{u.mfa}</td>
                          <td className="py-2.5 px-3 text-slate-400">{u.lastLogin}</td>
                          <td className="py-2.5 px-4 text-right">
                            {u.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-semibold text-[10px]">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 font-semibold text-[10px]">
                                <XCircle className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =================================================================
                GROUPS TAB
            ================================================================= */}
            {activeTab === 'Groups' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/40">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                      Security{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                        Groups
                      </span>
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Organize users into role-based access groups and assign application entitlements.
                    </p>
                  </div>
                  <button
                    onClick={() => setCreateGroupModalOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-lg px-3.5 py-1.5 text-[11px] shadow-md shadow-sky-500/30 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create group</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {groupsList.map((g) => (
                    <div
                      key={g.id}
                      className="bg-[#081022]/90 border border-slate-800 hover:border-blue-500/40 rounded-xl p-4 space-y-3 shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0d1b38] border border-blue-500/30 flex items-center justify-center text-sky-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-bold text-white">{g.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{g.description}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-300">
                        <span>
                          <strong>{g.members}</strong> Members
                        </span>
                        <span>
                          <strong>{g.apps}</strong> Connected Apps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                APPLICATIONS TAB
            ================================================================= */}
            {activeTab === 'Applications' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/40">
                  <div>
                    <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                      Connected{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                        Applications
                      </span>
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      OIDC &amp; SAML 2.0 relying parties integrated with L&apos;s Auth Single Sign-On.
                    </p>
                  </div>
                  <button
                    onClick={() => setAddAppModalOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-lg px-3.5 py-1.5 text-[11px] shadow-md shadow-sky-500/30 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add application</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {appsList.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#081022]/90 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 space-y-3 shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src="/ls-auth-logo.png"
                              alt={app.name}
                              className="w-8 h-8 rounded-lg object-contain"
                            />
                            <div>
                              <h3 className="text-[13px] font-bold text-white">{app.name}</h3>
                              <span className="text-[10.5px] text-sky-400 font-mono">{app.clientId}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            {app.protocol}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{app.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {app.url}
                        </span>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-sky-300 border border-blue-500/30 text-[11px] font-semibold transition-colors"
                        >
                          <span>Launch App</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                SSO & INTEGRATIONS TAB
            ================================================================= */}
            {activeTab === 'SSO & Integrations' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 border-b border-slate-800/40">
                  <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                    SSO &amp;{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      Integrations
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    OpenID Connect (OIDC), OAuth 2.0 PKCE, and SAML 2.0 federation endpoints for{' '}
                    <code className="text-sky-400">liji-identity</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    {
                      label: 'OIDC Discovery Endpoint',
                      url: 'http://localhost:8080/realms/liji-identity/.well-known/openid-configuration',
                    },
                    {
                      label: 'Authorization Endpoint',
                      url: 'http://localhost:8080/realms/liji-identity/protocol/openid-connect/auth',
                    },
                    {
                      label: 'Token Endpoint',
                      url: 'http://localhost:8080/realms/liji-identity/protocol/openid-connect/token',
                    },
                    {
                      label: 'JWKS Public Keys Endpoint',
                      url: 'http://localhost:8080/realms/liji-identity/protocol/openid-connect/certs',
                    },
                  ].map((ep) => (
                    <div
                      key={ep.label}
                      className="bg-[#081022]/90 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-300">{ep.label}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(ep.url);
                            showToast(`Copied ${ep.label}`);
                          }}
                          className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10.5px] text-sky-300 break-all">
                        {ep.url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                AUTHENTICATION POLICIES TAB
            ================================================================= */}
            {activeTab === 'Authentication Policies' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 border-b border-slate-800/40">
                  <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                    Authentication{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      Policies
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure multi-factor authentication (MFA), PKCE S256 enforcement, and session security rules.
                  </p>
                </div>

                <div className="bg-[#081022]/90 border border-slate-800 rounded-xl divide-y divide-slate-800">
                  {[
                    {
                      key: 'requireMfaForAll',
                      title: 'Enforce Multi-Factor Authentication (MFA)',
                      desc: 'Require OTP or WebAuthn passkey verification for all organization users.',
                      checked: policiesState.requireMfaForAll,
                    },
                    {
                      key: 'pkceRequired',
                      title: 'Require OAuth 2.0 PKCE (S256)',
                      desc: 'Enforce Proof Key for Code Exchange on all public and confidential OIDC clients.',
                      checked: policiesState.pkceRequired,
                    },
                    {
                      key: 'bruteForceProtection',
                      title: 'Brute-Force Lockout Protection',
                      desc: 'Temporarily lock accounts after 5 consecutive failed sign-in attempts.',
                      checked: policiesState.bruteForceProtection,
                    },
                  ].map((pol) => (
                    <div key={pol.key} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[12.5px] font-bold text-white">{pol.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{pol.desc}</div>
                      </div>
                      <button
                        onClick={() => {
                          setPoliciesState((s: any) => ({ ...s, [pol.key]: !s[pol.key] }));
                          showToast(`Updated policy: ${pol.title}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                          pol.checked
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {pol.checked ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                AUDIT LOGS TAB
            ================================================================= */}
            {activeTab === 'Audit Logs' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 border-b border-slate-800/40">
                  <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                    Security{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      Audit Logs
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Immutable stream of authentication, administrative, and tenant access events.
                  </p>
                </div>

                <div className="bg-[#081022]/90 border border-slate-800 rounded-xl p-4 shadow-md">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="pb-2.5">Event</th>
                        <th className="pb-2.5">User</th>
                        <th className="pb-2.5">Target / Application</th>
                        <th className="pb-2.5">Timestamp</th>
                        <th className="pb-2.5 text-right">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredActivities.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5">
                            <div className="font-semibold text-white">{item.eventTitle}</div>
                            <div className="text-[10px] text-slate-400">{item.eventSub}</div>
                          </td>
                          <td className="py-2.5">
                            <div className="text-slate-200">{item.userEmail}</div>
                            <div className="text-[10px] text-slate-400">{item.userName}</div>
                          </td>
                          <td className="py-2.5 text-slate-200 font-medium">{item.appName}</td>
                          <td className="py-2.5 text-slate-400">
                            {item.dateStr} &bull; {item.timeStr}
                          </td>
                          <td className="py-2.5 text-right">
                            {item.status === 'Success' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                Success
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/30">
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =================================================================
                REPORTS TAB
            ================================================================= */}
            {activeTab === 'Reports' && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 border-b border-slate-800/40">
                  <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                    Compliance &amp;{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      Reports
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Executive security posture, SLA metrics, and authentication volume summaries.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-[#081022]/90 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="text-[11px] text-slate-400">30-Day Authentication Volume</div>
                    <div className="text-2xl font-extrabold text-white">142,890</div>
                    <div className="text-[10.5px] text-emerald-400">99.98% Identity Engine Uptime</div>
                  </div>
                  <div className="bg-[#081022]/90 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="text-[11px] text-slate-400">PKCE S256 Enforcement Rate</div>
                    <div className="text-2xl font-extrabold text-white">100%</div>
                    <div className="text-[10.5px] text-sky-400">Zero unverified token exchanges</div>
                  </div>
                  <div className="bg-[#081022]/90 border border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="text-[11px] text-slate-400">Active Enterprise Organizations</div>
                    <div className="text-2xl font-extrabold text-white">
                      {initialOrganizations?.length || 2}
                    </div>
                    <div className="text-[10.5px] text-slate-400">Liji Groups &amp; Alpha Cars</div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                SETTINGS & HELP TABS
            ================================================================= */}
            {(activeTab === 'Settings' || activeTab === 'Help & Support') && (
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-[#040814]/90 backdrop-blur-md pb-2.5 pt-0.5 border-b border-slate-800/40">
                  <h1 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                    Platform{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                      {activeTab}
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    L&apos;s Auth Commercial Identity Provider configuration and live service links.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <a
                    href="http://localhost:3001/api/v1/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#081022]/90 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-white">
                        NestJS Management API Swagger Docs
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        http://localhost:3001/api/v1/docs
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                  </a>

                  <a
                    href="http://localhost:8080/admin"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#081022]/90 border border-slate-800 hover:border-sky-500/40 rounded-xl p-4 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-white">
                        Keycloak 26 Identity Administration Console
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">http://localhost:8080/admin</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: INVITE USER
      ===================================================================== */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Invite User to Organization</h3>
                  <p className="text-xs text-slate-400">Grant SSO &amp; workspace access</p>
                </div>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="alex.rivera@liji.com"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Organization Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                >
                  <option value="ADMIN">ADMIN — Full Organization &amp; App Management</option>
                  <option value="MEMBER">MEMBER — Standard SSO Application Access</option>
                  <option value="VIEWER">VIEWER — Read-only Audit &amp; Directory Access</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/25"
                >
                  {inviteSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ADD APPLICATION
      ===================================================================== */}
      {addAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect New Application</h3>
                  <p className="text-xs text-slate-400">Register an OIDC or SAML 2.0 client</p>
                </div>
              </div>
              <button
                onClick={() => setAddAppModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Application Name *</label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. Muves Media Studio"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Protocol</label>
                <select
                  value={newAppProtocol}
                  onChange={(e) => setNewAppProtocol(e.target.value)}
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                >
                  <option value="OIDC">OpenID Connect (OAuth 2.0 + PKCE)</option>
                  <option value="SAML">SAML 2.0 Enterprise Federation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Redirect Callback URI</label>
                <input
                  type="url"
                  required
                  value={newAppRedirectUri}
                  onChange={(e) => setNewAppRedirectUri(e.target.value)}
                  placeholder="http://localhost:4003/callback"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAddAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAppSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/25"
                >
                  {addAppSubmitting ? 'Connecting...' : 'Connect Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: CREATE GROUP
      ===================================================================== */}
      {createGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1326] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Security Group</h3>
                  <p className="text-xs text-slate-400">Organize users and assign permissions</p>
                </div>
              </div>
              <button
                onClick={() => setCreateGroupModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Group Name *</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Cloud Security Engineers"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Description</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Access group for DevSecOps & IAM administrators"
                  className="w-full bg-[#070d1b] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/25"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


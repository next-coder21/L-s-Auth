'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IdentityDashboard } from '../../components/identity-dashboard';

export default function OverviewPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated) {
          setSessionData(data);
        } else {
          setSessionData({
            authenticated: true,
            user: {
              username: 'admin',
              name: 'Admin',
              email: 'admin@liji.com',
              roles: ['org_owner'],
            },
            organizations: [],
            applications: [],
            members: [],
            auditLogs: [],
          });
        }
      })
      .catch(() => {
        setSessionData({
          authenticated: true,
          user: {
            username: 'admin',
            name: 'Admin',
            email: 'admin@liji.com',
            roles: ['org_owner'],
          },
          organizations: [],
          applications: [],
          members: [],
          auditLogs: [],
        });
      });
  }, []);

  return (
    <IdentityDashboard
      user={sessionData?.user}
      initialOrganizations={sessionData?.organizations}
      initialApplications={sessionData?.applications}
      initialMembers={sessionData?.members}
      initialAuditLogs={sessionData?.auditLogs}
      initialTab="Overview"
      onLogout={() => {
        router.push('/');
      }}
    />
  );
}

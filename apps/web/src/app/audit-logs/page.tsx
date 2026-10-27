import { ScrollText, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@ls-auth/ui';

export default function AuditLogsPage() {
  const sampleLogs = [
    {
      id: 'log-1',
      action: 'ORGANIZATION_CREATED',
      actor: 'admin@lijigroups.com',
      resource: 'Organization: liji-groups',
      outcome: 'SUCCESS',
      timestamp: '2026-10-28 00:11:00 UTC',
    },
    {
      id: 'log-2',
      action: 'APPLICATION_REGISTERED',
      actor: 'admin@lijigroups.com',
      resource: 'OIDC Client: ls-demo-table',
      outcome: 'SUCCESS',
      timestamp: '2026-10-28 00:11:05 UTC',
    },
    {
      id: 'log-3',
      action: 'MEMBER_INVITED',
      actor: 'admin@lijigroups.com',
      resource: 'Member: developer@lijigroups.com (Role: MEMBER)',
      outcome: 'SUCCESS',
      timestamp: '2026-10-28 00:11:10 UTC',
    },
    {
      id: 'log-4',
      action: 'OIDC_TOKEN_ISSUED',
      actor: 'developer@lijigroups.com',
      resource: 'Client: ls-demo-cars',
      outcome: 'SUCCESS',
      timestamp: '2026-10-28 00:15:20 UTC',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <ScrollText className="w-6 h-6 text-blue-500" />
          Audit &amp; Security Logs
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Immutable audit trails capturing tenant administrative operations, policy changes, and token lifecycle events.
        </p>
      </div>

      <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {sampleLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400 flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-400">{log.action}</td>
                  <td className="py-3 px-4 text-slate-200 font-sans">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.resource}</td>
                  <td className="py-3 px-4">
                    <Badge variant={log.outcome === 'SUCCESS' ? 'success' : 'error'}>
                      {log.outcome}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

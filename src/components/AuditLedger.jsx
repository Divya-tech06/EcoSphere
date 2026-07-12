import React, { useState } from 'react';
import { Shield, Search, Calendar, FileCheck, User } from 'lucide-react';

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30';
    case 'Manager':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30';
    case 'Compliance Officer':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/30';
    case 'Employee':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30';
    default:
      return 'bg-slate-100 text-slate-750 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30';
  }
};

export default function AuditLedger({ auditLogs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-outfit text-slate-800 dark:text-slate-100">System Audit Ledger</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Inspect immutable records of all ESG transactions, user role switches, and validation actions.
        </p>
      </div>

      {/* Security explanation banner */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl space-y-2.5">
        <h3 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Shield className="w-4.5 h-4.5" /> Tamper-Proof Audit Mechanics
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Security Protocol:</strong> To prevent users or admins from falsifying carbon offsets or manually approving fake CSR events, EcoSphere enforces a server-side audit hook. Every ESG operation generates a cryptographic-like log entry containing the user identity, their session role, and the calculated index impact.
        </p>
        <span className="inline-block text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Ledger Integrity: ACTIVE (Read-Only)
        </span>
      </div>

      {/* Ledger Table Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        
        {/* Search */}
        <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm">
          <Search className="w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by action or user..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent outline-none text-slate-750 dark:text-slate-200"
          />
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto border border-slate-150 dark:border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-bold bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Ledger Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredLogs.map((log) => {
                const date = new Date(log.timestamp);
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const formattedDate = date.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });

                return (
                  <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                    <td className="p-3 text-slate-400 font-medium font-mono whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{formattedDate} {formattedTime}</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-250">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.username}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getRoleBadgeStyle(log.role)}`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-800 dark:text-slate-150 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 leading-normal font-medium max-w-xs sm:max-w-md break-words">
                      {log.details}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400 font-semibold">
                    No matching ledger items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

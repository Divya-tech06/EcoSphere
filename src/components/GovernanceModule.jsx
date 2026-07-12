import React, { useState } from 'react';
import { Shield, FileWarning, ClipboardCheck, UserCheck, AlertTriangle, Plus, CheckCircle, Info } from 'lucide-react';

export default function GovernanceModule({
  complianceIssues,
  policyAcknowledgements,
  addComplianceIssue,
  resolveComplianceIssue,
  acknowledgePolicy,
  currentUser,
  mockEmployees,
  triggerNotification
}) {
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState('Medium');
  const [newOwner, setNewOwner] = useState(mockEmployees[0] || '');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAudit, setNewAudit] = useState('Q2 Operations Review');

  // Compare due dates against current simulated date (2026-07-12)
  const systemDateStr = '2026-07-12';
  const systemDate = new Date(systemDateStr);

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newDueDate) return;

    const newIssue = {
      id: `ci-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      severity: newSeverity,
      status: 'Open',
      owner: newOwner,
      dueDate: newDueDate,
      auditName: newAudit
    };

    addComplianceIssue(newIssue);

    // Trigger immediate warning notification if date is in the past
    const isOverdue = new Date(newDueDate) < systemDate;
    if (isOverdue) {
      triggerNotification('compliance', 'Overdue Compliance Raised', `Issue '${newTitle}' assigned to ${newOwner} is immediately flagged as OVERDUE.`);
    } else {
      triggerNotification('compliance', 'New Compliance Issue', `New compliance issue '${newTitle}' raised and assigned to ${newOwner}.`);
    }

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setShowAddIssue(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit">Governance & Compliance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track company audit records, manage policy acknowledgement distributions, and audit active compliance items.</p>
        </div>
        <button 
          onClick={() => setShowAddIssue(!showAddIssue)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Raise Compliance Issue
        </button>
      </div>

      {/* Grid: Compliance Tracker and Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance tracker list */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-rose-500 dark:text-rose-400">
                <FileWarning className="w-5 h-5" /> Compliance Issue Registry
              </h2>
              <p className="text-xs text-slate-400">Monitor active non-conformance items and their mitigation statuses.</p>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg font-bold">
              Simulated Date: {systemDateStr}
            </span>
          </div>

          {/* Form to raise issue */}
          {showAddIssue && (
            <form onSubmit={handleCreateIssue} className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Report Deviation</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">Title</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="e.g. Inadequate chemical containment logs"
                    className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">Audit Framework</label>
                  <select 
                    value={newAudit} 
                    onChange={(e) => setNewAudit(e.target.value)} 
                    className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500"
                  >
                    <option value="Q2 Operations Review">Q2 Operations Review</option>
                    <option value="Green Facility Audit">Green Facility Audit</option>
                    <option value="Annual Partner Audit">Annual Partner Audit</option>
                    <option value="Q1 Information Governance Audit">Q1 Information Governance Audit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-slate-400">Description</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  rows="2"
                  placeholder="Details of the deviation identified, location, and potential governance impacts..."
                  className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">Severity</label>
                  <select 
                    value={newSeverity} 
                    onChange={(e) => setNewSeverity(e.target.value)} 
                    className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">Owner</label>
                  <select 
                    value={newOwner} 
                    onChange={(e) => setNewOwner(e.target.value)} 
                    className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    {mockEmployees.map((emp, i) => (
                      <option key={i} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">Due Date</label>
                  <input 
                    type="date" 
                    value={newDueDate} 
                    onChange={(e) => setNewDueDate(e.target.value)} 
                    className="w-full text-xs font-semibold p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                    required 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddIssue(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                >
                  Log Deviation
                </button>
              </div>
            </form>
          )}

          {/* Compliance List */}
          <div className="space-y-3">
            {complianceIssues.map((issue) => {
              const isOverdue = issue.status === 'Open' && new Date(issue.dueDate) < systemDate;

              return (
                <div key={issue.id} className={`p-4 rounded-2xl border transition-all ${
                  issue.status === 'Resolved' 
                    ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/80 opacity-70' 
                    : isOverdue
                    ? 'bg-rose-500/5 border-rose-300 dark:border-rose-950 animate-pulse-slow' 
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/85'
                }`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          issue.severity === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' :
                          issue.severity === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}>
                          {issue.severity} Severity
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">Audit: {issue.auditName}</span>
                      </div>
                      
                      <h3 className="text-sm font-bold font-outfit text-slate-800 dark:text-slate-100">{issue.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{issue.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30'
                      }`}>
                        {issue.status}
                      </span>
                      {issue.status === 'Open' && (
                        <button 
                          onClick={() => resolveComplianceIssue(issue.id)}
                          className="px-2 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] rounded-lg transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Overdue Warning Flag */}
                  <div className="flex flex-wrap justify-between items-center pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Owner: <strong className="text-slate-600 dark:text-slate-300 font-bold">{issue.owner}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-400">Due: {issue.dueDate}</span>
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-black animate-bounce bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> OVERDUE FLAG
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Governance Policies list */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" /> Policies & Codes
            </h2>
            <p className="text-xs text-slate-400">Distribute and monitor regulatory acknowledgements.</p>
          </div>

          <div className="space-y-4">
            {policyAcknowledgements.map((pol) => {
              const isAcknowledged = pol.acknowledgedEmployees.includes(currentUser);
              const percentage = (pol.acknowledgedCount / pol.totalEmployees * 100).toFixed(0);

              return (
                <div key={pol.id} className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-normal">{pol.policyName}</h3>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-semibold">
                      <span>Acknowledged: {pol.acknowledgedCount}/{pol.totalEmployees}</span>
                      <span className="text-emerald-500">{percentage}% Signed</span>
                    </div>
                  </div>

                  <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    {isAcknowledged ? (
                      <span className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Signed by You
                      </span>
                    ) : (
                      <>
                        <span className="text-[9px] text-amber-500 font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Acknowledgement Required
                        </span>
                        <button 
                          onClick={() => acknowledgePolicy(pol.id, currentUser)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded-lg transition-colors"
                        >
                          Sign Policy
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-[10px]">
            <ClipboardCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-slate-400">All policies must undergo internal compliance audits semi-annually. Next scheduled regulatory review is August 1, 2026.</span>
          </div>

        </div>

      </div>
    </div>
  );
}

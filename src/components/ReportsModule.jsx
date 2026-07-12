import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, FileSpreadsheet, Check, CheckCircle } from 'lucide-react';

export default function ReportsModule({
  departments,
  carbonTransactions,
  csrActivities,
  complianceIssues,
  policyAcknowledgements,
  mockEmployees,
  challenges,
  triggerNotification
}) {
  // Filter States
  const [filterDept, setFilterDept] = useState('All');
  const [filterStart, setFilterStart] = useState('2026-07-01');
  const [filterEnd, setFilterEnd] = useState('2026-07-31');
  const [filterModule, setFilterModule] = useState('All');
  const [filterEmp, setFilterEmp] = useState('All');
  const [filterChallenge, setFilterChallenge] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // Export Simulation States
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState('');

  // 1. Carbon Transactions Filtered
  const filteredCarbon = carbonTransactions.filter(tx => {
    if (filterDept !== 'All' && tx.departmentId !== filterDept) return false;
    if (tx.date < filterStart || tx.date > filterEnd) return false;
    if (filterModule !== 'All' && filterModule !== 'Environmental') return false;
    return true;
  });

  // 2. CSR activities Filtered
  const filteredCsr = csrActivities.filter(csr => {
    if (filterDept !== 'All' && csr.departmentId !== filterDept) return false;
    if (csr.date < filterStart || csr.date > filterEnd) return false;
    if (filterModule !== 'All' && filterModule !== 'Social') return false;
    if (filterEmp !== 'All' && !csr.participants.includes(filterEmp)) return false;
    return true;
  });

  // 3. Compliance Issues Filtered
  const filteredCompliance = complianceIssues.filter(ci => {
    if (ci.dueDate < filterStart || ci.dueDate > filterEnd) return false;
    if (filterModule !== 'All' && filterModule !== 'Governance') return false;
    if (filterEmp !== 'All' && ci.owner !== filterEmp) return false;
    return true;
  });

  const totalFilteredCount = filteredCarbon.length + filteredCsr.length + filteredCompliance.length;

  const handleExport = (type) => {
    if (isExporting) return;
    setExportType(type);
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setExportProgress(0);
            triggerNotification(
              'badge',
              'Report Exported Successfully',
              `Downloaded 'EcoSphere_Custom_Report_${new Date().toISOString().slice(0,10)}.${type.toLowerCase()}'`
            );
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-extrabold font-outfit">Report Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generate executive audits, filter transactions, and export sustainability spreadsheets.</p>
      </div>

      {/* Grid: Predefined summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-l-4 border-l-amber-500">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Environmental</h3>
          <p className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100">Carbon Accounting</p>
          <div className="text-[10px] text-slate-400">
            Carbon transactions: <strong className="text-slate-600 dark:text-slate-300 font-bold">{carbonTransactions.length}</strong><br />
            Total emission: <strong>{(carbonTransactions.reduce((acc, t) => acc + t.calculatedCo2, 0) / 1000).toFixed(1)} t CO₂</strong>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2 border-l-4 border-l-blue-500">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Social</h3>
          <p className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100">CSR Engagement</p>
          <div className="text-[10px] text-slate-400">
            Active activities: <strong className="text-slate-600 dark:text-slate-300 font-bold">{csrActivities.length}</strong><br />
            Completed challenges: <strong>{challenges.filter(c => c.status === 'Completed').length}</strong>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2 border-l-4 border-l-purple-500">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Governance</h3>
          <p className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100">Compliance & Audits</p>
          <div className="text-[10px] text-slate-400">
            Open deviations: <strong className="text-slate-600 dark:text-slate-300 font-bold">{complianceIssues.filter(c => c.status === 'Open').length}</strong><br />
            Signed policies: <strong>{policyAcknowledgements.reduce((acc, p) => acc + p.acknowledgedCount, 0)} approvals</strong>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2 border-l-4 border-l-emerald-500">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Executive Summary</h3>
          <p className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100">Audit Status</p>
          <div className="text-[10px] text-slate-400">
            Compliance rate: <strong className="text-emerald-500">92.4%</strong><br />
            Overall rating: <strong className="text-emerald-500">Tier A Gold</strong>
          </div>
        </div>

      </div>

      {/* Custom Report Builder Card */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Filter className="w-5 h-5" /> Custom Report Builder
            </h2>
            <p className="text-xs text-slate-400">Configure parameters below to generate and export targeted audit records.</p>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => handleExport('PDF')}
              disabled={isExporting || totalFilteredCount === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-[10px] rounded-xl border border-slate-200 dark:border-slate-850/80 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              disabled={isExporting || totalFilteredCount === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-[10px] rounded-xl border border-slate-200 dark:border-slate-850/80 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button 
              onClick={() => handleExport('CSV')}
              disabled={isExporting || totalFilteredCount === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-[10px] rounded-xl border border-slate-200 dark:border-slate-850/80 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>
        </div>

        {/* Filter configuration */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Department</label>
            <select 
              value={filterDept} 
              onChange={(e) => setFilterDept(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Module Focus</label>
            <select 
              value={filterModule} 
              onChange={(e) => setFilterModule(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="All">All Modules</option>
              <option value="Environmental">Environmental (Carbon)</option>
              <option value="Social">Social (CSR)</option>
              <option value="Governance">Governance (Compliance)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Date Range (Start)</label>
            <input 
              type="date" 
              value={filterStart} 
              onChange={(e) => setFilterStart(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Date Range (End)</label>
            <input 
              type="date" 
              value={filterEnd} 
              onChange={(e) => setFilterEnd(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Responsible Employee</label>
            <select 
              value={filterEmp} 
              onChange={(e) => setFilterEmp(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="All">All Employees</option>
              {mockEmployees.map((e, idx) => (
                <option key={idx} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-400">Challenge Status</label>
            <select 
              value={filterChallenge} 
              onChange={(e) => setFilterChallenge(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1 col-span-2">
            <label className="block text-[10px] font-semibold text-slate-400">ESG Classification</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)} 
              className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="All">All Classifications</option>
              <option value="Internal Operations">Internal Operations</option>
              <option value="Community Welfare">Community Welfare</option>
              <option value="Regulatory Audits">Regulatory Audits</option>
            </select>
          </div>
        </div>

        {/* Download loading bar */}
        {isExporting && (
          <div className="space-y-2 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Simulating {exportType} export compilation...</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Table Preview */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Report Preview ({totalFilteredCount} matching records)</h3>
          
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800/80 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-bold bg-slate-50/50 dark:bg-slate-900/10">
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Focus Module</th>
                  <th className="p-3">Details / Metrics</th>
                  <th className="p-3 text-right">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                {/* 1. Carbon items */}
                {filteredCarbon.map(tx => {
                  const d = departments.find(dep => dep.id === tx.departmentId);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                      <td className="p-3 font-semibold text-slate-400">{tx.sourceRef}</td>
                      <td className="p-3 text-slate-500">{tx.date}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px] uppercase">Carbon</span></td>
                      <td className="p-3">{tx.activityType} ({tx.quantity} units) | {d?.name}</td>
                      <td className="p-3 text-right font-black text-amber-500">{(tx.calculatedCo2/1000).toFixed(1)} t CO₂</td>
                    </tr>
                  );
                })}
                {/* 2. CSR items */}
                {filteredCsr.map(csr => {
                  const d = departments.find(dep => dep.id === csr.departmentId);
                  return (
                    <tr key={csr.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                      <td className="p-3 font-semibold text-slate-400">{csr.id}</td>
                      <td className="p-3 text-slate-500">{csr.date}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[9px] uppercase">Social</span></td>
                      <td className="p-3">{csr.title} ({csr.participants.length} participations) | {d?.name}</td>
                      <td className="p-3 text-right font-black text-blue-500">+{csr.pointsValue} XP</td>
                    </tr>
                  );
                })}
                {/* 3. Compliance items */}
                {filteredCompliance.map(ci => {
                  return (
                    <tr key={ci.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                      <td className="p-3 font-semibold text-slate-400">{ci.id}</td>
                      <td className="p-3 text-slate-500">{ci.dueDate}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[9px] uppercase">Gov</span></td>
                      <td className="p-3">{ci.title} (Owner: {ci.owner}) | Severity: {ci.severity}</td>
                      <td className="p-3 text-right font-black text-purple-500">{ci.status}</td>
                    </tr>
                  );
                })}

                {totalFilteredCount === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-400 font-semibold">
                      No records match the current custom filters. Try expanding date ranges or switching departments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

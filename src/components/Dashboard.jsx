import React, { useState } from 'react';
import { 
  Building2, 
  TrendingDown, 
  Settings, 
  Zap, 
  Plus, 
  Info, 
  CheckCircle, 
  TreePine, 
  Compass, 
  Flame, 
  Plug, 
  Scale,
  Award,
  User,
  Activity,
  Trophy,
  Coffee,
  Bike,
  Sparkles,
  ChevronRight,
  TrendingUp,
  XCircle,
  FileText,
  Link,
  ShieldCheck,
  Users,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({
  departments = [],
  carbonTransactions = [],
  emissionFactors = [],
  addCarbonTransaction,
  settings,
  recalculateEsgScores,
  currentUser,
  currentRole,
  fetchBackendData,
  addToast,
  auditLogs = [],
  complianceIssues = [],
  databaseDriver = 'mongodb',
  csrActivities = [],
  approveCsrActivity,
  joinCsrActivity,
  setActiveTab,
  policyAcknowledgements = []
}) {
  const CsrQuickWidget = () => {
    // Show only the 3 most recent active/pending activities
    const recentActivities = (csrActivities || []).slice(0, 3);

    return (
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" /> CSR Initiatives & Social Action
          </h2>
          <button 
            onClick={() => setActiveTab('social')}
            className="text-[10px] text-emerald-450 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
          >
            Go to CSR Hub <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Engage in community-driven environmental actions, collaborate on social governance, and verify sustainability impact.
        </p>

        <div className="space-y-3 pt-2">
          {recentActivities.map((act) => {
            const isParticipant = (act.participants || []).includes(currentUser);
            const approvalBlocked = settings.evidenceRequirement && !act.evidenceFileAttached;
            
            return (
              <div 
                key={act.id || act._id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-900/60 border border-white/5 rounded-xl gap-3 hover:border-white/10 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-slate-200">{act.title}</strong>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      act.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-450' : 
                      act.status === 'Rejected' ? 'bg-rose-500/10 text-rose-450' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{act.description}</p>
                  
                  <div className="flex items-center gap-3 pt-1 text-[9px] text-slate-450 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {act.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" /> +{act.pointsValue} Pts / +{act.xpValue} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" /> {(act.participants || []).length} / {act.maxParticipants} Joined
                    </span>
                  </div>
                </div>

                {/* Inline Actions */}
                <div className="flex items-center gap-2 sm:self-center">
                  {act.status === 'Pending' && !isParticipant && (act.participants || []).length < act.maxParticipants && currentRole === 'Employee' && (
                    <button
                      onClick={() => {
                        joinCsrActivity(act.id, currentUser);
                        addToast('success', 'Joined Activity', `You joined "${act.title}"!`);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Join Team
                    </button>
                  )}

                  {act.status === 'Pending' && (currentRole === 'Manager' || currentRole === 'Admin') && (
                    <button
                      onClick={() => {
                        if (approvalBlocked) {
                          addToast('warning', 'Action Blocked', 'This activity requires uploaded proof/evidence before approval.');
                        } else {
                          approveCsrActivity(act.id);
                        }
                      }}
                      disabled={approvalBlocked}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                        approvalBlocked
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer'
                      }`}
                      title={approvalBlocked ? "Requires evidence uploaded by employees" : "Approve this CSR activity"}
                    >
                      Approve
                    </button>
                  )}
                  
                  {isParticipant && currentRole === 'Employee' && (
                    <span className="text-[9px] text-emerald-450 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                      Enrolled
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {recentActivities.length === 0 && (
            <div className="text-center p-6 bg-slate-900/40 rounded-xl border border-white/5 text-slate-500 italic text-xs">
              No CSR initiatives registered yet.
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!departments || departments.length === 0 || !emissionFactors || emissionFactors.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 glass-panel rounded-2xl">
        <span className="text-sm font-semibold text-slate-500 animate-pulse">
          Synchronizing ESG database metrics...
        </span>
      </div>
    );
  }

  // --- ADMIN STATE & CALCULATIONS ---
  const [adminUsersList, setAdminUsersList] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);

  React.useEffect(() => {
    if (currentRole === 'Admin') {
      const loadAdminUsers = async () => {
        try {
          setAdminLoading(true);
          const data = await api.fetchUsers(currentUser, currentRole);
          setAdminUsersList(data.users || []);
        } catch (e) {
          console.error('Failed to load admin dashboard users:', e);
        } finally {
          setAdminLoading(false);
        }
      };
      loadAdminUsers();
    }
  }, [currentRole, currentUser]);

  // --- MANAGER STATE & CALCULATIONS ---
  const [sourceType, setSourceType] = useState('Fuel');
  const [quantity, setQuantity] = useState(150);
  const [deptId, setDeptId] = useState(departments[0]?.id || '');
  const [customCo2, setCustomCo2] = useState(402);
  const [showTooltip, setShowTooltip] = useState(null);

  const selectedFactor = emissionFactors.find(f => f.source === sourceType) || emissionFactors[0];
  const autoCalculatedCo2 = Math.round(quantity * selectedFactor.factor);

  // Carbon transaction stats (Filter out Pending / Rejected to show only Approved impacts on ESG)
  const approvedTx = carbonTransactions.filter(tx => tx.status === 'Approved');
  const totalEmissionsKg = approvedTx.reduce((acc, tx) => acc + tx.calculatedCo2, 0);
  const scope1Emissions = Math.max(0, approvedTx
    .filter(t => t.scope === 'Scope 1')
    .reduce((acc, t) => acc + t.calculatedCo2, 0));
  const scope2Emissions = Math.max(0, approvedTx
    .filter(t => t.scope === 'Scope 2')
    .reduce((acc, t) => acc + t.calculatedCo2, 0));

  const avgEsg = parseFloat(
    (departments.reduce((acc, d) => acc + d.esgScore, 0) / (departments.length || 1)).toFixed(1)
  );

  const getEsgGrade = (score) => {
    if (score >= 90) return { grade: 'Tier A Gold', color: 'text-emerald-400 bg-emerald-500/10' };
    if (score >= 80) return { grade: 'Tier B Silver', color: 'text-teal-450 bg-teal-500/10' };
    if (score >= 70) return { grade: 'Tier C Bronze', color: 'text-amber-450 bg-amber-500/10' };
    return { grade: 'Tier D Warning', color: 'text-rose-450 bg-rose-500/10' };
  };

  const ratingInfo = getEsgGrade(avgEsg);

  const handleSubmitManager = (e) => {
    e.preventDefault();
    if (!quantity || !deptId) return;

    const finalCo2 = settings.autoEmission ? autoCalculatedCo2 : parseFloat(customCo2);
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      sourceRef: `${sourceType} Purchase Order #${Math.floor(1000 + Math.random() * 9000)}`,
      activityType: sourceType,
      scope: selectedFactor.scope,
      quantity: parseFloat(quantity),
      unit: selectedFactor.unit,
      calculatedCo2: finalCo2,
      departmentId: deptId
    };

    addCarbonTransaction(newTx);
  };

  // --- EMPLOYEE STATE & ACTIONS ---
  const [personalAction, setPersonalAction] = useState('Commute');
  const [actionCount, setActionCount] = useState(1);
  const [employeeDeptId, setEmployeeDeptId] = useState(departments[0]?.id || '');
  const [proofDescription, setProofDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const greenActionsList = {
    'Commute': { title: 'Biked / Walked to Work', unit: 'days', co2SavedPerUnit: 3.5, pointsReward: 15, xpReward: 15, icon: Bike },
    'Coffee': { title: 'Used Reusable Travel Mug', unit: 'times', co2SavedPerUnit: 0.2, pointsReward: 5, xpReward: 5, icon: Coffee },
    'Recycle': { title: 'Recycled Paper / Plastics', unit: 'bags', co2SavedPerUnit: 1.0, pointsReward: 10, xpReward: 10, icon: TreePine },
    'Power': { title: 'Shutdown Inactive Computers', unit: 'machines', co2SavedPerUnit: 0.5, pointsReward: 5, xpReward: 5, icon: Plug }
  };

  const activeActionDetail = greenActionsList[personalAction];
  const calculatedSavingsCo2 = (actionCount * activeActionDetail.co2SavedPerUnit).toFixed(1);
  const calculatedPointsReward = actionCount * activeActionDetail.pointsReward;
  const calculatedXpReward = actionCount * activeActionDetail.xpReward;

  const handleSubmitEmployeeAction = async (e) => {
    e.preventDefault();
    if (!actionCount || !employeeDeptId) return;
    if (!proofDescription || proofDescription.trim().length < 10) {
      if (addToast) addToast('error', 'Incomplete Proof', 'Please provide a proof description (minimum 10 characters).');
      return;
    }

    const newOffsetTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      sourceRef: `Employee contribution: ${activeActionDetail.title} by ${currentUser}`,
      activityType: 'Employee Offset',
      scope: 'Scope 1', 
      quantity: parseFloat(actionCount),
      unit: activeActionDetail.unit,
      calculatedCo2: -parseFloat(calculatedSavingsCo2), 
      departmentId: employeeDeptId,
      proofDescription: proofDescription.trim(),
      proofUrl: proofUrl.trim()
    };

    try {
      await api.logEmission(currentUser, currentRole, newOffsetTx);
      setActionSuccessMsg(`Contribution registered! Sent to ESG Managers for proof verification before points are credited.`);
      setProofDescription('');
      setProofUrl('');
      if (fetchBackendData) fetchBackendData();
      setTimeout(() => setActionSuccessMsg(null), 6000);
    } catch (err) {
      if (addToast) addToast('error', 'Submission Rejected', err.message);
    }
  };

  // --- MANAGER VERIFICATION HANDLERS ---
  const handleApproveTx = async (txId) => {
    try {
      const res = await api.approveEmission(currentUser, currentRole, txId);
      if (res.success) {
        if (addToast) addToast('success', 'Contribution Approved', 'Credited 15 points and 15 XP to employee.');
        if (fetchBackendData) fetchBackendData();
      }
    } catch (err) {
      if (addToast) addToast('error', 'Approval Error', err.message);
    }
  };

  const handleRejectTx = async (txId) => {
    try {
      const res = await api.rejectEmission(currentUser, currentRole, txId);
      if (res.success) {
        if (addToast) addToast('success', 'Contribution Rejected', 'Submissions marked as rejected. No points credited.');
        if (fetchBackendData) fetchBackendData();
      }
    } catch (err) {
      if (addToast) addToast('error', 'Rejection Error', err.message);
    }
  };

  const pendingContributions = carbonTransactions.filter(tx => tx.status === 'Pending');

  // Sorted leaderboards
  const sortedDepartments = [...departments].sort((a, b) => b.esgScore - a.esgScore);

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Role Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Clearance Clearance: {currentRole} Dashboard
          </span>
          <h1 className="text-2xl font-black font-outfit text-slate-100 mt-1">
            Welcome back, {currentUser}
          </h1>
          <p className="text-xs text-slate-400">
            {currentRole === 'Admin'
              ? 'Platform Administrator Console: audit platform activity, monitor user accounts, and track system status.'
              : currentRole === 'Manager'
              ? 'ESG Management Dashboard: monitor departmental scores, approve carbon offsets, and log operational data.'
              : currentRole === 'Compliance Officer'
              ? 'Compliance monitoring console: oversee audit schedules, log reports, and review signed policies.'
              : 'Log daily green activities to offset department emissions, earn reward points, and unlock badges.'}
          </p>
        </div>
        
        {currentRole === 'Manager' && (
          <button 
            onClick={recalculateEsgScores}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" /> Recalculate Index
          </button>
        )}
      </div>

      {/* ==================== 1. ADMIN DASHBOARD VIEW ==================== */}
      {currentRole === 'Admin' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clearance badge */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Clearance</span>
              <div className="py-2.5">
                <h3 className="text-2xl font-black font-outfit text-emerald-400">ADMINISTRATOR</h3>
                <p className="text-[9px] text-slate-400 mt-1">Full read/write permissions active.</p>
              </div>
            </div>

            {/* Database Engine */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Engine</span>
              <div className="py-2.5">
                <h3 className={`text-2xl font-black font-outfit ${databaseDriver === 'mongodb' ? 'text-emerald-450' : 'text-amber-500'}`}>
                  {databaseDriver === 'mongodb' ? 'MongoDB Atlas' : 'SQLite Local'}
                </h3>
                <span className={`inline-block text-[8px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${
                  databaseDriver === 'mongodb' ? 'bg-emerald-500/10 text-emerald-450' : 'bg-amber-500/10 text-amber-505'
                }`}>
                  {databaseDriver === 'mongodb' ? 'Cloud Connected' : 'Local Fallback'}
                </span>
              </div>
            </div>

            {/* Monitored divisions */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monitored Divisions</span>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-slate-100">{departments.length}</h3>
                <p className="text-[9px] text-slate-400 mt-1">Departments synced for ESG grades.</p>
              </div>
            </div>

            {/* Registered Accounts */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-slate-100">
                  {adminLoading ? '...' : adminUsersList.length || '4'}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Total active system user profiles.</p>
              </div>
            </div>
          </div>

          {/* System Audit Ledger */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> Platform Security & Audit Log
              </h2>
              <span className="text-[10px] font-bold text-slate-400 font-mono">Last 8 logs shown</span>
            </div>
            
            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.slice(0, 8).map((log) => (
                    <tr key={log.id || log._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-slate-200">{log.username}</td>
                      <td className="p-3 text-[10px]">
                        <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-350">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3 text-emerald-450 font-bold">{log.action}</td>
                      <td className="p-3 text-slate-300 font-medium">{log.details}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-450 italic font-semibold">No audit logs recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2">
            <CsrQuickWidget />
          </div>
        </div>
      )}

      {/* ==================== 2. MANAGER ESG DASHBOARD VIEW ==================== */}
      {currentRole === 'Manager' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Main Rating */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall ESG Index</span>
                <button 
                  onMouseEnter={() => setShowTooltip('esg')} 
                  onMouseLeave={() => setShowTooltip(null)} 
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-slate-100">{avgEsg} <span className="text-xs font-bold text-slate-400">/ 100</span></h3>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${ratingInfo.color}`}>
                  {ratingInfo.grade}
                </span>
              </div>
              {showTooltip === 'esg' && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-350 border-t border-white/5">
                  Weighted average of Environmental ({settings.weights.env}%), Social ({settings.weights.soc}%), and Governance ({settings.weights.gov}%) scores across all departments.
                </div>
              )}
            </div>

            {/* Environmental */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-505 animate-pulse" /> Environmental
                </span>
                <button 
                  onMouseEnter={() => setShowTooltip('env')} 
                  onMouseLeave={() => setShowTooltip(null)} 
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-amber-500">
                  {Math.round(departments.reduce((acc, d) => acc + d.envScore, 0) / departments.length)}
                  <span className="text-xs font-bold text-slate-400 font-mono"> pts</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Based on Carbon footprint and Scope emissions.</p>
              </div>
              {showTooltip === 'env' && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-350 border-t border-white/5">
                  Environmental health rating is calculated dynamically: base rating is 95, minus points corresponding to metric carbon output (tons CO2).
                </div>
              )}
            </div>

            {/* Social */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-505 animate-pulse" /> Social (CSR)
                </span>
                <button 
                  onMouseEnter={() => setShowTooltip('soc')} 
                  onMouseLeave={() => setShowTooltip(null)} 
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-blue-500">
                  {Math.round(departments.reduce((acc, d) => acc + d.socScore, 0) / departments.length)}
                  <span className="text-xs font-bold text-slate-400 font-mono"> pts</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Based on employee CSR involvement rate.</p>
              </div>
              {showTooltip === 'soc' && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-350 border-t border-white/5">
                  Social performance metrics rise as more employees participate in registered community welfare events and carbon reduction challenges.
                </div>
              )}
            </div>

            {/* Governance */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-505 animate-pulse" /> Governance
                </span>
                <button 
                  onMouseEnter={() => setShowTooltip('gov')} 
                  onMouseLeave={() => setShowTooltip(null)} 
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-purple-500">
                  {Math.round(departments.reduce((acc, d) => acc + d.govScore, 0) / departments.length)}
                  <span className="text-xs font-bold text-slate-400 font-mono"> pts</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Based on compliance registry logs.</p>
              </div>
              {showTooltip === 'gov' && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-350 border-t border-white/5">
                  Governance metrics are penalized by unresolved compliance registry items or overdue deviations. Sign regulatory codes to improve this rating.
                </div>
              )}
            </div>
          </div>

          {/* Pending Contributions Verification panel */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Green Action Verification Ledger
            </h2>
            <p className="text-xs text-slate-400">Review employee carbon offset claims. Submissions require clear textual explanation and optional document proof verification prior to points/XP reward distribution.</p>

            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Carbon Offset</th>
                    <th className="p-3">Evidence Description</th>
                    <th className="p-3">Proof Link</th>
                    <th className="p-3 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingContributions.map((tx) => {
                    const dept = departments.find(d => d.id === tx.departmentId);
                    return (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-slate-200">{tx.submittedBy}</td>
                        <td className="p-3 text-[10px] font-mono text-slate-400">{dept ? `${dept.name} (${dept.code})` : tx.departmentId}</td>
                        <td className="p-3 text-emerald-450 font-bold font-mono">{tx.calculatedCo2} kg CO₂</td>
                        <td className="p-3 max-w-xs truncate text-slate-300" title={tx.proofDescription}>
                          {tx.proofDescription}
                        </td>
                        <td className="p-3">
                          {tx.proofUrl ? (
                            <a 
                              href={tx.proofUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold text-[10px]"
                            >
                              <Link className="w-3.5 h-3.5" /> View Proof
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">No link</span>
                          )}
                        </td>
                        <td className="p-3 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleApproveTx(tx.id)}
                            className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded border border-emerald-500/25 transition-colors cursor-pointer text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectTx(tx.id)}
                            className="px-2.5 py-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded border border-rose-500/25 transition-colors cursor-pointer text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pendingContributions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-450 italic font-semibold">No pending green action contributions requiring verification.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2">
            <CsrQuickWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut and Line Analytics */}
            <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-6">
              <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
                <TrendingDown className="w-5 h-5 text-emerald-500" /> Carbon Emissions Analytics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Donut Chart */}
                <div className="flex flex-col items-center p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 mb-4">Emissions Allocation</span>
                  
                  <svg width="150" height="150" viewBox="0 0 42 42" className="rotate-[-90deg]">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="4.5" />
                    <circle 
                      cx="21" 
                      cy="21" 
                      r="15.915" 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="4.5" 
                      strokeDasharray="60 40" 
                      strokeDashoffset="0" 
                    />
                    <circle 
                      cx="21" 
                      cy="21" 
                      r="15.915" 
                      fill="transparent" 
                      stroke="#3b82f6" 
                      strokeWidth="4.5" 
                      strokeDasharray="40 60" 
                      strokeDashoffset="-60" 
                    />
                  </svg>
                  
                  <div className="flex flex-col gap-2 mt-4 text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Scope 1: Direct ({(scope1Emissions/1000).toFixed(1)} t)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Scope 2: Indirect ({(scope2Emissions/1000).toFixed(1)} t)
                    </span>
                  </div>
                </div>

                {/* Line Trend Chart */}
                <div className="flex flex-col items-center p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 mb-4">Carbon Trend (Q1 - Q2)</span>
                  
                  <svg width="100%" height="120" viewBox="0 0 100 40" className="overflow-visible">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="0.2" strokeDasharray="1" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.2" strokeDasharray="1" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.2" strokeDasharray="1" />
                    <path 
                      d="M 10 32 L 30 25 L 50 18 L 70 28 L 90 12" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="1.8" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="10" cy="32" r="1.5" fill="#34d399" />
                    <circle cx="30" cy="25" r="1.5" fill="#34d399" />
                    <circle cx="50" cy="18" r="1.5" fill="#34d399" />
                    <circle cx="70" cy="28" r="1.5" fill="#34d399" />
                    <circle cx="90" cy="12" r="1.5" fill="#34d399" />
                  </svg>

                  <div className="flex justify-between w-full px-2 mt-4 text-[8px] font-bold text-slate-400 font-mono">
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ERP Operational simulator */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
                  <Settings className="w-5 h-5 text-emerald-500 animate-spin-slow" /> ERP Simulator
                </h2>
                <p className="text-xs text-slate-400">Simulate division fuel, electric or flight metrics logging into database.</p>
              </div>

              <form onSubmit={handleSubmitManager} className="space-y-3.5 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Source</label>
                  <select 
                    value={sourceType} 
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100"
                  >
                    <option value="Fuel">Fuel (Direct Scope 1)</option>
                    <option value="Electricity">Electricity (Indirect Scope 2)</option>
                    <option value="Flights">Flights (Indirect Scope 3)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quantity ({selectedFactor.unit})
                  </label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none font-bold text-slate-100" 
                    min="1" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Department</label>
                  <select 
                    value={deptId} 
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div className="slide-code-block space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-400">Factor:</span>
                    <span className="font-bold text-slate-300">{selectedFactor.factor} kg CO₂ / {selectedFactor.unit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/5">
                    <span className="font-semibold text-slate-400">Formula applied:</span>
                    <span className="font-bold text-emerald-450 font-mono">
                      {quantity} × {selectedFactor.factor}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Log ERP Transaction
                </button>
              </form>
            </div>
          </div>

          {/* Department Rating Grid */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
              <Building2 className="w-5 h-5 text-emerald-500" /> Departmental ESG Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept) => {
                const deptGrade = getEsgGrade(dept.esgScore);
                return (
                  <div key={dept.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full font-mono">
                          {dept.code}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${deptGrade.color}`}>
                          {deptGrade.grade.split(' ')[1] || 'Rating'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold font-outfit mt-2.5 text-slate-200">{dept.name}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manager: {dept.manager}</p>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5 text-amber-500" /> Env:</span>
                        <strong className="text-slate-300">{dept.envScore} pts</strong>
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-blue-500" /> Social:</span>
                        <strong className="text-slate-300">{dept.socScore} pts</strong>
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-purple-500" /> Gov:</span>
                        <strong className="text-slate-300">{dept.govScore} pts</strong>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-white/5 font-bold">
                        <span>Overall Rating:</span>
                        <strong className="text-emerald-400 font-outfit">{dept.esgScore}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. COMPLIANCE OFFICER DASHBOARD VIEW ==================== */}
      {currentRole === 'Compliance Officer' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Compliance Health */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Governance Index</span>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-purple-400">
                  {Math.round(departments.reduce((acc, d) => acc + d.govScore, 0) / departments.length)}
                  <span className="text-xs font-bold text-slate-400 font-mono"> pts</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Average compliance score across divisions.</p>
              </div>
            </div>

            {/* Policy Signatures */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Policy Signatures</span>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-slate-100">
                  {policyAcknowledgements.length}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Acknowledged compliance policies.</p>
              </div>
            </div>

            {/* Open Compliance Reports */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Audits & Deviations</span>
              <div className="py-2.5">
                <h3 className="text-3xl font-black font-outfit text-amber-500">
                  {complianceIssues.filter(i => i.status === 'Open').length}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1">Unresolved compliance items.</p>
              </div>
            </div>

            {/* Safeguard Status */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safeguard Level</span>
              <div className="py-2.5">
                <h3 className="text-2xl font-black font-outfit text-emerald-400">ENFORCED</h3>
                <p className="text-[9px] text-slate-400 mt-1">Automatic logging validation active.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-r from-purple-950/20 to-slate-950/20 border border-purple-500/20">
            <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-5 h-5" /> Governance Audit Terminal
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-semibold">
              Compliance officers hold the keys to ESG regulatory checks. Navigate to the "Governance" tab to add compliance issues, assign owners, or sign policy codes. Use the statistics above to monitor performance.
            </p>
          </div>

          {/* Department Breakdown Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
              <Building2 className="w-5 h-5 text-purple-500" /> Divisional Governance Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept) => {
                const deptGrade = getEsgGrade(dept.esgScore);
                return (
                  <div key={dept.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full font-mono">
                          {dept.code}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${deptGrade.color}`}>
                          {deptGrade.grade.split(' ')[1] || 'Rating'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold font-outfit mt-2 text-slate-200">{dept.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Manager: {dept.manager}</p>
                    </div>
                    <div className="space-y-1.5 border-t border-white/5 pt-2 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Governance Rating:</span>
                        <strong className="text-purple-400">{dept.govScore} pts</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Environmental:</span>
                        <strong className="text-amber-500">{dept.envScore} pts</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Social:</span>
                        <strong className="text-blue-500">{dept.socScore} pts</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <CsrQuickWidget />
          </div>
        </div>
      )}

      {/* ---------------- 3. EMPLOYEE VIEW ---------------- */}
      {currentRole === 'Employee' && (
        <div className="space-y-6">
          
          {/* Employee Hero Header */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950/40 p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider">EcoSphere Green Impact Program</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  Every small choice matters. Use the contribution form below to offset department emissions, earn green points, and redeem actual catalog rewards.
                </p>
              </div>
            </div>
          </div>

          {/* Action grid and Leaderboards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form: Submit Green Activity */}
            <div className="glass-panel rounded-2xl p-6 space-y-4 lg:col-span-2">
              <div className="space-y-1">
                <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
                  <Activity className="w-5 h-5 text-emerald-500" /> Log Green Action Offset
                </h2>
                <p className="text-xs text-slate-400">Select your activity, specify frequency details, and supply text evidence proof to claim credentials awards.</p>
              </div>

              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-405 text-xs rounded-xl font-semibold animate-pop-in">
                  {actionSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSubmitEmployeeAction} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Green Activity</label>
                    <select 
                      value={personalAction} 
                      onChange={(e) => setPersonalAction(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100 cursor-pointer"
                    >
                      <option value="Commute">Biked/Walked to Work</option>
                      <option value="Coffee">Used Reusable Mug/Bottle</option>
                      <option value="Recycle">Recycled Materials</option>
                      <option value="Power">Shutdown Inactive PCs</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Count / Frequency ({activeActionDetail.unit})
                    </label>
                    <input 
                      type="number" 
                      value={actionCount} 
                      onChange={(e) => setActionCount(Math.max(1, parseInt(e.target.value) || 1))} 
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none font-bold text-slate-100" 
                      min="1" 
                      required 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Assigned Department</label>
                    <select 
                      value={employeeDeptId} 
                      onChange={(e) => setEmployeeDeptId(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100 cursor-pointer"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submitting Evidence Proof */}
                <div className="flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Proof Description (Minimum 10 chars)</label>
                    <textarea 
                      value={proofDescription}
                      onChange={(e) => setProofDescription(e.target.value)}
                      placeholder="Describe what you did (e.g. Rode bicycle 10km to fleet facility wing D)."
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100 text-xs h-16 resize-none"
                      minLength="10"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Optional Proof URL link</label>
                    <input 
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="e.g. https://strava.com/activity/123"
                      className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100 text-xs"
                    />
                  </div>

                  <div className="slide-code-block text-[10px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Carbon Offset:</span>
                      <strong className="text-emerald-400 font-mono">-{calculatedSavingsCo2} kg CO₂</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Verified Reward:</span>
                      <strong className="text-slate-300">+{calculatedPointsReward} Pts / +{calculatedXpReward} XP</strong>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Submit Contribution
                  </button>
                </div>
              </form>
            </div>

            {/* Department Ranks Leaderboard */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
                <Trophy className="w-5 h-5 text-amber-500" /> ESG Leaderboard
              </h2>
              <p className="text-[10px] text-slate-400 leading-normal">Active standings of departments calculated dynamically from offset contributions.</p>
              
              <div className="space-y-2 pt-2">
                {sortedDepartments.map((dept, index) => (
                  <div 
                    key={dept.id} 
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-xs hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black font-mono ${
                        index === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                        index === 1 ? 'bg-slate-350/20 text-slate-300 border border-slate-400/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <strong className="block text-slate-200">{dept.name}</strong>
                        <span className="text-[9px] text-slate-400 font-mono">{dept.code} · Mgr: {dept.manager}</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-black font-mono">{dept.esgScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Departmental Reference Grades */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
              <Building2 className="w-5 h-5 text-emerald-500" /> Reference Department Ratings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept) => {
                const deptGrade = getEsgGrade(dept.esgScore);
                return (
                  <div key={dept.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full font-mono">
                          {dept.code}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${deptGrade.color}`}>
                          {deptGrade.grade.split(' ')[1] || 'Rating'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold font-outfit mt-2 text-slate-200">{dept.name}</h3>
                    </div>

                    <div className="space-y-1.5 border-t border-white/5 pt-2 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Env Score:</span>
                        <strong className="text-slate-300 font-mono">{dept.envScore} pts</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Score:</span>
                        <strong className="text-slate-300 font-mono">{dept.socScore} pts</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Governance:</span>
                        <strong className="text-slate-300 font-mono">{dept.govScore} pts</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            <CsrQuickWidget />
          </div>
        </div>
      )}
    </div>
  );
}

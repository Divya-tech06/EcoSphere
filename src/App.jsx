import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldAlert, 
  Award, 
  FileText, 
  Settings as SettingsIcon, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  BookOpen,
  History,
  ShieldCheck,
  LogOut,
  Building2,
  User
} from 'lucide-react';

// Import sub-modules
import Dashboard from './components/Dashboard';
import SocialModule from './components/SocialModule';
import GovernanceModule from './components/GovernanceModule';
import GamificationModule from './components/GamificationModule';
import ReportsModule from './components/ReportsModule';
import SettingsModule from './components/SettingsModule';
import AboutPlatform from './components/AboutPlatform';
import WelcomeTour from './components/WelcomeTour';
import AuditLedger from './components/AuditLedger';

// Import newly added sub-modules
import ProfileModule from './components/ProfileModule';
import AdminUsersModule from './components/AdminUsersModule';
import AdminDepartmentsModule from './components/AdminDepartmentsModule';

// Auth & Landing pages
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

// Import client API layer
import { api } from './services/api';

// Initial seed employees list
import { mockEmployees } from './data/seedData';

export default function App() {
  // Authentication states
  const storedUserJson = localStorage.getItem('ecosphere_user');
  const initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;

  const [currentUser, setCurrentUser] = useState(initialUser ? initialUser.username : null);
  const [currentRole, setCurrentRole] = useState(initialUser ? initialUser.role : null);
  const [navigationState, setNavigationState] = useState(initialUser ? 'workspace' : 'landing');

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Toasts notification system
  const [toasts, setToasts] = useState([]);

  // Active User Profile stats
  const [userXP, setUserXP] = useState(100);
  const [userPoints, setUserPoints] = useState(200);

  // ESG Core Data States (populated from API)
  const [departments, setDepartments] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [carbonTransactions, setCarbonTransactions] = useState([]);
  const [csrActivities, setCsrActivities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [policyAcknowledgements, setPolicyAcknowledgements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [databaseDriver, setDatabaseDriver] = useState('mongodb');

  // Core settings configuration
  const [settings, setSettings] = useState({
    autoEmission: true,
    evidenceRequirement: true,
    badgeAutoAward: true,
    weights: { env: 40, soc: 30, gov: 30 }
  });

  // Confetti celebration state (for badge unlocks)
  const [confettiActive, setConfettiActive] = useState(false);

  // Apply dark class to document body
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkTheme]);

  // Sync data from Express API backend
  const fetchBackendData = async () => {
    if (!currentUser) return;
    try {
      const res = await api.fetchData(currentUser, currentRole);
      setDepartments(res.db.departments);
      setEmissionFactors(res.db.emissionFactors);
      setBadges(res.db.badges);
      setRewards(res.db.rewards);
      setCarbonTransactions(res.db.carbonTransactions);
      setCsrActivities(res.db.csrActivities);
      setChallenges(res.db.challenges);
      setComplianceIssues(res.db.complianceIssues);
      setPolicyAcknowledgements(res.db.policyAcknowledgements);
      setAuditLogs(res.db.auditLogs);
      setDatabaseDriver(res.db.databaseDriver || 'mongodb');
      
      // Update User profile variables
      setUserXP(res.profile.xp);
      setUserPoints(res.profile.points);
    } catch (err) {
      addToast('error', 'Backend Disconnected', 'Could not sync operational records from Node.js Express server.');
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, [currentUser, currentRole]);

  // Toast helper
  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Notification helper
  const triggerNotification = (type, title, message) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(type === 'compliance' ? 'error' : 'success', title, message);
  };

  // Auth handlers
  const handleAuthSuccess = (userData) => {
    localStorage.setItem('ecosphere_user', JSON.stringify(userData));
    setCurrentUser(userData.username);
    setCurrentRole(userData.role);
    setNavigationState('workspace');
    setActiveTab('dashboard');
    addToast('success', 'Access Granted', `Successfully signed in as ${userData.username}.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('ecosphere_user');
    setCurrentUser(null);
    setCurrentRole(null);
    setNavigationState('landing');
    setActiveTab('dashboard');
    addToast('success', 'Logged Out', 'Session terminated safely.');
  };

  // Switch authenticated role
  const handleSessionChange = async (user, role) => {
    try {
      const res = await api.switchProfile(user, role);
      if (res.success) {
        // Update local session
        const currentSession = JSON.parse(localStorage.getItem('ecosphere_user') || '{}');
        const updatedSession = { ...currentSession, role };
        localStorage.setItem('ecosphere_user', JSON.stringify(updatedSession));
        setCurrentRole(role);
        setActiveTab('dashboard'); // Clear view to prevent navigation failures
        addToast('success', 'Session Switch', `Toggled authority level to ${role}`);
      }
    } catch (e) {
      addToast('error', 'Session Error', 'Failed to swap role profile.');
    }
  };

  // 1. ADD CARBON TRANSACTION
  const addCarbonTransaction = async (tx) => {
    try {
      const res = await api.logEmission(currentUser, currentRole, tx);
      if (res.success) {
        if (currentRole === 'Employee') {
          triggerNotification('environmental', 'Pending Approval Logged', `Logged offset ${tx.sourceRef}. Awaiting verification.`);
        } else {
          triggerNotification('environmental', 'Operational Record Logged', `Logged direct ${tx.sourceRef}.`);
        }
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Database Rejection', e.message);
    }
  };

  // 2. SOCIAL WORKFLOWS
  const addCsrActivity = async (activity) => {
    try {
      const res = await api.proposeCsr(currentUser, currentRole, activity);
      if (res.success) {
        triggerNotification('csr', 'CSR Activity Proposed', `Activity '${activity.title}' proposed successfully.`);
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Propose Failed', e.message);
    }
  };

  const joinCsrActivity = async (id, employee) => {
    try {
      const res = await api.joinCsr(currentUser, currentRole, id, employee);
      if (res.success) {
        addToast('success', 'Team Registered', 'Successfully registered for this action.');
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Registration Failed', e.message);
    }
  };

  // 3. CSR APPROVAL (enforces role check on Express backend)
  const approveCsrActivity = async (id) => {
    try {
      const res = await api.approveCsr(currentUser, currentRole, id);
      if (res.success) {
        triggerNotification('csr', 'CSR Activity Approved', 'Activity status set to Approved. Points distributed.');
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Authorization Blocked', e.message);
    }
  };

  // 4. GOVERNANCE
  const addComplianceIssue = async (issue) => {
    try {
      const res = await api.reportCompliance(currentUser, currentRole, issue);
      if (res.success) {
        triggerNotification('compliance', 'Issue Logged', `Reported compliance deviation: '${issue.title}'.`);
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Logging Failed', e.message);
    }
  };

  const resolveComplianceIssue = async (id) => {
    try {
      const res = await api.resolveCompliance(currentUser, currentRole, id);
      if (res.success) {
        triggerNotification('compliance', 'Issue Resolved', 'Compliance issue resolved on server database.');
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Authorization Blocked', e.message);
    }
  };

  const acknowledgePolicy = async (id, employee) => {
    try {
      const res = await api.signPolicy(currentUser, currentRole, id, employee);
      if (res.success) {
        triggerNotification('compliance', 'Policy Acknowledged', `Signed policy. Earned +50 XP.`);
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Signature Blocked', e.message);
    }
  };

  // 5. GAMIFICATION: Redeem Rewards
  const redeemReward = async (id) => {
    try {
      const res = await api.redeemReward(currentUser, currentRole, id);
      if (res.success) {
        triggerNotification('badge', 'Incentive Claimed', 'Reward transaction verified. Points deducted.');
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Redemption Failed', e.message);
    }
  };

  // 6. SETTINGS: Toggles & Weights
  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    addToast('success', 'Local Toggle Saved', `Option '${key}' changed.`);
  };

  const updateWeights = async (key, value) => {
    const nextWeights = {
      ...settings.weights,
      [key]: parseInt(value) || 0
    };
    setSettings(prev => ({ ...prev, weights: nextWeights }));
    
    try {
      await api.applyWeights(currentUser, currentRole, nextWeights);
      fetchBackendData();
    } catch (e) {
      addToast('error', 'Calculation Error', 'Failed to update backend calculations weights.');
    }
  };

  const recalculateEsgScores = async () => {
    try {
      const res = await api.applyWeights(currentUser, currentRole, settings.weights);
      if (res.success) {
        addToast('success', 'Ranks Synchronized', 'All department ESG ratings synced from server.');
        fetchBackendData();
      }
    } catch (e) {
      addToast('error', 'Sync Failure', 'Failed to recalculate index.');
    }
  };

  // Dynamic Navigation tabs logic based on clearance level
  const getAuthorizedTabs = () => {
    switch (currentRole) {
      case 'Admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'departments', label: 'Departments Manager', icon: Building2 },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'settings', label: 'ESG Settings', icon: SettingsIcon },
          { id: 'about', label: 'Conceptual Guide', icon: BookOpen }
        ];
      case 'Manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'social', label: 'CSR & Social Hub', icon: Users },
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'reports', label: 'Report Builder', icon: FileText },
          { id: 'about', label: 'Conceptual Guide', icon: BookOpen }
        ];
      case 'Compliance Officer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'governance', label: 'Compliance Hub', icon: ShieldAlert },
          { id: 'ledger', label: 'Audit Ledger', icon: History },
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'about', label: 'Conceptual Guide', icon: BookOpen }
        ];
      case 'Employee':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'social', label: 'CSR Activities', icon: Users },
          { id: 'governance', label: 'Ethics Codes', icon: ShieldCheck },
          { id: 'gamification', label: 'Green Rewards', icon: Award },
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'about', label: 'Conceptual Guide', icon: BookOpen }
        ];
    }
  };

  const authorizedTabs = getAuthorizedTabs();

  // ---------------- AUTHENTICATION VIEWS ROUTER ----------------

  if (navigationState === 'landing') {
    return <LandingPage onNavigate={setNavigationState} />;
  }

  if (navigationState === 'login') {
    return <LoginPage onNavigate={setNavigationState} onAuthSuccess={handleAuthSuccess} />;
  }

  if (navigationState === 'register') {
    return <RegisterPage onNavigate={setNavigationState} onAuthSuccess={handleAuthSuccess} />;
  }

  // ---------------- WORKSPACE VIEW ----------------

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      
      {/* Confetti Celebration overlays */}
      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => {
            const leftVal = Math.random() * 100;
            const animDelay = Math.random() * 2;
            const colorClass = ['bg-amber-400', 'bg-emerald-500', 'bg-blue-400', 'bg-purple-500'][Math.floor(Math.random() * 4)];
            return (
              <div 
                key={i} 
                className={`confetti-piece ${colorClass}`}
                style={{ 
                  left: `${leftVal}%`, 
                  animationDelay: `${animDelay}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }} 
              />
            );
          })}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`glass-panel border-r shrink-0 transition-all duration-300 md:block fixed md:sticky top-0 bottom-0 left-0 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } h-screen flex flex-col justify-between p-4 hidden md:flex`}>
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-500/10">
              <Leaf className="w-5.5 h-5.5" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-extrabold font-outfit text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide block">EcoSphere</span>
                <span className="text-[10px] text-slate-400 font-bold block">ESG ERP PLATFORM</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {authorizedTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-semibold text-xs cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-650/15' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collapsing toggle buttons & Logout */}
        <div className="space-y-2 pt-4 border-t border-slate-150 dark:border-slate-850">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-colors font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0 text-rose-500" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-400 dark:text-slate-500 transition-colors flex items-center justify-center cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="glass-panel border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* STATIC ROLE DISPLAY BADGE */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-extrabold text-[10px] text-emerald-450 uppercase tracking-wider">
                Clearance: {currentRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Theme toggle */}
            <button
              onClick={() => setDarkTheme(!darkTheme)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {darkTheme ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* In-app Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
                )}
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-xl z-50 space-y-3 border border-slate-250 dark:border-slate-700">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-105 dark:border-slate-800">
                    <span className="font-bold text-xs font-outfit">Notifications Center</span>
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        setShowNotifications(false);
                      }}
                      className="text-[10px] text-emerald-500 font-bold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.read ? 'opacity-65 bg-slate-50/40 dark:bg-slate-900/10' : 'bg-emerald-500/5 border-l-2 border-l-emerald-500 dark:bg-slate-800/40'
                      }`}>
                        <div className="font-bold text-[11px] text-slate-705 dark:text-slate-200">{n.title}</div>
                        <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{n.message}</p>
                        <span className="text-[8px] text-slate-400 block mt-1 font-semibold">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto pb-24 md:pb-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              departments={departments}
              carbonTransactions={carbonTransactions}
              emissionFactors={emissionFactors}
              addCarbonTransaction={addCarbonTransaction}
              settings={settings}
              recalculateEsgScores={recalculateEsgScores}
              currentUser={currentUser}
              currentRole={currentRole}
              fetchBackendData={fetchBackendData}
              addToast={addToast}
              auditLogs={auditLogs}
              complianceIssues={complianceIssues}
              databaseDriver={databaseDriver}
            />
          )}

          {activeTab === 'departments' && (
            <AdminDepartmentsModule 
              currentUser={currentUser}
              currentRole={currentRole}
              departments={departments}
              fetchBackendData={fetchBackendData}
              addToast={addToast}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersModule 
              currentUser={currentUser}
              currentRole={currentRole}
              addToast={addToast}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileModule 
              currentUser={currentUser}
              currentRole={currentRole}
              userXP={userXP}
              userPoints={userPoints}
              badges={badges}
              policyAcknowledgements={policyAcknowledgements}
              addToast={addToast}
            />
          )}

          {activeTab === 'social' && (
            <SocialModule 
              csrActivities={csrActivities}
              challenges={challenges}
              departments={departments}
              addCsrActivity={addCsrActivity}
              approveCsrActivity={approveCsrActivity}
              joinCsrActivity={joinCsrActivity}
              currentUser={currentUser}
              settings={settings}
              triggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'governance' && (
            <GovernanceModule 
              complianceIssues={complianceIssues}
              policyAcknowledgements={policyAcknowledgements}
              addComplianceIssue={addComplianceIssue}
              resolveComplianceIssue={resolveComplianceIssue}
              acknowledgePolicy={acknowledgePolicy}
              currentUser={currentUser}
              mockEmployees={mockEmployees}
              triggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'gamification' && (
            <GamificationModule 
              currentUser={currentUser}
              userXP={userXP}
              userPoints={userPoints}
              badges={badges}
              rewards={rewards}
              departments={departments}
              redeemReward={redeemReward}
              settings={settings}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule 
              departments={departments}
              carbonTransactions={carbonTransactions}
              csrActivities={csrActivities}
              complianceIssues={complianceIssues}
              policyAcknowledgements={policyAcknowledgements}
              mockEmployees={mockEmployees}
              challenges={challenges}
              triggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'ledger' && (
            <AuditLedger 
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule 
              settings={settings}
              toggleSetting={toggleSetting}
              updateWeights={updateWeights}
              recalculateEsgScores={recalculateEsgScores}
            />
          )}

          {activeTab === 'about' && (
            <AboutPlatform />
          )}
        </main>

        {/* Mobile bottom bar navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t p-2 flex justify-around items-center z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          {authorizedTabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-500 font-extrabold' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-5.5 h-5.5" />
                <span className="text-[9px] font-bold tracking-wider">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Welcome Tour Overlay Assistant */}
      <WelcomeTour />

      {/* Floating Toast Notification Containers */}
      <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 pointer-events-auto transition-all duration-300 animate-slide-in ${
              toast.type === 'error' 
                ? 'bg-rose-500 border-rose-600 text-white' 
                : 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-slate-850 dark:border-slate-100'
            }`}
          >
            <div className="p-1 rounded-lg bg-white/10 dark:bg-slate-100/10">
              <Sparkles className="w-4 h-4 text-emerald-300 dark:text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <strong className="text-xs font-black block">{toast.title}</strong>
              <p className="text-[10px] opacity-90 font-medium leading-normal">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

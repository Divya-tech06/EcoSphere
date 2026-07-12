import React, { useState } from 'react';
import { User, Mail, Shield, Award, AwardIcon, Sparkles, Key, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ProfileModule({ 
  currentUser, 
  currentRole, 
  userXP, 
  userPoints,
  badges = [],
  policyAcknowledgements = [],
  addToast 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Find signed policies count by current employee
  const signedCount = policyAcknowledgements.filter(pol => 
    pol.acknowledgedEmployees && pol.acknowledgedEmployees.split(',').includes(currentUser)
  ).length;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!email && !password) {
      addToast('error', 'No input', 'Please provide either a new email or password.');
      return;
    }
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await api.updateProfile(currentUser, currentRole, email, password);
      setSuccessMsg('Profile credentials updated successfully!');
      setEmail('');
      setPassword('');
      if (addToast) addToast('success', 'Profile Updated', 'Credentials changed successfully.');
    } catch (err) {
      if (addToast) addToast('error', 'Update Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black font-outfit text-slate-100">User Profile Hub</h1>
        <p className="text-xs text-slate-400">View credential details, green scores, unlocked organizational badges, and manage account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-4 w-full">
            <div className="w-20 h-20 rounded-full bg-emerald-600/10 border-2 border-emerald-500/35 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <User className="w-10 h-10 text-emerald-400" />
            </div>
            
            <div>
              <h2 className="text-lg font-black font-outfit text-slate-100">{currentUser}</h2>
              <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mt-1">
                {currentRole}
              </span>
            </div>

            {/* Scores list */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 text-left">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Total XP</span>
                <strong className="text-xl font-black text-slate-100 font-mono mt-0.5 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> {userXP}
                </strong>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Green Points</span>
                <strong className="text-xl font-black text-emerald-450 font-mono mt-0.5 block flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {userPoints}
                </strong>
              </div>
            </div>
          </div>

          <div className="w-full pt-6 mt-6 border-t border-white/5 text-left text-xs space-y-2 text-slate-400">
            <div className="flex justify-between items-center">
              <span>Authority Permissions:</span>
              <strong className="text-slate-200 text-[10px] font-mono">{currentRole === 'Employee' ? 'Read-only CSR/Policies' : 'Full approvals'}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Signed Policies:</span>
              <strong className="text-slate-200 text-[10px] font-mono">{signedCount} Documents</strong>
            </div>
          </div>
        </div>

        {/* Center: Unlocked Badges Showcase */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-emerald-500 animate-pulse" /> Unlocked Badges
          </h2>
          <p className="text-xs text-slate-400">Earn Badges by fulfilling company-wide CSR actions, logging green offsets, and complying with policy standards.</p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {badges.map(b => (
              <div 
                key={b.id} 
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  b.unlocked 
                    ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40' 
                    : 'bg-slate-900/40 border-white/5 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${b.unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-extrabold text-slate-205">{b.name}</strong>
                    {b.unlocked && (
                      <span className="text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-450 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Credentials Settings */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
            <Key className="w-5 h-5 text-emerald-500" /> Account Security
          </h2>
          <p className="text-xs text-slate-400">Update account credentials safely. Leave fields blank if you do not wish to modify them.</p>

          {successMsg && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-450 text-xs rounded-xl font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ecosphere.com" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submitting ? 'Updating settings...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

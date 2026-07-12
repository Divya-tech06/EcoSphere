import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function RegisterPage({ onNavigate, onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.register(username, email, password, role);
      if (res.success) {
        onAuthSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      
      {/* Decors */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-650 transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
        </button>

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-500/10 mx-auto">
            <Leaf className="w-6.5 h-6.5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-outfit text-slate-100">Create Account</h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-semibold mt-0.5">Register an identity with auditing and index calculation access</p>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-start gap-2 animate-pop-in font-medium">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Username</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. Sarah Connor or john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-750 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Enterprise Email</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                placeholder="e.g. name@ecosphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-750 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Password</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Lock className="w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-750 dark:text-slate-200"
                minLength="6"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Authorized Role</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-750 dark:text-slate-350 cursor-pointer font-semibold"
              >
                <option value="Employee">Employee (Normal Audit Scope)</option>
                <option value="Manager">Manager (Approvals & Offsets Audit Scope)</option>
                <option value="Compliance Officer">Compliance Officer (Requires Admin Approval)</option>
                <option value="Admin">Admin (Requires Admin Approval)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>

        </form>

        {/* Login Navigation */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
          >
            Already registered? Sign In
          </button>
        </div>

      </div>

    </div>
  );
}

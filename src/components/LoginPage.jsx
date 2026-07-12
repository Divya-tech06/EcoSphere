import React, { useState } from 'react';
import { Leaf, Mail, Lock, ArrowRight, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onNavigate, onAuthSuccess }) {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginInput || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login(loginInput, password);
      if (res.success) {
        onAuthSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      
      {/* Decors */}
      <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

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
            <h2 className="text-xl font-extrabold font-outfit text-slate-100">Sign In to EcoSphere</h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-400 font-semibold mt-0.5">Enter credentials to audit metrics and log transactions</p>
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
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Email or Username</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. sarah@ecosphere.com or Sarah Connor"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-750 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>

        </form>

        {/* Demo Details Hint */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-450 leading-relaxed font-semibold">
          <strong className="text-emerald-500 block mb-0.5">Demo Accounts Available:</strong>
          • Username: <span className="font-mono text-slate-700 dark:text-slate-300">Sarah Connor</span> | Password: <span className="font-mono text-slate-700 dark:text-slate-300">password123</span> (Manager)<br />
          • Username: <span className="font-mono text-slate-700 dark:text-slate-300">John Doe</span> | Password: <span className="font-mono text-slate-700 dark:text-slate-300">password123</span> (Employee)
        </div>

        {/* Register Navigation */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('register')}
            className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
          >
            New to EcoSphere? Create an Enterprise Account
          </button>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import { Leaf, Users, ShieldAlert, Award, ArrowRight, Activity, Compass, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative overflow-hidden animate-fade-in">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-500/10">
            <Leaf className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="font-extrabold font-outfit text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide block">EcoSphere</span>
            <span className="text-[9px] text-slate-400 font-bold block">ESG ERP PLATFORM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-xs font-bold text-slate-300 dark:text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('register')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full text-center space-y-10 my-auto z-10 pt-12 pb-16">
        
        {/* Badge Indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse-slow">
          <Activity className="w-3.5 h-3.5" /> Next-Generation Sustainability ERP
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-outfit tracking-tight leading-[1.15] text-slate-100">
            Bridging operational ERP data with <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Sustainability metrics</span>
          </h1>
          <p className="text-sm md:text-base text-slate-350 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Measure carbon footprints, incentivize community service, sign policy codes, and track governance compliance in one integrated portal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => onNavigate('register')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-650/15 flex items-center gap-2 group transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            Create Enterprise Account <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            Sign In with Credentials
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 text-left">
          
          <div className="glass-panel p-5 rounded-2xl space-y-3 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs font-outfit uppercase tracking-wider text-slate-700 dark:text-slate-200">Environmental</h3>
            <p className="text-[11px] text-slate-405 dark:text-slate-400 leading-normal">
              Direct and indirect Scope 1, 2, and 3 emissions logs linked dynamically to departments.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-3 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs font-outfit uppercase tracking-wider text-slate-700 dark:text-slate-200">Social</h3>
            <p className="text-[11px] text-slate-405 dark:text-slate-400 leading-normal">
              Collaborative CSR activity logs, community volunteer drives, and participation verifications.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-3 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs font-outfit uppercase tracking-wider text-slate-700 dark:text-slate-200">Governance</h3>
            <p className="text-[11px] text-slate-405 dark:text-slate-400 leading-normal">
              Digital policy sign-offs, compliance leak logs, and risk resolution triggers.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-3 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs font-outfit uppercase tracking-wider text-slate-700 dark:text-slate-200">Gamification</h3>
            <p className="text-[11px] text-slate-405 dark:text-slate-400 leading-normal">
              Earn XP points, unlock sustainable badges, and redeem eco-friendly awards.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full z-10 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold">
        <span>© 2026 EcoSphere Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-emerald-500" /> Decentralized Ledgers</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Hybrid SQL/NoSQL Engine</span>
        </div>
      </footer>

    </div>
  );
}

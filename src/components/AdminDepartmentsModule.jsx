import React, { useState } from 'react';
import { Building2, PlusCircle, CheckCircle, List, User } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDepartmentsModule({ 
  currentUser, 
  currentRole, 
  departments = [], 
  fetchBackendData,
  addToast 
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [manager, setManager] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code || !manager) {
      if (addToast) addToast('error', 'Missing Fields', 'Please enter name, code and manager.');
      return;
    }
    setSubmitting(true);
    try {
      const deptData = {
        id: `dept-${Date.now()}`,
        name,
        code: code.toUpperCase(),
        manager,
        envScore: 95, // Standard starting thresholds
        socScore: 70,
        govScore: 95,
        esgScore: 85.0
      };
      const res = await api.createDepartment(currentUser, currentRole, deptData);
      if (res.success) {
        if (addToast) addToast('success', 'Department Registered', `Successfully created ${name} department.`);
        setName('');
        setCode('');
        setManager('');
        if (fetchBackendData) fetchBackendData();
      }
    } catch (err) {
      if (addToast) addToast('error', 'Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black font-outfit text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-500" /> Department Infrastructure
        </h1>
        <p className="text-xs text-slate-400">Add new corporate divisions, assign leaders, and overview operational groups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Create Form */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
            <PlusCircle className="w-5 h-5 text-emerald-500" /> Create Department
          </h2>
          <p className="text-xs text-slate-400">Initialize a new organizational division inside the corporate ledger.</p>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Title</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Research & Development" 
                className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Code (LOG, MFG, etc.)</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. RND" 
                className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
                maxLength="4"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned ESG Manager Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. John Doe" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100" 
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submitting ? 'Registering...' : 'Register Department'}
            </button>
          </form>
        </div>

        {/* Right Side: Active Departments List */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold font-outfit text-slate-100 flex items-center gap-1.5">
            <List className="w-5 h-5 text-emerald-500" /> Active Infrastructure Registry
          </h2>
          <p className="text-xs text-slate-400">Dynamic summary of all current operational units and managers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {departments.map((dept) => (
              <div 
                key={dept.id} 
                className="p-4 bg-slate-900/60 border border-white/5 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                      {dept.code}
                    </span>
                    <span className="text-[10px] font-black text-emerald-450 font-mono">
                      ESG: {dept.esgScore}
                    </span>
                  </div>
                  <strong className="block text-slate-205 text-sm font-outfit mt-3">{dept.name}</strong>
                  <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Manager: {dept.manager}</span>
                </div>
                <div className="border-t border-white/5 pt-2 mt-3 flex justify-between text-[9px] font-extrabold text-slate-450">
                  <span>E: {dept.envScore} pts</span>
                  <span>S: {dept.socScore} pts</span>
                  <span>G: {dept.govScore} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

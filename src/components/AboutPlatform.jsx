import React, { useState } from 'react';
import { 
  Shield, 
  BookOpen, 
  Layers, 
  GitFork, 
  ArrowRightLeft, 
  Server, 
  Laptop, 
  Cpu, 
  Award, 
  Leaf, 
  Users, 
  Check, 
  X as XIcon, 
  Clock, 
  AlertCircle, 
  ShoppingBag,
  Sparkles,
  Terminal,
  Grid,
  Zap
} from 'lucide-react';

export default function AboutPlatform() {
  const [activeExampleTab, setActiveExampleTab] = useState('environmental');
  
  // Interactive E-Example state
  const [litersInput, setLitersInput] = useState(100);
  const co2Result = (litersInput * 2.68).toFixed(1);

  // Interactive S-Example state
  const [csrStep, setCsrStep] = useState(1); // 1: HR organizes, 2: Krish joins & uploads, 3: Approved & updated

  // Interactive G-Example state
  const [policyFilter, setPolicyFilter] = useState('All');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" /> Conceptual Guide & Interactive Examples
        </div>
        <h1 className="text-3xl font-extrabold font-outfit tracking-tight">How EcoSphere Solves ESG</h1>
        <p className="text-sm text-slate-400 leading-relaxed font-semibold">
          Bridging daily corporate events with environmental, social, and compliance ledger outcomes.
        </p>
      </div>

      {/* Slide Definition Quote Block */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950/40 p-6 rounded-3xl border border-emerald-500/20 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4" /> In One Simple Sentence
        </h3>
        <blockquote className="text-sm font-semibold text-slate-100 leading-relaxed italic">
          "EcoSphere is a company dashboard that helps organizations measure pollution, encourage employees to participate in social activities, ensure company rules are followed, reward good behavior, and generate ESG reports—all from one platform. Instead of using separate Excel sheets for each task, everything is managed in a single application."
        </blockquote>
      </div>

      {/* Interactive Examples Tabs Selector */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-outfit text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" /> Interactive ESG Workflow Examples
          </h2>
          <p className="text-xs text-slate-400">Select a tab below to walk through a live simulation of the ESG calculation models.</p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5">
          {[
            { id: 'environmental', label: 'E - Environmental', icon: Leaf, color: 'text-amber-500 bg-amber-500/10' },
            { id: 'social', label: 'S - Social', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
            { id: 'governance', label: 'G - Governance', icon: Shield, color: 'text-purple-500 bg-purple-500/10' },
            { id: 'gamification', label: 'Gamification', icon: Award, color: 'text-emerald-500 bg-emerald-500/10' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeExampleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveExampleTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-slate-800 shadow-md text-slate-105 border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 text-xs transition-all">
          
          {/* ENVIRONMENTAL TAB */}
          {activeExampleTab === 'environmental' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Leaf className="w-4 h-4" /> Environmental Scope Calculation
                </h3>
                <p className="text-slate-400 leading-relaxed font-semibold">
                  EcoSphere dynamically converts raw inventory inputs into direct CO₂ footprint magnitudes. When fuel is purchased or utilities logged, the system multiplies volume by emission factors.
                </p>
                <div className="slide-code-block">
                  Carbon Factor reference:<br />
                  <strong className="text-emerald-400">1 Liter of Diesel = 2.68 kg CO₂</strong>
                </div>
              </div>

              {/* Calculator Panel */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Input Diesel Purchased (Litres)</label>
                  <input 
                    type="number" 
                    value={litersInput}
                    onChange={(e) => setLitersInput(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full font-bold p-2.5 bg-slate-900 rounded-xl border border-slate-700 outline-none text-slate-100"
                  />
                </div>
                
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Automatic Conversion Math</span>
                  <div className="slide-code-block text-center space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">{litersInput} Litres × 2.68 factor</div>
                    <div className="text-sm font-black text-amber-400 font-mono">={co2Result} kg CO₂</div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center font-bold">
                  This transaction is committed to the database ledger automatically.
                </p>
              </div>
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeExampleTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-blue-500 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Users className="w-4 h-4" /> Social Engagement & Verification
                </h3>
                <p className="text-slate-400 leading-relaxed font-semibold">
                  HR plans tree planting or beach cleanup programs. Employees join, upload photos as verification evidence, and managers approve, adding green points and XP.
                </p>
                
                {/* Step controls */}
                <div className="flex gap-2">
                  {[1, 2, 3].map(step => (
                    <button
                      key={step}
                      onClick={() => setCsrStep(step)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                        csrStep === step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Step {step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="glass-panel p-5 rounded-2xl min-h-[180px] flex flex-col justify-between border border-white/10">
                {csrStep === 1 && (
                  <div className="space-y-3 animate-pop-in">
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">Step 1: HR Proposes Event</span>
                    <h4 className="font-bold text-sm text-slate-100">Tree Plantation Drive</h4>
                    <p className="text-[10px] text-slate-400">Date: 20 July | Target participants: 100 Employees</p>
                    <div className="slide-code-block">
                      Status: <strong className="text-amber-500 font-mono">Pending Approval</strong>
                    </div>
                  </div>
                )}

                {csrStep === 2 && (
                  <div className="space-y-3 animate-pop-in">
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">Step 2: Employee Joins & Uploads Proof</span>
                    <div className="slide-code-block flex items-center justify-between">
                      <div>
                        <strong className="block text-[11px] font-mono text-slate-100">Krish plants 10 trees</strong>
                        <span className="text-[9px] text-emerald-400 font-bold block font-mono">✓ PhotoUploaded: proof_tree.jpg</span>
                      </div>
                      <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">✓</span>
                    </div>
                  </div>
                )}

                {csrStep === 3 && (
                  <div className="space-y-3 animate-pop-in">
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Step 3: HR Approves & Profile Syncs</span>
                    <div className="slide-code-block space-y-1.5">
                      <div className="font-extrabold text-[10px] text-emerald-400 font-mono">Krish's ESG Profile Updated:</div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                        <div className="bg-slate-900 p-1.5 rounded border border-white/5">CSR: <strong>1</strong></div>
                        <div className="bg-slate-900 p-1.5 rounded text-emerald-400 border border-white/5">XP: <strong>+50</strong></div>
                        <div className="bg-slate-900 p-1.5 rounded text-emerald-400 border border-white/5">Points: <strong>+100</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-center border-t border-slate-800 pt-2 font-bold mt-2">
                  Manager dashboard shows active participation: <strong className="text-blue-500">80 / 100 Joined</strong>
                </div>
              </div>
            </div>
          )}

          {/* GOVERNANCE TAB */}
          {activeExampleTab === 'governance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-purple-500 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Shield className="w-4 h-4" /> Governance & Policy Audit
                </h3>
                <p className="text-slate-400 leading-relaxed font-semibold">
                  EcoSphere tracks policy signatures across staff and raises compliance issues dynamically. If an auditor reports a violation, a compliance ticket opens.
                </p>
                <div className="flex gap-2 text-[10px]">
                  <button onClick={() => setPolicyFilter('All')} className={`px-2 py-1 rounded font-bold cursor-pointer ${policyFilter === 'All' ? 'bg-purple-650 text-white' : 'bg-slate-800 text-slate-400'}`}>All Logs</button>
                  <button onClick={() => setPolicyFilter('Policy')} className={`px-2 py-1 rounded font-bold cursor-pointer ${policyFilter === 'Policy' ? 'bg-purple-650 text-white' : 'bg-slate-800 text-slate-400'}`}>Policies</button>
                  <button onClick={() => setPolicyFilter('Audit')} className={`px-2 py-1 rounded font-bold cursor-pointer ${policyFilter === 'Audit' ? 'bg-purple-650 text-white' : 'bg-slate-800 text-slate-400'}`}>Audits</button>
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
                {(policyFilter === 'All' || policyFilter === 'Policy') && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Policy: Work From Home Ethics v1</span>
                    <div className="space-y-1.5 font-mono">
                      <div className="flex justify-between items-center bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-lg">
                        <span>Krish</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Accepted</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-lg">
                        <span>Rahul</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Accepted</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-lg">
                        <span>Aman</span>
                        <span className="text-rose-400 font-bold flex items-center gap-1"><XIcon className="w-3.5 h-3.5" /> Not Accepted</span>
                      </div>
                    </div>
                  </div>
                )}

                {(policyFilter === 'All' || policyFilter === 'Audit') && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Audit Issue: Fire Extinguisher Expired</span>
                    <div className="slide-code-block space-y-1">
                      <div>Owner: <span className="font-bold text-slate-200">Maintenance Team</span></div>
                      <div>Deadline: <span className="font-bold text-rose-400">30 July</span></div>
                      <div className="flex justify-between mt-1 pt-1 border-t border-white/5">
                        <span>Status: <strong className="text-rose-400">Open</strong></span>
                        <span className="text-[8px] text-rose-400 font-black animate-pulse uppercase">Notification Pending</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GAMIFICATION TAB */}
          {activeExampleTab === 'gamification' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <Award className="w-4 h-4" /> Gamification & Rewards
                </h3>
                <p className="text-slate-400 leading-relaxed font-semibold">
                  Sustained green action awards badges. Accumulated green points can be exchanged in the catalog for actual sustainable items like coffee vouchers or tree certificates.
                </p>
                <div className="slide-code-block">
                  Unlock Rule: <strong className="text-emerald-400">XP &gt;= 300</strong> triggers the <strong className="text-emerald-400">Eco Warrior Badge</strong> automatically.
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/10">
                <div className="slide-code-block flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[11px] text-slate-100">Eco Warrior Badge</strong>
                    <span className="text-[9px] text-slate-400 block font-mono">Unlocked at 300 XP (Krish: 350 XP)</span>
                  </div>
                  <span className="text-[8px] bg-emerald-500 text-white font-black uppercase px-2 py-0.5 rounded ml-auto">UNLOCKED</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Redeem Points</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="slide-code-block text-center space-y-1">
                      <ShoppingBag className="w-4 h-4 mx-auto text-blue-500" />
                      <strong className="text-slate-200">Coffee Voucher</strong>
                      <span className="text-[9px] text-emerald-400 block">Cost: 150 Points</span>
                    </div>
                    <div className="slide-code-block text-center space-y-1">
                      <ShoppingBag className="w-4 h-4 mx-auto text-purple-500" />
                      <strong className="text-slate-200">Amazon Gift Card</strong>
                      <span className="text-[9px] text-emerald-400 block">Cost: 300 Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Grid: Problem Statement vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden border-t-4 border-t-rose-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-lg font-bold font-outfit text-rose-600 flex items-center gap-2">
            <Shield className="w-5.5 h-5.5" /> The ESG Reporting Problem
          </h2>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
            <p>
              <strong>Data Silos:</strong> Traditional ERP systems (such as Odoo, SAP, or NetSuite) are optimized to track financial logs, inventory items, and timesheets, but completely ignore sustainability metrics.
            </p>
            <p>
              <strong>Manual Compilation:</strong> Companies usually compile carbon footprints once a year on manual spreadsheets, pulling electric utility bills and flight records by hand. This makes real-time sustainability optimization impossible.
            </p>
            <p>
              <strong>Disengaged Staff:</strong> Employee green initiatives and regulatory governance policies are typically stored in PDF logs or static folders, resulting in poor policy acknowledgment rates and low staff involvement.
            </p>
          </div>
        </div>

        {/* The Solution Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden border-t-4 border-t-emerald-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-lg font-bold font-outfit text-emerald-600 flex items-center gap-2">
            <Award className="w-5.5 h-5.5" /> The EcoSphere Solution
          </h2>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
            <p>
              <strong>Reactive Bridging:</strong> EcoSphere links directly into ERP daily operations (procurements, manufacturing batches, travel expenses). The moment a purchase is simulated, the system automatically applies linked emission factors.
            </p>
            <p>
              <strong>In-Memory Recalculations:</strong> Sustainability scores are not static. Changing an emission factor or adding an activity instantly triggers a reactive calculation of departmental scores and company ratings.
            </p>
            <p>
              <strong>Gamified Compliance:</strong> Earn points and XP by completing carbon challenges or signing ethics codes. Points are redeemable in the Rewards Marketplace, creating a concrete incentive loop.
            </p>
          </div>
        </div>

      </div>

      {/* Module vs Similar App Table Grid (Slide 2) */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-400">
          <Grid className="w-5.5 h-5.5" /> Platform Analogy Mapping
        </h2>
        <p className="text-xs text-slate-400">Think of EcoSphere as a combination of these enterprise applications:</p>
        
        <div className="overflow-x-auto border border-white/5 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-300 font-bold bg-slate-900/40">
                <th className="p-3">EcoSphere Module</th>
                <th className="p-3">Similar Industry App / Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-slate-400">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5"><Leaf className="w-4 h-4 text-amber-500" /> Environmental</td>
                <td className="p-3">Carbon footprint tracker & fuel auditing ledger</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Social</td>
                <td className="p-3">HR + CSR management database system</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5"><Shield className="w-4 h-4 text-purple-500" /> Governance</td>
                <td className="p-3">Compliance & ethical policy management software</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-500" /> Gamification</td>
                <td className="p-3">Duolingo or Microsoft Rewards (points, badges, leaderboards)</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-bold text-slate-200 flex items-center gap-1.5"><Laptop className="w-4 h-4 text-blue-400" /> Dashboard</td>
                <td className="p-3">Power BI / Google Analytics dashboard for corporate sustainability</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Flow diagram representation */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-450">
          <GitFork className="w-5.5 h-5.5" /> ESG Data Transformation Architecture
        </h2>
        
        {/* Visual blocks representing the flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
          
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2">
            <Server className="w-6 h-6 mx-auto text-blue-500" />
            <h4 className="text-xs font-bold text-slate-200">1. ERP Operations</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Procurement, fleet fuel logs, electricity utility invoices.</p>
          </div>

          <div className="text-slate-600 hidden md:block">
            <ArrowRightLeft className="w-6 h-6 mx-auto" />
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2">
            <Cpu className="w-6 h-6 mx-auto text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-200">2. Metric Adapter</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Multiplies units by emission factors (e.g., L diesel × 2.68 kg CO₂).</p>
          </div>

          <div className="text-slate-600 hidden md:block">
            <ArrowRightLeft className="w-6 h-6 mx-auto" />
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2">
            <Laptop className="w-6 h-6 mx-auto text-purple-500" />
            <h4 className="text-xs font-bold text-slate-200">3. Dashboard Analytics</h4>
            <p className="text-[10px] text-slate-400 font-semibold">Visualizes donut allocation, tracks compliance, triggers badge unlocks.</p>
          </div>

        </div>
      </div>

    </div>
  );
}

import React from 'react';
import { ToggleLeft, ToggleRight, Leaf, ShieldAlert, Award, Sliders, Info } from 'lucide-react';

export default function SettingsModule({
  settings,
  toggleSetting,
  updateWeights,
  recalculateEsgScores
}) {
  const sumWeights = settings.weights.env + settings.weights.soc + settings.weights.gov;
  const isWeightsValid = sumWeights === 100;

  const handleWeightChange = (key, value) => {
    const intVal = parseInt(value) || 0;
    updateWeights(key, intVal);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold font-outfit">Platform Settings & Controls</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure global ESG calculations weightings and module behaviors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core calculation weightings */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Sliders className="w-5 h-5" /> Score Allocation Weights
            </h2>
            <p className="text-xs text-slate-400">Set the contribution ratio of each module to the organization overall ESG rating.</p>
          </div>

          <div className="space-y-4 pt-2">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Environmental Weight</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{settings.weights.env}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.weights.env} 
                onChange={(e) => handleWeightChange('env', e.target.value)}
                className="w-full accent-emerald-500 bg-slate-100 dark:bg-slate-800 rounded-lg h-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Social Weight</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{settings.weights.soc}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.weights.soc} 
                onChange={(e) => handleWeightChange('soc', e.target.value)}
                className="w-full accent-emerald-500 bg-slate-100 dark:bg-slate-800 rounded-lg h-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Governance Weight</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{settings.weights.gov}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.weights.gov} 
                onChange={(e) => handleWeightChange('gov', e.target.value)}
                className="w-full accent-emerald-500 bg-slate-100 dark:bg-slate-800 rounded-lg h-2"
              />
            </div>

          </div>

          <div className="pt-3 border-t border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Sum of Weights</span>
              <strong className={`text-sm ${isWeightsValid ? 'text-emerald-500' : 'text-rose-500'}`}>{sumWeights}% / 100%</strong>
            </div>
            
            <button 
              onClick={recalculateEsgScores}
              disabled={!isWeightsValid}
              className={`px-4 py-2 font-bold rounded-xl transition-all ${
                isWeightsValid 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              Apply Weightings
            </button>
          </div>

          {!isWeightsValid && (
            <div className="bg-rose-500/10 text-rose-700 dark:text-rose-400 p-2.5 rounded-xl text-[10px] font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>ESG weights must equal exactly 100% to apply global updates. Adjust ranges accordingly.</span>
            </div>
          )}
        </div>

        {/* Global Business Logic Toggles */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Sliders className="w-5 h-5" /> Automation & Validation Toggles
            </h2>
            <p className="text-xs text-slate-400">Toggle active rules that process transactions, verify approvals, and unlock achievements.</p>
          </div>

          <div className="space-y-4 pt-2">
            
            {/* Toggle 1: Auto Emission Calculation */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-500" /> Auto-Emission Calculation
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Procurement and Fleet records instantly multiply quantities by emission factors and append transactions. Disable to manually override carbon metrics.
                </p>
              </div>
              <button 
                onClick={() => toggleSetting('autoEmission')}
                className="text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                {settings.autoEmission ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
              </button>
            </div>

            {/* Toggle 2: Evidence Requirement */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" /> CSR Activity Evidence Audit
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Enforces that verification documents/receipt files are uploaded before admins can mark a CSR activity as approved.
                </p>
              </div>
              <button 
                onClick={() => toggleSetting('evidenceRequirement')}
                className="text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                {settings.evidenceRequirement ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
              </button>
            </div>

            {/* Toggle 3: Badge Auto-Award */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" /> Badge Auto-Award Logic
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Automatically unlocks achievements and awards badges the moment user XP or challenge thresholds are met. Disable to require manual admin sign-off.
                </p>
              </div>
              <button 
                onClick={() => toggleSetting('badgeAutoAward')}
                className="text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                {settings.badgeAutoAward ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

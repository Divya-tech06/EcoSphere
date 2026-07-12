import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X, Sparkles, Compass, Lightbulb } from 'lucide-react';

export default function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to EcoSphere! 🌎",
      description: "This platform is a dynamic bridge between traditional ERP operations and ESG sustainability metrics. Let's take a quick 1-minute tour to see how it works.",
      icon: Compass,
      color: "text-emerald-500"
    },
    {
      title: "1. Carbon Accounting & ERP Sim",
      description: "Under the Dashboard, check out the 'ERP Operations Simulator'. Try logging a diesel fuel purchase or a manufacturing run. If 'Auto Emission Calculation' is enabled in Settings, the platform immediately calculates CO2 emissions and updates the charts and department ESG ratings dynamically!",
      icon: Lightbulb,
      color: "text-amber-500"
    },
    {
      title: "2. Social & CSR Engagement",
      description: "Under the 'CSR & Social' tab, you can view proposed corporate activities and join them. Try uploading proof files (images/PDFs) to test the 'Evidence Requirement' toggle rule, which prevents admin approval of activities unless proof is attached.",
      icon: HelpCircle,
      color: "text-blue-500"
    },
    {
      title: "3. Governance & Overdue Alarms",
      description: "Under the 'Governance' tab, monitor audits and active compliance deviations. Notice the flashing 'OVERDUE FLAG' on issues whose due date is in the past—they feed the live in-app notification center automatically.",
      icon: Sparkles,
      color: "text-purple-500"
    },
    {
      title: "4. Gamification & Marketplace",
      description: "Earn XP by completing challenges and signing policies. In the 'Gamification' tab, view your badges and try to 'Redeem' rewards in the Marketplace. The system verifies points balances and stock counts in real time, triggering toasts and inventory updates.",
      icon: Compass,
      color: "text-emerald-400"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const ActiveIcon = steps[currentStep].icon;

  return (
    <>
      {/* Floating Tour Toggle button */}
      <button
        onClick={() => { setIsOpen(true); setCurrentStep(0); }}
        className="fixed bottom-6 left-6 z-55 p-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
      >
        <Compass className="w-5.5 h-5.5 animate-spin-slow group-hover:rotate-45 transition-transform" />
        <span className="text-xs font-black tracking-wide pr-1">Interactive Tour</span>
      </button>

      {/* Tour Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/20 dark:border-slate-800 animate-pop-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">EcoSphere Guide</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content step */}
            <div className="py-6 space-y-4 text-center flex flex-col items-center">
              <div className={`p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl ${steps[currentStep].color} shadow-inner`}>
                <ActiveIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black font-outfit text-slate-800 dark:text-slate-100">
                {steps[currentStep].title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Footer / Nav */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold">
                Step {currentStep + 1} of {steps.length}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

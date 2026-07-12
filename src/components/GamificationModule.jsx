import React from 'react';
import { Award, Zap, Users, Trophy, Sparkles, Check, Gift, AlertCircle, ShoppingCart } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function GamificationModule({
  currentUser,
  userXP,
  userPoints,
  badges,
  rewards,
  departments,
  redeemReward,
  settings
}) {

  // Dynamic Icon Renderer
  const renderBadgeIcon = (iconName, className) => {
    const IconComponent = LucideIcons[iconName] || Trophy;
    return <IconComponent className={className} />;
  };

  // Sort departments for the leaderboard
  const sortedDepartments = [...departments].sort((a, b) => b.esgScore - a.esgScore);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black font-outfit shadow-md">
            {currentUser.split(' ').map(n=>n[0]).join('')}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100">{currentUser}</h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Department: Operations</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Level 4 Eco-Leader</span>
            </div>
            {/* XP progress bar */}
            <div className="w-64 pt-2">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                <span>XP PROGRESS</span>
                <span>{userXP} / 1000 XP</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${(userXP / 1000 * 100).toFixed(0)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-200">Redeemable Points</span>
              <h3 className="text-3xl font-black font-outfit">{userPoints} pts</h3>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-emerald-200" />
            </div>
          </div>
          <div className="text-[10px] text-emerald-100 font-medium">
            Redeem points below for real environmental incentives.
          </div>
        </div>
      </div>

      {/* Grid: Badges and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Badges Achievements Gallery */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" /> Achievements & Badges
            </h2>
            <p className="text-xs text-slate-400">
              Earn XP by joining CSR efforts, signing policies, and lowering carbon weights.
              {settings.badgeAutoAward && <strong className="text-emerald-500 ml-1">Badge Auto-Award is ACTIVE.</strong>}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div 
                key={b.id} 
                className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 relative overflow-hidden ${
                  b.unlocked 
                    ? 'bg-emerald-500/5 border-emerald-300 dark:border-emerald-800 animate-pop-in' 
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* Badge Icon circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${
                  b.unlocked 
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {renderBadgeIcon(b.icon, "w-6 h-6")}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{b.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{b.description}</p>
                </div>

                {/* Status indicator */}
                {b.unlocked ? (
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {b.unlockRuleType === 'XP' ? `${b.xpRequirement} XP` : `${b.unlockRuleValue} Challenges`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Department ESG Leaderboard */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-5 h-5" /> ESG Leaderboard
            </h2>
            <p className="text-xs text-slate-400">Compare sustainability indices across organization departments.</p>
          </div>

          <div className="space-y-3">
            {sortedDepartments.map((d, index) => (
              <div key={d.id} className="flex items-center gap-3 p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {/* Ranking Trophy */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                  index === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-850 dark:text-slate-400' :
                  index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' :
                  'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}>
                  {index + 1}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{d.name}</h4>
                  <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.esgScore}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{d.esgScore}</span>
                  <span className="block text-[8px] text-slate-400 uppercase font-bold">Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Rewards Marketplace catalog */}
      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-outfit flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Gift className="w-5 h-5" /> Rewards Marketplace
          </h2>
          <p className="text-xs text-slate-400">Redeem points earned through sustainability achievements for physical eco-incentives.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rewards.map((rew) => {
            const hasStock = rew.stockAvailable > 0;
            const canAfford = userPoints >= rew.pointsCost;

            return (
              <div key={rew.id} className="glass-card glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border-slate-200 dark:border-slate-800">
                {/* Image placeholder */}
                <div className="h-28 overflow-hidden relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <img 
                    src={rew.imagePlaceholder} 
                    alt={rew.title} 
                    className="w-full h-full object-cover opacity-85 transition-transform duration-300 hover:scale-105" 
                  />
                  <span className="absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-950/80 text-slate-600 dark:text-slate-350">
                    {rew.category}
                  </span>
                </div>

                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold leading-normal text-slate-800 dark:text-slate-150 min-h-[32px] line-clamp-2">
                      {rew.title}
                    </h3>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-slate-400">Stock:</span>
                      <span className={`font-bold ${hasStock ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {hasStock ? `${rew.stockAvailable} units` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-slate-400 font-semibold">Cost:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{rew.pointsCost} pts</span>
                    </div>

                    <button 
                      onClick={() => redeemReward(rew.id)}
                      disabled={!hasStock || !canAfford}
                      className={`w-full py-1.5 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 ${
                        !hasStock 
                          ? 'bg-rose-500/10 text-rose-500 cursor-not-allowed' 
                          : !canAfford
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {!hasStock ? 'Out of Stock' : !canAfford ? 'Ins. Points' : 'Redeem'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

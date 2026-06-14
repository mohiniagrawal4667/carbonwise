import React from 'react';
import { motion } from 'motion/react';
import { Badge, Challenge, UserProgress } from '../types';
import { getTodayString } from '../hooks/useCarbonWise';
import { 
  Flame, 
  Leaf, 
  Award, 
  CheckCircle, 
  Lock, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  HelpCircle as CalendarIcon,
  Sparkles,
  BookOpen,
  Bike,
  Lightbulb,
  ShoppingBag,
  Salad,
  Recycle,
  Wind
} from 'lucide-react';

interface ChallengesProps {
  progress: UserProgress;
  badges: Badge[];
  toggleChallenge: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({ progress, badges, toggleChallenge, onNavigate }) => {
  const todayStr = getTodayString();

  // Helper to resolve interactive challenge visual representation
  const challengeIcons: Record<string, React.ReactNode> = {
    'ch-bike': <Bike className="w-5 h-5 text-emerald-500" />,
    'ch-lights': <Lightbulb className="w-5 h-5 text-amber-500" />,
    'ch-containers': <ShoppingBag className="w-5 h-5 text-indigo-500" />,
    'ch-veggie': <Salad className="w-5 h-5 text-emerald-500" />,
    'ch-compost': <Recycle className="w-5 h-5 text-violet-500" />,
    'ch-coldwash': <Wind className="w-5 h-5 text-blue-500" />,
  };

  const badgeIcons: Record<string, React.ReactNode> = {
    'badge-first-calc': <Award className="w-6 h-6 text-indigo-500" />,
    'badge-low-emissions': <Leaf className="w-6 h-6 text-emerald-500" />,
    'badge-green-master': <Award className="w-6 h-6 text-amber-500 animate-pulse" />,
    'badge-streak-3': <Flame className="w-6 h-6 text-orange-500" />,
    'badge-streak-7': <Flame className="w-6 h-6 text-red-500 animate-pulse" />,
    'badge-challenges-3': <Zap className="w-6 h-6 text-blue-500" />,
  };

  const completedTodayList = progress.challenges.filter((ch) => 
    ch.completedDates && ch.completedDates.includes(todayStr)
  );

  const totalEmissionsCalculations = progress.history.length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4 px-4">
      {/* Header section with streak indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Daily eco Challenges & Badges
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Complete daily habitat commitments, preserve climate streaks, and certify your eco achievements.
          </p>
        </div>

        {/* Mega Streak Board */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Streak</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progress.streak} <span className="text-xs font-semibold text-slate-400">Consecutive Days</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Challenges left, Badges right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CHALLENGES COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  Active Commitments Today
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Small, tangible household shifts that trigger dramatic lifetime emissions offsets.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full shrink-0">
                {completedTodayList.length} of {progress.challenges.length} completed
              </span>
            </div>

            {/* Completion Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden flex">
              <motion.div 
                className="h-full bg-emerald-500" 
                layout
                style={{ width: `${(completedTodayList.length / progress.challenges.length) * 100}%` }} 
              />
            </div>

            {/* Interactive Checklist */}
            <div className="space-y-4" role="group" aria-label="Sustainable challenge cards">
              {progress.challenges.map((ch) => {
                const isCompletedToday = ch.completedDates && ch.completedDates.includes(todayStr);
                return (
                  <motion.div
                    key={ch.id}
                    layoutId={ch.id}
                    whileHover={{ scale: 1.005 }}
                    onClick={() => toggleChallenge(ch.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleChallenge(ch.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isCompletedToday}
                    aria-label={`Action: ${ch.title}. ${ch.description}. Reduces emissions by ${ch.co2Reduction} kilograms. Status: ${isCompletedToday ? 'Completed' : 'Not completed'}`}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                      isCompletedToday
                        ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 focus-visible:border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Interactive Custom Checkbox container */}
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition ${
                        isCompletedToday
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950'
                      }`}>
                        {isCompletedToday && <CheckCircle className="w-4 h-4 fill-white text-emerald-500" />}
                      </div>

                      {/* Icon wrapper */}
                      <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center shrink-0">
                        {challengeIcons[ch.id] || <Leaf className="w-5 h-5 text-slate-400" />}
                      </div>

                      <div className="space-y-0.5">
                        <span className={`text-sm font-bold block ${isCompletedToday ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                          {ch.title}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block leading-tight">
                          {ch.description}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        🛡️ -{ch.co2Reduction} kg
                      </span>
                      <span className="text-[9px] text-slate-400">CO2 offset</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty state or encourager */}
            {completedTodayList.length === progress.challenges.length ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs font-semibold leading-relaxed">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-spin" />
                <span>
                  <strong>Ultimate Climate Warrior status unlocked!</strong> You have completed all 100% of your daily habits for today. Continue tomorrow to protect your beautiful streak!
                </span>
              </div>
            ) : totalEmissionsCalculations === 0 ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-xl text-center text-xs text-emerald-800 dark:text-emerald-300 font-semibold cursor-pointer" onClick={() => onNavigate('calculator')}>
                🎯 Run the carbon footprint assessment to benchmark and set baseline emission reductions.
              </div>
            ) : null}
          </div>
        </div>

        {/* BADGES / ACHIEVEMENTS BOARD */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                Eco Credentials
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Unlock official credentials as you build consistent actions or lower emissions.
              </p>
            </div>

            <div className="space-y-4.5">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-xl border flex gap-3 transition-all ${
                      isUnlocked
                        ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-50/20 to-white dark:from-emerald-950/10 dark:to-slate-900'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 opacity-70'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50 border-emerald-250 dark:bg-emerald-950 shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-100 border-slate-200/50 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {isUnlocked ? badgeIcons[badge.id] || <Award className="w-6 h-6 text-emerald-500" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold leading-none ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-450 dark:text-slate-550'}`}>
                          {badge.title}
                        </span>
                        {isUnlocked && (
                          <span className="bg-emerald-500 text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-widest leading-none">
                             unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

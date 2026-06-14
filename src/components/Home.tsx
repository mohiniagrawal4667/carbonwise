import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Award, Compass, TrendingDown, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
  completedChallengesCount: number;
  streak: number;
  hasEmissionsData: boolean;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, completedChallengesCount, streak, hasEmissionsData }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 py-4"
    >
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold tracking-wide border border-emerald-100 dark:border-emerald-900/50"
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>JOIN THE MOVEMENT FOR A COOLER PLANET</span>
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
        >
          Your Journey to a <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
            Carbon-Neutral Life
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Understand your personal ecological impact in minutes. Track your monthly transit, energy, and consumption habits, set achievable reduction targets, and build climate-friendly streaks.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <button
            onClick={() => onNavigate(hasEmissionsData ? 'dashboard' : 'calculator')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-xl transition duration-200 shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/15 flex items-center justify-center gap-2 group cursor-pointer"
            id="cta-calculate"
          >
            <span>{hasEmissionsData ? 'Go to Dashboard' : 'Calculate Your Footprint'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onNavigate('challenges')}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            id="cta-challenges"
          >
            <span>Join Daily Challenges</span>
            {streak > 0 && (
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                🔥 {streak} Day Streak
              </span>
            )}
          </button>
        </motion.div>
      </section>

      {/* Feature Bento-style Grid */}
      <section className="space-y-12 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Real Direct Action
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            CarbonWise goes beyond calculations to foster consistent eco-habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Predefined Scientific Models
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Calculations build directly on EPA and greenhouse gas protocol standards, mapping your transit choices, meat intake, and energy consumption.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 mt-6 flex justify-between items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer" onClick={() => onNavigate('calculator')}>
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Intelligent Dynamic Insights
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Get high-impact recommendations targeting areas where your emissions sit highest. Simple shifts yield substantial cumulative impact over time.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 mt-6 flex justify-between items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <span>Analyze Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Daily Habit Challenges
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Gamify your journey. Complete simple eco-tasks like cold-water washes or zero-plastic habits to build streaks and earn climate-hero achievement badges.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50 mt-6 flex justify-between items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer" onClick={() => onNavigate('challenges')}>
              <span>View Active Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Methodology Panel */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 sm:p-12 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Why Track Your Carbon Footprint?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Global individual emissions average around 5 tonnes (5,000 kg) of CO2 per year, but to reach carbon neutral goals, we must align closer to 2 tonnes. Knowing your footprint is the critical first stage of targeted reduction.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>100% Client-Side Privacy:</strong> Your data survives safely in your browser local storage. No tracking trackers, no third-party data sales.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>Action-Led Rewards:</strong> Earn badges to certify your commitment as you make incremental, real improvements.
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 h-full">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <span>Current Climate Goals</span>
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Target Individual Footprint</span>
                <span>Average Global Footprint</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '30%' }} title="Target (240kg/mo)" />
                <div className="h-full bg-slate-300 dark:bg-slate-700" style={{ width: '70%' }} title="Current (650kg/mo)" />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                Our base target is configured at 400 kg CO2e per month, representing a sustainable milestone towards personal carbon budget alignments.
              </p>
            </div>
            <button
              onClick={() => onNavigate('calculator')}
              className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-400 font-semibold rounded-lg text-sm transition text-center cursor-pointer"
            >
              Start Carbon Assessment
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

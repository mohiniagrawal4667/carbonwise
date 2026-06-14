import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CalculatorInputs, EmissionsBreakdown } from '../types';
import { getRecommendations, Recommendation } from '../utils/recommendations';
import { 
  Compass, 
  HelpCircle, 
  Zap, 
  Car, 
  Salad, 
  Trash2, 
  CheckCircle, 
  Sparkles,
  Filter
} from 'lucide-react';

interface RecommendationsProps {
  latestInputs: CalculatorInputs | null;
  latestBreakdown: EmissionsBreakdown | null;
  onNavigate: (tab: string) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ 
  latestInputs, 
  latestBreakdown,
  onNavigate 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'transport' | 'electricity' | 'food' | 'waste'>('all');
  const [committedIds, setCommittedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('carbonwise_committed_recs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const recommendations = useMemo(() => {
    if (!latestInputs || !latestBreakdown) return [];
    return getRecommendations(latestInputs, latestBreakdown);
  }, [latestInputs, latestBreakdown]);

  const handleCommitToggle = (id: string) => {
    setCommittedIds(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      localStorage.setItem('carbonwise_committed_recs', JSON.stringify(next));
      return next;
    });
  };

  const filteredRecommendations = useMemo(() => {
    if (selectedFilter === 'all') return recommendations;
    return recommendations.filter(rec => rec.category === selectedFilter);
  }, [recommendations, selectedFilter]);

  const categoryIcons = {
    transport: <Car className="w-5 h-5 text-blue-500" />,
    electricity: <Zap className="w-5 h-5 text-amber-500" />,
    food: <Salad className="w-5 h-5 text-emerald-500" />,
    waste: <Trash2 className="w-5 h-5 text-violet-500" />,
  };

  if (!latestInputs || !latestBreakdown || recommendations.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6 px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 bg-slate-50 dark:bg-slate-800/60 rounded-full flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800"
        >
          <HelpCircle className="w-8 h-8 text-indigo-500" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white">
            Looking for Eco Advice?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Run the calculator module first. CarbonWise will dynamically generate tailored advice to help reduce your specific transportation, energy, or diet footprint!
          </p>
        </div>

        <button
          onClick={() => onNavigate('calculator')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition duration-200 cursor-pointer"
        >
          Check Emissions Now
        </button>
      </div>
    );
  }

  // Calculate potential footprint relief
  const potentialSavings = recommendations.reduce((acc, rec) => acc + rec.estimatedSavings, 0);
  const committedSavings = recommendations
    .filter(rec => committedIds.includes(rec.id))
    .reduce((acc, rec) => acc + rec.estimatedSavings, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Rule-Based Recommendations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Action items specifically computed to target the highest emission cells in your profile.
          </p>
        </div>

        {/* Dynamic Saving Stats */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div className="space-y-0.5 text-right">
            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Potential Monthly Relief</span>
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {committedSavings} <span className="text-xs font-semibold text-emerald-600">/ {potentialSavings} kg CO2e</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            🌱
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {[
          { key: 'all', label: 'All recommendations' },
          { key: 'transport', label: 'Transportation' },
          { key: 'electricity', label: 'Household energy' },
          { key: 'food', label: 'Habits & Diet' },
          { key: 'waste', label: 'Recycling & Waste' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              selectedFilter === filter.key
                ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/10'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecommendations.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center col-span-2 space-y-2 text-slate-400 text-sm">
            <Compass className="w-8 h-8 mx-auto stroke-1" />
            <p>No actionable items matching this category found.</p>
          </div>
        ) : (
          filteredRecommendations.map((rec) => {
            const isCommitted = committedIds.includes(rec.id);
            return (
              <motion.div
                key={rec.id}
                layoutId={rec.id}
                className={`p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm flex flex-col justify-between transition-all ${
                  isCommitted 
                    ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  {/* Category + Impact Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        {categoryIcons[rec.category]}
                      </div>
                      <span className="text-xs font-bold text-slate-400 capitalize">{rec.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rec.impact === 'high' 
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' 
                          : rec.impact === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                          : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                      }`}>
                        {rec.impact} impact
                      </span>

                      <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                        🛡️ -{rec.estimatedSavings} kg/mo
                      </span>
                    </div>
                  </div>

                  {/* Recommendation copy */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[50px]">
                    {rec.text}
                  </p>
                </div>

                {/* Commit Action trigger */}
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/40 mt-6 flex justify-between items-center gap-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    {isCommitted ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-50" /> Committed!
                      </span>
                    ) : (
                      <span>Uncommitted</span>
                    )}
                  </span>

                  <button
                    onClick={() => handleCommitToggle(rec.id)}
                    aria-label={isCommitted ? `Cancel monthly commitment for: ${rec.text}` : `Commit to action: ${rec.text}`}
                    aria-pressed={isCommitted}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                      isCommitted
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-sm'
                    }`}
                  >
                    {isCommitted ? (
                      <span>Cancel commitment</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>Commit to this action</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

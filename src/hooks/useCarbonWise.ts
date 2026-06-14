import { useState, useEffect, useCallback, useMemo } from 'react';
import { CalculatorInputs, EmissionsBreakdown, HistoryEntry, Badge, Challenge, UserProgress } from '../types';
import { calculateMonthlyEmissions, calculateEcoScore, AVERAGE_MONTHLY_EMISSIONS } from '../utils/calculator';
import confetti from 'canvas-confetti';

const LOCAL_STORAGE_KEY = 'carbonwise_user_progress';

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'ch-bike', title: 'Pedal Power', description: 'Swap driving for walking, running, or cycling today', category: 'transport', co2Reduction: 2.5, isCompleted: false, completedDates: [] },
  { id: 'ch-lights', title: 'Vampire Slayer', description: 'Unplug idle electronic chargers and standby equipment today', category: 'energy', co2Reduction: 0.8, isCompleted: false, completedDates: [] },
  { id: 'ch-containers', title: 'Single-Use Shield', description: 'Decline single-use plastics Bags, Straws, or plastic Cups', category: 'waste', co2Reduction: 0.6, isCompleted: false, completedDates: [] },
  { id: 'ch-veggie', title: 'Plant Champion', description: 'Eat entirely vegan or vegetarian meals for breakfast, lunch, and dinner', category: 'consumption', co2Reduction: 3.5, isCompleted: false, completedDates: [] },
  { id: 'ch-compost', title: 'Scrap Alchemy', description: 'Compost organic scraps or recycle 100% of your metal & glass waste today', category: 'waste', co2Reduction: 0.7, isCompleted: false, completedDates: [] },
  { id: 'ch-coldwash', title: 'Chilly Spin', description: 'Run a laundry cycle on cold instead of hot, or line-dry all clothes', category: 'energy', co2Reduction: 1.2, isCompleted: false, completedDates: [] },
];

export const ALL_BADGES: Badge[] = [
  { id: 'badge-first-calc', title: 'Carbon Pioneer', description: 'Calculate your carbon footprint for the first time', icon: 'Calculator', category: 'calculator' },
  { id: 'badge-low-emissions', title: 'Eco Guardian', description: 'Achieve emissions below the national average (650 kg CO2e)', icon: 'Leaf', category: 'reduction' },
  { id: 'badge-green-master', title: 'Green Master', description: 'Attain a stellar Eco-Score of 90 or higher', icon: 'Award', category: 'reduction' },
  { id: 'badge-streak-3', title: 'Eco Enthusiast', description: 'Reach a challenge streak of 3 consecutive days', icon: 'Flame', category: 'streak' },
  { id: 'badge-streak-7', title: 'Planet Champion', description: 'Reach a challenge streak of 7 consecutive days', icon: 'ShieldAlert', category: 'streak' },
  { id: 'badge-challenges-3', title: 'Action Hero', description: 'Successfully complete a total of 3 eco-friendly daily challenges', icon: 'Zap', category: 'challenges' },
];

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current consecutive day streak based on challenge completion dates.
 * completedDates format: "YYYY-MM-DD"
 */
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  // Filter distinct dates and sort descending
  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  const latestDate = uniqueDates[0];

  // If latest completion wasn't today or yesterday, streak is broken
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  let currentDateObj = new Date(latestDate);

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDateStr = uniqueDates[i];
    const prevDateObj = new Date(prevDateStr);

    // Calculate difference in calendar days
    // Working with YYYY-MM-DD strings avoids simple timezone-related pitfalls
    const expectedPrevObj = new Date(currentDateObj);
    expectedPrevObj.setDate(currentDateObj.getDate() - 1);
    
    const formattedExpected = expectedPrevObj.toISOString().split('T')[0];

    if (prevDateStr === formattedExpected) {
      streak++;
      currentDateObj = prevDateObj;
    } else {
      break; // Gap detected, streak ends here
    }
  }

  return streak;
}

export function useCarbonWise() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const fallbackProgress: UserProgress = {
      challenges: DEFAULT_CHALLENGES.map((ch) => ({ ...ch, isCompleted: false, completedDates: ch.completedDates || [] })),
      history: [],
      unlockedBadgeIds: [],
      streak: 0,
      totalReductionSaved: 0,
    };

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Deconstruct and deeply validate parameters
          const historySanitized: HistoryEntry[] = [];
          if (Array.isArray(parsed.history)) {
            parsed.history.forEach((entry: any) => {
              if (
                entry &&
                typeof entry.id === 'string' &&
                typeof entry.date === 'string' &&
                entry.inputs &&
                entry.breakdown &&
                typeof entry.breakdown.total === 'number' &&
                typeof entry.ecoScore === 'number'
              ) {
                // Ensure inputs has standard bounds
                const inp = entry.inputs;
                const sanitizedInputs: CalculatorInputs = {
                  carType: ['petrol', 'diesel', 'hybrid', 'electric', 'none'].includes(inp.carType) ? inp.carType : 'petrol',
                  carDistance: Math.max(0, Number(inp.carDistance) || 0),
                  busDistance: Math.max(0, Number(inp.busDistance) || 0),
                  trainDistance: Math.max(0, Number(inp.trainDistance) || 0),
                  bicycleDistance: Math.max(0, Number(inp.bicycleDistance) || 0),
                  walkingDistance: Math.max(0, Number(inp.walkingDistance) || 0),
                  electricity: Math.max(0, Number(inp.electricity) || 0),
                  foodHabit: ['vegetarian', 'mixed', 'non-vegetarian'].includes(inp.foodHabit) ? inp.foodHabit : 'mixed',
                  wasteHabit: ['none', 'some', 'all'].includes(inp.wasteHabit) ? inp.wasteHabit : 'some',
                  targetReduction: typeof inp.targetReduction === 'number' ? Math.max(0, Math.min(100, inp.targetReduction)) : undefined,
                };

                const bd = entry.breakdown;
                const sanitizedBreakdown: EmissionsBreakdown = {
                  transport: Math.max(0, Number(bd.transport) || 0),
                  electricity: Math.max(0, Number(bd.electricity) || 0),
                  food: Math.max(0, Number(bd.food) || 0),
                  waste: Math.max(0, Number(bd.waste) || 0),
                  total: Math.max(0, Number(bd.total) || 0),
                };

                historySanitized.push({
                  id: String(entry.id).replace(/[<>]/g, ''), // Strip tags for basic script sanitization
                  date: String(entry.date).replace(/[<>]/g, ''),
                  inputs: sanitizedInputs,
                  breakdown: sanitizedBreakdown,
                  ecoScore: Math.max(10, Math.min(100, Number(entry.ecoScore) || 50)),
                });
              }
            });
          }

          const challengesSanitized: Challenge[] = DEFAULT_CHALLENGES.map((defaultCh) => {
            const matches = Array.isArray(parsed.challenges) ? parsed.challenges.find((c: any) => c && c.id === defaultCh.id) : null;
            return {
              ...defaultCh,
              isCompleted: matches ? Boolean(matches.isCompleted) : false,
              completedDates: matches && Array.isArray(matches.completedDates) 
                ? matches.completedDates.map((d: any) => String(d).replace(/[<>]/g, '')) 
                : [],
            };
          });

          const unlockedBadgeIdsSanitized: string[] = [];
          if (Array.isArray(parsed.unlockedBadgeIds)) {
            parsed.unlockedBadgeIds.forEach((id: any) => {
              if (typeof id === 'string' && ALL_BADGES.some(b => b.id === id)) {
                unlockedBadgeIdsSanitized.push(id);
              }
            });
          }

          const streakSanitized = Math.max(0, Number(parsed.streak) || 0);
          const totalReductionSavedSanitized = Math.max(0, Number(parsed.totalReductionSaved) || 0);

          return {
            challenges: challengesSanitized,
            history: historySanitized,
            unlockedBadgeIds: unlockedBadgeIdsSanitized,
            streak: streakSanitized,
            totalReductionSaved: parseFloat(totalReductionSavedSanitized.toFixed(1)),
            lastChallengeDate: typeof parsed.lastChallengeDate === 'string' ? parsed.lastChallengeDate.replace(/[<>]/g, '') : undefined,
          };
        }
      }
    } catch (e) {
      console.error('Error parsing localStorage progress:', e);
    }
    return fallbackProgress;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to write progress to localStorage:', e);
    }
  }, [progress]);

  // Check and unlock badges based on latest progress
  const checkAndUnlockBadges = useCallback((
    historyList: HistoryEntry[],
    completedDates: string[],
    activeStreak: number,
    unlockedList: string[]
  ) => {
    const newlyUnlocked: string[] = [...unlockedList];
    let triggeredConfetti = false;

    ALL_BADGES.forEach((badge) => {
      if (newlyUnlocked.includes(badge.id)) return;

      let meetsCriteria = false;

      switch (badge.id) {
        case 'badge-first-calc':
          meetsCriteria = historyList.length >= 1;
          break;
        case 'badge-low-emissions':
          if (historyList.length >= 1) {
            const latest = historyList[historyList.length - 1];
            meetsCriteria = latest.breakdown.total < AVERAGE_MONTHLY_EMISSIONS;
          }
          break;
        case 'badge-green-master':
          if (historyList.length >= 1) {
            const latest = historyList[historyList.length - 1];
            meetsCriteria = latest.ecoScore >= 90;
          }
          break;
        case 'badge-streak-3':
          meetsCriteria = activeStreak >= 3;
          break;
        case 'badge-streak-7':
          meetsCriteria = activeStreak >= 7;
          break;
        case 'badge-challenges-3':
          meetsCriteria = completedDates.length >= 3;
          break;
      }

      if (meetsCriteria) {
        newlyUnlocked.push(badge.id);
        triggeredConfetti = true;
      }
    });

    if (triggeredConfetti) {
      // Trigger user gratification effects!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#3b82f6'],
      });
    }

    return newlyUnlocked;
  }, []);

  // Submit calculator inputs & save to history
  const addHistoryEntry = useCallback((inputs: CalculatorInputs) => {
    const breakdown = calculateMonthlyEmissions(inputs);
    const ecoScore = calculateEcoScore(breakdown.total);
    
    const newEntry: HistoryEntry = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: getTodayString(),
      inputs,
      breakdown,
      ecoScore,
    };

    setProgress((prev) => {
      const updatedHistory = [...prev.history, newEntry];
      
      // Accumulate all completion dates for streak checking
      const allCompletionDates: string[] = [];
      prev.challenges.forEach((ch) => {
        if (ch.completedDates) {
          allCompletionDates.push(...ch.completedDates);
        }
      });
      const activeStreak = calculateStreak(allCompletionDates);

      const updatedUnlocked = checkAndUnlockBadges(
        updatedHistory,
        allCompletionDates,
        activeStreak,
        prev.unlockedBadgeIds
      );

      return {
        ...prev,
        history: updatedHistory,
        unlockedBadgeIds: updatedUnlocked,
      };
    });

    return newEntry;
  }, [checkAndUnlockBadges]);

  // Toggle challenge completion status for today
  const toggleChallengeCompletion = useCallback((challengeId: string) => {
    const todayStr = getTodayString();

    setProgress((prev) => {
      let challengeReductionSavedDiff = 0;

      const updatedChallenges = prev.challenges.map((ch) => {
        if (ch.id !== challengeId) return ch;

        const dates = ch.completedDates ? [...ch.completedDates] : [];
        const dateIndex = dates.indexOf(todayStr);
        let completedToday = false;

        if (dateIndex > -1) {
          // Cancel completion
          dates.splice(dateIndex, 1);
          challengeReductionSavedDiff -= ch.co2Reduction;
          completedToday = false;
        } else {
          // Confirm completion
          dates.push(todayStr);
          challengeReductionSavedDiff += ch.co2Reduction;
          completedToday = true;
          // Small reward confetti for single task completion
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#10b981', '#60a5fa'],
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#60a5fa'],
          });
        }

        return {
          ...ch,
          isCompleted: completedToday,
          completedDates: dates,
        };
      });

      // Recalculate streak
      const allCompletionDates: string[] = [];
      updatedChallenges.forEach((ch) => {
        if (ch.completedDates) {
          allCompletionDates.push(...ch.completedDates);
        }
      });
      const newStreak = calculateStreak(allCompletionDates);

      const nextReductionSaved = Math.max(0, prev.totalReductionSaved + challengeReductionSavedDiff);

      const nextUnlocked = checkAndUnlockBadges(
        prev.history,
        allCompletionDates,
        newStreak,
        prev.unlockedBadgeIds
      );

      return {
        ...prev,
        challenges: updatedChallenges,
        streak: newStreak,
        totalReductionSaved: parseFloat(nextReductionSaved.toFixed(1)),
        unlockedBadgeIds: nextUnlocked,
        lastChallengeDate: allCompletionDates.length > 0 ? getTodayString() : undefined,
      };
    });
  }, [checkAndUnlockBadges]);

  // Reset entire application data back to initial defaults
  const resetAllData = useCallback(() => {
    setProgress({
      challenges: DEFAULT_CHALLENGES.map((ch) => ({ ...ch, isCompleted: false, completedDates: [] })),
      history: [],
      unlockedBadgeIds: [],
      streak: 0,
      totalReductionSaved: 0,
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    confetti({
      particleCount: 30,
      spread: 40,
      colors: ['#f43f5e'],
    });
  }, []);

  // Update a target reduction percentage
  const updateTargetReduction = useCallback((targetPercentage: number) => {
    setProgress((prev) => {
      if (prev.history.length === 0) return prev;
      
      const latestIndex = prev.history.length - 1;
      const latest = prev.history[latestIndex];
      const updatedLatest: HistoryEntry = {
        ...latest,
        inputs: {
          ...latest.inputs,
          targetReduction: targetPercentage,
        },
      };

      const nextHistory = [...prev.history];
      nextHistory[latestIndex] = updatedLatest;

      return {
        ...prev,
        history: nextHistory,
      };
    });
  }, []);

  // Derived Values Memoized for extreme rendering efficiency
  const latestEmissions = useMemo(() => {
    if (progress.history.length === 0) return null;
    return progress.history[progress.history.length - 1];
  }, [progress.history]);

  const badges = useMemo(() => {
    return ALL_BADGES.map((badge) => ({
      ...badge,
      unlockedAt: progress.unlockedBadgeIds.includes(badge.id) ? getTodayString() : undefined,
    }));
  }, [progress.unlockedBadgeIds]);

  return {
    progress,
    latestEmissions,
    badges,
    addHistoryEntry,
    toggleChallengeCompletion,
    resetAllData,
    updateTargetReduction,
  };
}

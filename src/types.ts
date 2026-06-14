export type CarType = 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
export type FoodHabit = 'vegetarian' | 'mixed' | 'non-vegetarian';
export type WasteHabit = 'none' | 'some' | 'all';

export interface CalculatorInputs {
  carType: CarType;
  carDistance: number; // km per month
  busDistance: number; // km per month
  trainDistance: number; // km per month
  bicycleDistance: number; // km per month
  walkingDistance: number; // km per month
  electricity: number; // kWh per month
  foodHabit: FoodHabit;
  wasteHabit: WasteHabit;
  targetReduction?: number; // percentage (e.g. 10% to 50%)
}

export interface EmissionsBreakdown {
  transport: number; // kg CO2e
  electricity: number; // kg CO2e
  food: number; // kg CO2e
  waste: number; // kg CO2e
  total: number; // kg CO2e
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  inputs: CalculatorInputs;
  breakdown: EmissionsBreakdown;
  ecoScore: number;
}

export type BadgeCategory = 'calculator' | 'challenges' | 'history' | 'streak' | 'reduction';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  category: BadgeCategory;
  unlockedAt?: string; // date string when unlocked
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'consumption' | 'waste';
  co2Reduction: number; // estimated dynamic daily kg CO2 saved
  isCompleted: boolean;
  completedDates?: string[]; // list of 'YYYY-MM-DD' dates completed
}

export interface UserProgress {
  challenges: Challenge[];
  history: HistoryEntry[];
  unlockedBadgeIds: string[];
  streak: number;
  lastChallengeDate?: string; // YYYY-MM-DD of last challenge completed
  totalReductionSaved: number; // kg of cumulative CO2 saved from challenges
}

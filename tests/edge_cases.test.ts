import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateMonthlyEmissions, calculateEcoScore } from '../src/utils/calculator';
import { getRecommendations } from '../src/utils/recommendations';
import { CalculatorSchema } from '../src/lib/validation';
import { calculateStreak } from '../src/hooks/useCarbonWise';
import { CalculatorInputs, UserProgress } from '../src/types';

describe('CarbonWise Robust Edge Case Suite', () => {

  describe('Calculator Core Math - Extremes & NaNs', () => {
    it('handles NaN gracefully by falling back to zero calculations', () => {
      const inputs: any = {
        carType: 'electric',
        carDistance: NaN,
        busDistance: undefined,
        trainDistance: null,
        bicycleDistance: NaN,
        walkingDistance: undefined,
        electricity: NaN,
        foodHabit: 'mixed',
        wasteHabit: 'some',
      };

      const breakdown = calculateMonthlyEmissions(inputs);

      // Verify no NaNs are output in our final calculations
      expect(breakdown.transport).toBe(0);
      expect(breakdown.electricity).toBe(0);
      expect(breakdown.food).toBe(190); // default mixed factor
      expect(breakdown.waste).toBe(25); // default some factor
      expect(breakdown.total).toBe(215);
      expect(Number.isNaN(breakdown.total)).toBe(false);
    });

    it('correctly manages massive scale inputs without causing overflows or infinity', () => {
      const inputs: CalculatorInputs = {
        carType: 'diesel',
        carDistance: 1_000_000_000, // 1 billion km
        busDistance: 500_000_000,
        trainDistance: 250_000_000,
        bicycleDistance: 100_000,
        walkingDistance: 100_000,
        electricity: 500_000_000, // 500M kWh
        foodHabit: 'non-vegetarian',
        wasteHabit: 'none',
      };

      const breakdown = calculateMonthlyEmissions(inputs);

      expect(breakdown.total).toBeGreaterThan(1_000_000);
      expect(Number.isFinite(breakdown.total)).toBe(true);
    });

    it('clamps eco-score bounds perfectly at extremes (under 0 total and huge totals)', () => {
      // Negative / zero total emissions
      expect(calculateEcoScore(0)).toBe(100);
      expect(calculateEcoScore(-500)).toBe(100);

      // Huge footprint
      expect(calculateEcoScore(999_999_999)).toBe(10); // Minimum clamped score is 10
    });
  });

  describe('Zod Schema Inputs Validation - Edge Cases', () => {
    it('correctly coerced string version numbers to numeric values, or blocks non-coercible input styles', () => {
      const coercibleInputObj = {
        carType: 'petrol',
        carDistance: '250', // Coercible string
        busDistance: '     040 ', // Coercible string with whitespaces
        trainDistance: '0',
        bicycleDistance: '0',
        walkingDistance: '0',
        electricity: '320.5', // Coercible floating point
        foodHabit: 'vegetarian',
        wasteHabit: 'all',
        targetReduction: '15',
      };

      const result = CalculatorSchema.safeParse(coercibleInputObj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.carDistance).toBe(250);
        expect(result.data.busDistance).toBe(40);
        expect(result.data.electricity).toBe(320.5);
        expect(result.data.targetReduction).toBe(15);
      }
    });

    it('rigorously rejects completely empty structures, invalid enums, or non-numeric parameters', () => {
      const emptyInputObj = {};
      const badEnumsInputObj = {
        carType: 'flying-car', // invalid enum
        carDistance: 100,
        busDistance: 0,
        trainDistance: 0,
        bicycleDistance: 0,
        walkingDistance: 0,
        electricity: 150,
        foodHabit: 'only-beef', // invalid enum
        wasteHabit: 'some',
      };
      const textInputObj = {
        carType: 'hybrid',
        carDistance: 'not-a-number-at-all',
        busDistance: 0,
        trainDistance: 0,
        bicycleDistance: 0,
        walkingDistance: 0,
        electricity: 150,
        foodHabit: 'mixed',
        wasteHabit: 'some',
      };

      expect(CalculatorSchema.safeParse(emptyInputObj).success).toBe(false);
      expect(CalculatorSchema.safeParse(badEnumsInputObj).success).toBe(false);
      expect(CalculatorSchema.safeParse(textInputObj).success).toBe(false);
    });
  });

  describe('Recommendation System - Extreme Combinations', () => {
    it('produces correct minimal/empty recommendations when inputs are zero or perfect', () => {
      const inputs: CalculatorInputs = {
        carType: 'none',
        carDistance: 0,
        busDistance: 0,
        trainDistance: 0,
        bicycleDistance: 0,
        walkingDistance: 0,
        electricity: 0,
        foodHabit: 'vegetarian',
        wasteHabit: 'all',
      };

      const breakdown = calculateMonthlyEmissions(inputs);
      const recommendations = getRecommendations(inputs, breakdown);

      // Even with 0 emissions, it should only offer general eco recommendations (like planning meals or using reusables)
      // but should NOT recommend EV upgrades, LED replacements, or starting to recycle
      expect(recommendations.some(r => r.id === 'rec-hybrid-elec')).toBe(false);
      expect(recommendations.some(r => r.id === 'rec-start-recycling')).toBe(false);
      expect(recommendations.some(r => r.id === 'rec-led-lights')).toBe(false);

      // Generics are fine
      expect(recommendations.some(r => r.id === 'rec-food-waste')).toBe(true);
      expect(recommendations.some(r => r.id === 'rec-reusables')).toBe(true);
    });

    it('recommends short distance walk-bike solutions under limit', () => {
      const inputs: CalculatorInputs = {
        carType: 'petrol',
        carDistance: 50, // Short driving distance
        busDistance: 0,
        trainDistance: 0,
        bicycleDistance: 0,
        walkingDistance: 0,
        electricity: 50,
        foodHabit: 'vegetarian',
        wasteHabit: 'all',
      };

      const breakdown = calculateMonthlyEmissions(inputs);
      const recommendations = getRecommendations(inputs, breakdown);

      expect(recommendations.some(r => r.id === 'rec-walk-bike')).toBe(true);
    });
  });

  describe('Consecutive Day Streak - Dynamic Transitions', () => {
    it('returns 0 when dates have a multi-day break gap', () => {
      // Mocking target current system date to June 14, 2026
      const mockToday = new Date('2026-06-14T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockToday);

      const completedDates = ['2026-06-14', '2026-06-11', '2026-06-10'];
      const streak = calculateStreak(completedDates);
      expect(streak).toBe(1); // Today is 1, but June 13th is missing, so streak breaks

      vi.useRealTimers();
    });

    it('properly tracks the streak across monthly borders (e.g. May 31 to June 1)', () => {
      // Let system time be June 1st
      const mockJuneFirst = new Date('2026-06-01T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(mockJuneFirst);

      // Completed on June 1st, May 31st, May 30th
      const completedDates = ['2026-06-01', '2026-05-31', '2026-05-30'];
      const streak = calculateStreak(completedDates);
      expect(streak).toBe(3);

      vi.useRealTimers();
    });
  });

});

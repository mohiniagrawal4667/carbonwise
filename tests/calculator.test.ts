import { describe, it, expect } from 'vitest';
import { calculateMonthlyEmissions, calculateEcoScore, EMISSION_FACTORS } from '../src/utils/calculator';
import { CalculatorInputs } from '../src/types';

describe('Carbon Calculation Core Logic', () => {
  it('correctly calculates emissions for a diverse set of habits', () => {
    const inputs: CalculatorInputs = {
      carType: 'petrol',
      carDistance: 100, // 100 * 0.18 = 18
      busDistance: 50,  // 50 * 0.08 = 4
      trainDistance: 200, // 200 * 0.04 = 8
      bicycleDistance: 30, // 0
      walkingDistance: 40, // 0
      electricity: 150, // 150 * 0.45 = 67.5
      foodHabit: 'vegetarian', // 120
      wasteHabit: 'some', // 25
      targetReduction: 20,
    };

    const breakdown = calculateMonthlyEmissions(inputs);

    // Transport: 18 + 4 + 8 = 30
    expect(breakdown.transport).toBe(30);

    // Electricity: 67.5
    expect(breakdown.electricity).toBe(67.5);

    // Food: 120
    expect(breakdown.food).toBe(120);

    // Waste: 25
    expect(breakdown.waste).toBe(25);

    // Total: 30 + 67.5 + 120 + 25 = 242.5
    expect(breakdown.total).toBe(242.5);
  });

  it('handles zero or malformed inputs sanitarily with sensible fallback default coordinates', () => {
    const inputs: CalculatorInputs = {
      carType: 'none',
      carDistance: -100, // Negative check
      busDistance: 0,
      trainDistance: 0,
      bicycleDistance: 0,
      walkingDistance: 0,
      electricity: -50, // Negative check
      foodHabit: 'vegetarian',
      wasteHabit: 'all', // 10
    };

    const breakdown = calculateMonthlyEmissions(inputs);

    expect(breakdown.transport).toBe(0);
    expect(breakdown.electricity).toBe(0);
    expect(breakdown.food).toBe(120);
    expect(breakdown.waste).toBe(10);
    expect(breakdown.total).toBe(130);
  });

  it('correctly computes standard eco score boundaries', () => {
    const perfectScore = calculateEcoScore(0);
    expect(perfectScore).toBe(100);

    const averageEmissionsScore = calculateEcoScore(650);
    // 100 * (1 - 650/1200) = 45.8 ~ 46
    expect(averageEmissionsScore).toBe(46);

    const exceptionallyHighEmissionsScore = calculateEcoScore(1600);
    // Should clamp safely to the minimum baseline of 10
    expect(exceptionallyHighEmissionsScore).toBe(10);
  });
});

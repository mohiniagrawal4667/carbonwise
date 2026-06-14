import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendations';
import { CalculatorInputs, EmissionsBreakdown } from '../src/types';

describe('Rule-Based Recommendations Engine', () => {
  it('recommends EV switches and transit options when transport emissions are high', () => {
    const inputs: CalculatorInputs = {
      carType: 'diesel',
      carDistance: 1200,
      busDistance: 0,
      trainDistance: 0,
      bicycleDistance: 0,
      walkingDistance: 0,
      electricity: 100,
      foodHabit: 'vegetarian',
      wasteHabit: 'all',
    };

    const breakdown: EmissionsBreakdown = {
      transport: 204, // High driving
      electricity: 45,
      food: 120,
      waste: 10,
      total: 379,
    };

    const recs = getRecommendations(inputs, breakdown);

    const hasHVECOption = recs.some(r => r.id === 'rec-hybrid-elec');
    const hasPublicTransitOption = recs.some(r => r.id === 'rec-public-transport');

    expect(hasHVECOption).toBe(true);
    expect(hasPublicTransitOption).toBe(true);
  });

  it('suggests plant-based habits for non-vegetarian profiles', () => {
    const inputs: CalculatorInputs = {
      carType: 'none',
      carDistance: 0,
      busDistance: 0,
      trainDistance: 0,
      bicycleDistance: 0,
      walkingDistance: 0,
      electricity: 100,
      foodHabit: 'non-vegetarian',
      wasteHabit: 'all',
    };

    const breakdown: EmissionsBreakdown = {
      transport: 0,
      electricity: 45,
      food: 280, // High food
      waste: 10,
      total: 335,
    };

    const recs = getRecommendations(inputs, breakdown);
    const hasMeatlessOption = recs.some(r => r.id === 'rec-meatless-monday');

    expect(hasMeatlessOption).toBe(true);
  });

  it('urges circular waste systems when recycle level is none', () => {
    const inputs: CalculatorInputs = {
      carType: 'none',
      carDistance: 0,
      busDistance: 0,
      trainDistance: 0,
      bicycleDistance: 0,
      walkingDistance: 0,
      electricity: 100,
      foodHabit: 'vegetarian',
      wasteHabit: 'none',
    };

    const breakdown: EmissionsBreakdown = {
      transport: 0,
      electricity: 45,
      food: 120,
      waste: 50, // No recycling
      total: 215,
    };

    const recs = getRecommendations(inputs, breakdown);
    const hasSortingPrompt = recs.some(r => r.id === 'rec-start-recycling');

    expect(hasSortingPrompt).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { CalculatorSchema } from '../src/lib/validation';

describe('Calculator Zod Inputs Validation', () => {
  it('passes on valid standard input parameters', () => {
    const validInputs = {
      carType: 'hybrid',
      carDistance: 120,
      busDistance: 30,
      trainDistance: 10,
      bicycleDistance: 15,
      walkingDistance: 25,
      electricity: 140,
      foodHabit: 'mixed',
      wasteHabit: 'some',
      targetReduction: 25,
    };

    const parseResult = CalculatorSchema.safeParse(validInputs);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      expect(parseResult.data.carDistance).toBe(120);
    }
  });

  it('rejects negative distance parameters or invalid food keys', () => {
    const invalidInputs = {
      carType: 'diesel',
      carDistance: -50, // NEGATIVE - should fail
      busDistance: 30,
      trainDistance: 10,
      bicycleDistance: 15,
      walkingDistance: 25,
      electricity: 140,
      foodHabit: 'very-high-meat', // INVALID habit - should fail
      wasteHabit: 'some',
    };

    const parseResult = CalculatorSchema.safeParse(invalidInputs);
    expect(parseResult.success).toBe(false);
  });
});

import { z } from 'zod';

export const CalculatorSchema = z.object({
  carType: z.enum(['petrol', 'diesel', 'hybrid', 'electric', 'none']),
  carDistance: z
    .coerce
    .number()
    .nonnegative('Distance cannot be negative'),
  busDistance: z
    .coerce
    .number()
    .nonnegative('Distance cannot be negative'),
  trainDistance: z
    .coerce
    .number()
    .nonnegative('Distance cannot be negative'),
  bicycleDistance: z
    .coerce
    .number()
    .nonnegative('Distance cannot be negative'),
  walkingDistance: z
    .coerce
    .number()
    .nonnegative('Distance cannot be negative'),
  electricity: z
    .coerce
    .number()
    .nonnegative('Electricity usage cannot be negative'),
  foodHabit: z.enum(['vegetarian', 'mixed', 'non-vegetarian']),
  wasteHabit: z.enum(['none', 'some', 'all']),
  targetReduction: z
    .coerce
    .number()
    .min(0, 'Target cannot be negative')
    .max(100, 'Target reduction cannot exceed 100%')
    .optional(),
});

export type CalculatorSchemaType = z.infer<typeof CalculatorSchema>;

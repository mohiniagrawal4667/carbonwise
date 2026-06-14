import { CalculatorInputs, EmissionsBreakdown } from '../types';

// Emission factors in kg CO2e per unit
export const EMISSION_FACTORS = {
  car: {
    petrol: 0.18,   // kg CO2e per km
    diesel: 0.17,   // kg CO2e per km
    hybrid: 0.10,   // kg CO2e per km
    electric: 0.05, // kg CO2e per km
    none: 0,
  },
  bus: 0.08,        // kg CO2e per km
  train: 0.04,      // kg CO2e per km
  electricity: 0.45, // kg CO2e per kWh
  food: {
    vegetarian: 120,    // kg CO2e per month
    mixed: 190,         // kg CO2e per month
    'non-vegetarian': 280, // kg CO2e per month
  },
  waste: {
    none: 50,  // kg CO2e per month (recycles nothing)
    some: 25,  // kg CO2e per month (recycles some)
    all: 10,   // kg CO2e per month (recycles all)
  },
};

// Standard average individual footprint per month in kg CO2e
export const AVERAGE_MONTHLY_EMISSIONS = 650;

/**
 * Calculates monthly carbon emissions based on user inputs.
 * Ensures the inputs are validated and sanitized.
 */
export function calculateMonthlyEmissions(inputs: CalculatorInputs): EmissionsBreakdown {
  // Input Sanitization & Safety Defaults
  const carDistance = Math.max(0, inputs.carDistance || 0);
  const busDistance = Math.max(0, inputs.busDistance || 0);
  const trainDistance = Math.max(0, inputs.trainDistance || 0);
  const electricity = Math.max(0, inputs.electricity || 0);

  const carFactor = EMISSION_FACTORS.car[inputs.carType] ?? 0;
  const busFactor = EMISSION_FACTORS.bus;
  const trainFactor = EMISSION_FACTORS.train;

  const transportEmissions = parseFloat(
    (
      carDistance * carFactor +
      busDistance * busFactor +
      trainDistance * trainFactor
    ).toFixed(2)
  );

  const electricityEmissions = parseFloat((electricity * EMISSION_FACTORS.electricity).toFixed(2));
  const foodEmissions = EMISSION_FACTORS.food[inputs.foodHabit] ?? EMISSION_FACTORS.food.mixed;
  const wasteEmissions = EMISSION_FACTORS.waste[inputs.wasteHabit] ?? EMISSION_FACTORS.waste.some;

  const total = parseFloat(
    (transportEmissions + electricityEmissions + foodEmissions + wasteEmissions).toFixed(2)
  );

  return {
    transport: transportEmissions,
    electricity: electricityEmissions,
    food: foodEmissions,
    waste: wasteEmissions,
    total,
  };
}

/**
 * Calculates a dynamic eco-score from 10 to 100.
 * A score of 100 represents a near-zero carbon footprint, while higher-than-average footprints scale down towards 10.
 */
export function calculateEcoScore(totalEmissions: number): number {
  if (totalEmissions <= 0) return 100;
  // Let 1200 kg COe be the upper scale limit for a low score.
  const score = Math.round(100 * (1 - totalEmissions / 1200));
  return Math.max(10, Math.min(100, score));
}

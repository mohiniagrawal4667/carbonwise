import { CalculatorInputs, EmissionsBreakdown } from '../types';

export interface Recommendation {
  id: string;
  category: 'transport' | 'electricity' | 'food' | 'waste';
  text: string;
  impact: 'high' | 'medium' | 'low';
  estimatedSavings: number; // kg CO2 saved per month
}

/**
 * Generates personalized rule-based recommendations based on the user's latest emissions and habits.
 */
export function getRecommendations(
  inputs: CalculatorInputs,
  breakdown: EmissionsBreakdown
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // --- Transport Recommendations ---
  if (breakdown.transport > 150) {
    if (inputs.carType === 'petrol' || inputs.carType === 'diesel') {
      recommendations.push({
        id: 'rec-hybrid-elec',
        category: 'transport',
        text: 'Consider upgrading to a hybrid or electric vehicle next time to cut driving emissions by over 50%.',
        impact: 'high',
        estimatedSavings: Math.round(inputs.carDistance * 0.10),
      });
    }
    
    if (inputs.carDistance > 400) {
      recommendations.push({
        id: 'rec-public-transport',
        category: 'transport',
        text: 'Using public transit for 25% of your regular car trips could significantly reduce your transit footprint.',
        impact: 'high',
        estimatedSavings: Math.round((inputs.carDistance * 0.25) * 0.10),
      });
    }
  }

  if (inputs.carDistance > 0 && inputs.carDistance <= 200) {
    recommendations.push({
      id: 'rec-walk-bike',
      category: 'transport',
      text: 'Try swapping short car trips under 2 km with walking or cycling to save fuel and stay fit.',
      impact: 'medium',
      estimatedSavings: 15,
    });
  }

  // --- Electricity Recommendations ---
  if (breakdown.electricity > 100) {
    recommendations.push({
      id: 'rec-led-lights',
      category: 'electricity',
      text: 'Convert any remaining incandescent bulbs to LEDs, saving up to 80% on lighting electricity.',
      impact: 'medium',
      estimatedSavings: 20,
    });

    recommendations.push({
      id: 'rec-phantom-load',
      category: 'electricity',
      text: 'Avoid "phantom loads" by unplugging electronics when not in use or using smart power strips.',
      impact: 'low',
      estimatedSavings: 10,
    });

    if (inputs.electricity > 350) {
      recommendations.push({
        id: 'rec-thermostat',
        category: 'electricity',
        text: 'Adjust your thermostat by 1-2°C. Setting it slightly warmer in summer and cooler in winter yields major energy savings.',
        impact: 'high',
        estimatedSavings: 45,
      });
    }
  } else if (inputs.electricity > 0) {
    recommendations.push({
      id: 'rec-cold-wash',
      category: 'electricity',
      text: 'Wash your laundry sessions on cold cycles to reduce energy usage per wash load.',
      impact: 'low',
      estimatedSavings: 8,
    });
  }

  // --- Food Habits Recommendations ---
  if (inputs.foodHabit === 'non-vegetarian') {
    recommendations.push({
      id: 'rec-meatless-monday',
      category: 'food',
      text: 'Reducing meat consumption just one day per week ("Meatless Mondays") lowers your food carbon footprint by ~10%.',
      impact: 'high',
      estimatedSavings: 25,
    });
  } else if (inputs.foodHabit === 'mixed') {
    recommendations.push({
      id: 'rec-plant-based',
      category: 'food',
      text: 'Incorporating more plant-based meals each week lowers cholesterol and dramatically reduces production-related emissions.',
      impact: 'medium',
      estimatedSavings: 15,
    });
  }

  recommendations.push({
    id: 'rec-food-waste',
    category: 'food',
    text: 'Plan meals in advance, use leftovers, and store food properly to minimize carbon-heavy municipal landfill gas.',
    impact: 'medium',
    estimatedSavings: 18,
  });

  // --- Waste Recommendations ---
  if (inputs.wasteHabit === 'none') {
    recommendations.push({
      id: 'rec-start-recycling',
      category: 'waste',
      text: 'Begin separating paper, metals, glass, and plastic from general garbage to halve your waste emissions.',
      impact: 'high',
      estimatedSavings: 25,
    });
  } else if (inputs.wasteHabit === 'some') {
    recommendations.push({
      id: 'rec-composting',
      category: 'waste',
      text: 'Try composting organic kitchen scraps. Landfilled organic matters release high volumes of damaging methane.',
      impact: 'medium',
      estimatedSavings: 15,
    });
  }

  recommendations.push({
    id: 'rec-reusables',
    category: 'waste',
    text: 'Transition to reusable beverage bottles, canvas shopping bags, and container systems to prevent plastic pollution.',
    impact: 'medium',
    estimatedSavings: 12,
  });

  return recommendations;
}

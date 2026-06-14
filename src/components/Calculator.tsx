import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorSchema } from '../lib/validation';
import { CalculatorInputs } from '../types';
import { 
  Car, 
  Bus, 
  Train, 
  Bike, 
  Footprints, 
  Zap, 
  Salad, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorProps {
  onSave: (data: CalculatorInputs) => void;
  initialValues?: CalculatorInputs | null;
}

export const Calculator: React.FC<CalculatorProps> = ({ onSave, initialValues }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState<'transport' | 'energy' | 'consumption'>('transport');

  const defaultValues: CalculatorInputs = initialValues || {
    carType: 'petrol',
    carDistance: 150,
    busDistance: 40,
    trainDistance: 20,
    bicycleDistance: 10,
    walkingDistance: 15,
    electricity: 180,
    foodHabit: 'mixed',
    wasteHabit: 'some',
    targetReduction: 20,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CalculatorInputs>({
    resolver: zodResolver(CalculatorSchema) as any,
    defaultValues,
    mode: 'all',
  });

  const carType = watch('carType');

  const onSubmitForm = (data: CalculatorInputs) => {
    // Input sanitization
    const sanitized = {
      ...data,
      carDistance: data.carType === 'none' ? 0 : Math.max(0, Number(data.carDistance) || 0),
      busDistance: Math.max(0, Number(data.busDistance) || 0),
      trainDistance: Math.max(0, Number(data.trainDistance) || 0),
      bicycleDistance: Math.max(0, Number(data.bicycleDistance) || 0),
      walkingDistance: Math.max(0, Number(data.walkingDistance) || 0),
      electricity: Math.max(0, Number(data.electricity) || 0),
    };
    onSave(sanitized);
    setIsSubmitted(true);
    
    // Auto reset submission notification after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  // Preset quick fill buttons for easier testing and quick estimates
  const fillPreset = (type: 'green' | 'average' | 'high') => {
    if (type === 'green') {
      setValue('carType', 'electric');
      setValue('carDistance', 120);
      setValue('busDistance', 10);
      setValue('trainDistance', 50);
      setValue('bicycleDistance', 40);
      setValue('walkingDistance', 30);
      setValue('electricity', 90);
      setValue('foodHabit', 'vegetarian');
      setValue('wasteHabit', 'all');
      setValue('targetReduction', 30);
    } else if (type === 'average') {
      setValue('carType', 'petrol');
      setValue('carDistance', 350);
      setValue('busDistance', 80);
      setValue('trainDistance', 20);
      setValue('bicycleDistance', 10);
      setValue('walkingDistance', 15);
      setValue('electricity', 250);
      setValue('foodHabit', 'mixed');
      setValue('wasteHabit', 'some');
      setValue('targetReduction', 20);
    } else if (type === 'high') {
      setValue('carType', 'diesel');
      setValue('carDistance', 1200);
      setValue('busDistance', 0);
      setValue('trainDistance', 0);
      setValue('bicycleDistance', 0);
      setValue('walkingDistance', 2);
      setValue('electricity', 550);
      setValue('foodHabit', 'non-vegetarian');
      setValue('wasteHabit', 'none');
      setValue('targetReduction', 15);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Assess Carbon Footprint
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Input your regular monthly habits to compute your relative greenhouse gas contribution.
          </p>
        </div>
        
        {/* Preset quick fills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Presets:</span>
          <button
            type="button"
            onClick={() => fillPreset('green')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40 text-xs font-medium rounded-lg transition cursor-pointer"
          >
            🌱 Low Carbon
          </button>
          <button
            type="button"
            onClick={() => fillPreset('average')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded-lg transition cursor-pointer"
          >
            🚗 Average Eco
          </button>
          <button
            type="button"
            onClick={() => fillPreset('high')}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 text-xs font-medium rounded-lg transition cursor-pointer"
          >
            🏭 High Carbon
          </button>
        </div>
      </div>

      {/* Calculator Form */}
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8" id="fuel-calculation-form">
        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveStep('transport')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeStep === 'transport'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>1. Transportation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('energy')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeStep === 'energy'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>2. Household Energy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('consumption')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeStep === 'consumption'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Salad className="w-4 h-4" />
            <span>3. Habits & Food</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <AnimatePresence mode="wait">
            {/* STEP 1: TRANSPORTATION */}
            {activeStep === 'transport' && (
              <motion.div
                key="step-transport"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Car className="text-emerald-500 w-5 h-5" />
                    <span>Monthly Commuting & Transportation</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Calculate distances travelled in typical monthly commuter routines across diverse vehicle modes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car selection and distance */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Primary Driving Profile
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {(['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue('carType', type, { shouldDirty: true })}
                          className={`py-3.5 px-3 rounded-xl border text-center text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            carType === type
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Car className={`w-4 h-4 ${carType === type ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Car Distance Input (only if car is owned) */}
                  {carType !== 'none' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Personal Car Commute</span>
                        <span className="text-xs text-slate-400 font-normal">km / month</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          {...register('carDistance', { valueAsNumber: true })}
                          className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500"
                          placeholder="e.g. 350"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                      </div>
                      {errors.carDistance && (
                        <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.carDistance.message}</p>
                      )}
                    </div>
                  )}

                  {/* Bus Distance */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Bus className="w-4 h-4 text-slate-400" />
                        <span>Public Bus Ride</span>
                      </span>
                      <span className="text-xs text-slate-400 font-normal">km / month</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        {...register('busDistance', { valueAsNumber: true })}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500"
                        placeholder="e.g. 50"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                    </div>
                    {errors.busDistance && (
                      <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.busDistance.message}</p>
                    )}
                  </div>

                  {/* Train Distance */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Train className="w-4 h-4 text-slate-400" />
                        <span>Rail / Train Transit</span>
                      </span>
                      <span className="text-xs text-slate-400 font-normal">km / month</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        {...register('trainDistance', { valueAsNumber: true })}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. 100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                    </div>
                    {errors.trainDistance && (
                      <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.trainDistance.message}</p>
                    )}
                  </div>

                  {/* Bicycle Distance */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-slate-400" />
                        <span>Bicycling Active Commute</span>
                      </span>
                      <span className="text-xs text-slate-400 font-normal">km / month</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        {...register('bicycleDistance', { valueAsNumber: true })}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. 30"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                    </div>
                    {errors.bicycleDistance && (
                      <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.bicycleDistance.message}</p>
                    )}
                  </div>

                  {/* Walking Distance */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Footprints className="w-4 h-4 text-slate-400" />
                        <span>Walking Habits</span>
                      </span>
                      <span className="text-xs text-slate-400 font-normal">km / month</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        {...register('walkingDistance', { valueAsNumber: true })}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. 20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                    </div>
                    {errors.walkingDistance && (
                      <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.walkingDistance.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep('energy')}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Household Energy</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ENERGY */}
            {activeStep === 'energy' && (
              <motion.div
                key="step-energy"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-emerald-500 w-5 h-5" />
                    <span>Monthly Household energy Consumption</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Your electricity usage represents a key component of utility-sector carbon mapping.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      <strong>Did you know?</strong> An average refrigerator uses roughly 30 to 50 kWh monthly. Typical apartments range from 150-300 kWh, while single homes consume around 500-900 kWh depending on AC, heating, and insulation.
                    </p>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Monthly Grid Electricity Code</span>
                      <span className="text-xs text-slate-400 font-normal">kWh / month</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        {...register('electricity', { valueAsNumber: true })}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white pr-16 text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. 180"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kWh</span>
                    </div>
                    {errors.electricity && (
                      <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.electricity.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-50 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setActiveStep('transport')}
                    className="px-5 py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-semibold transition cursor-pointer"
                  >
                    Back to Commuting
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep('consumption')}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Habits & Food</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: HABITS & FOOD */}
            {activeStep === 'consumption' && (
              <motion.div
                key="step-consumption"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Salad className="text-emerald-500 w-5 h-5" />
                    <span>Food Habits & Waste Recycling Plans</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Agricultural supply chains and municipal landfill waste together are major global warming triggers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Food habit radios */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Typical Food Intake Habits
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'vegetarian', label: 'Vegetarian', desc: 'No meat (poultry, beef, pork), minimal fish, mostly plants/dairy' },
                        { key: 'mixed', label: 'Mixed / Balanced Diet', desc: 'Moderate poultry/red meat combined with standard fruit/veg' },
                        { key: 'non-vegetarian', label: 'High Meat Consumption', desc: 'Daily inclusion of meat components, especially beef and pork' }
                      ].map((habit) => (
                        <label
                          key={habit.key}
                          className="flex items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer select-none"
                        >
                          <input
                            type="radio"
                            value={habit.key}
                            {...register('foodHabit')}
                            className="mt-1 mr-3 h-4 w-4 accent-emerald-500 dark:accent-emerald-400"
                          />
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{habit.label}</span>
                            <span className="block text-xs text-slate-400 dark:text-slate-500">{habit.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Waste habits */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Household Sorting & Recycling Practices
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'none', label: 'No Active Sorting', desc: 'Throw all glass, metal, paper, and organic food in standard trash' },
                        { key: 'some', label: 'Partial Segregation', desc: 'Sort plastics/paper sometimes but mostly use main landfill bins' },
                        { key: 'all', label: 'Rigorous Circular Recycling', desc: 'Diligently compost organic waste and separate recyclables completely' }
                      ].map((habit) => (
                        <label
                          key={habit.key}
                          className="flex items-start p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer select-none"
                        >
                          <input
                            type="radio"
                            value={habit.key}
                            {...register('wasteHabit')}
                            className="mt-1 mr-3 h-4 w-4 accent-emerald-500 dark:accent-emerald-400"
                          />
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{habit.label}</span>
                            <span className="block text-xs text-slate-400 dark:text-slate-500">{habit.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Target Reduction */}
                  <div className="space-y-2 md:col-span-2 pt-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Personal Goal Target Reduction Percentage
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        {...register('targetReduction', { valueAsNumber: true })}
                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-3 py-1 bg-opacity-70 font-bold rounded-lg text-sm shrink-0">
                        {watch('targetReduction')}% Target
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      Setting an aggressive but rational reduction plan fuels consistent behavioral improvements.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-50 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setActiveStep('energy')}
                    className="px-5 py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-semibold transition cursor-pointer"
                  >
                    Back to Energy
                  </button>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-2 cursor-pointer ${
                      !isValid ? 'opacity-50 cursor-not-allowed bg-slate-300 dark:bg-slate-800' : ''
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Calculate footprint</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Success Notification Bar */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-sm font-medium">
              Your carbon emissions have been calculated and committed to local history records successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

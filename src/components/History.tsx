import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HistoryEntry } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  History as HistoryIcon, 
  Trash2, 
  FileDown, 
  Calendar, 
  HelpCircle, 
  PlusCircle,
  AlertTriangle,
  Scale,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

interface HistoryProps {
  history: HistoryEntry[];
  onReset: () => void;
  onNavigate: (tab: string) => void;
}

export const History: React.FC<HistoryProps> = ({ history, onReset, onNavigate }) => {

  const chartData = useMemo(() => {
    return history.map((entry, index) => {
      const d = new Date(entry.date);
      const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return {
        name: `#${index + 1} (${formattedDate})`,
        Transportation: entry.breakdown.transport,
        'Household Energy': entry.breakdown.electricity,
        'Food habits': entry.breakdown.food,
        'Sorting & Waste': entry.breakdown.waste,
        'Total Emissions': entry.breakdown.total,
      };
    });
  }, [history]);

  // Export report as a clean printable PDF (safe document flow printer for iframes)
  const handleExportPDF = () => {
    const latest = history[history.length - 1];
    if (!latest) return;

    // Create a dynamic printable container on the current document
    const printContainer = document.createElement('div');
    printContainer.id = 'carbonwise-print-container';

    const d = new Date(latest.date).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    printContainer.innerHTML = `
      <div class="carbonwise-printable-report">
        <style>
          #carbonwise-print-container {
            display: none;
          }
          @media print {
            body > *:not(#carbonwise-print-container) {
              display: none !important;
            }
            #carbonwise-print-container {
              display: block !important;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 40px;
              box-sizing: border-box;
              color: #1e293b;
              background: #ffffff;
            }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 28px; font-weight: bold; color: #065f46; margin: 0; }
            .meta { font-size: 13px; color: #64748b; margin-top: 5px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; background: #fff; margin-bottom: 20px; box-sizing: border-box; }
            .card h3 { color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
            .metric { font-size: 40px; font-weight: 800; color: #10b981; margin: 15px 0; }
            .metric span { font-size: 14px; font-weight: normal; color: #64748b; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th { text-align: left; background: #f8fafc; padding: 12px; font-size: 12px; color: #475569; border-bottom: 1.5px solid #cbd5e1; }
            .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          }
        </style>
        <div class="header">
          <div>
            <h1 class="title">CarbonWise Assessment Report</h1>
            <div class="meta">Computed: ${d} &bull; Client Offline Record Node</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Carbon Footprint</h3>
            <div class="metric">${latest.breakdown.total.toFixed(1)} <span>kg CO2e / month</span></div>
            <p style="font-size: 13px; color: #64748b; margin: 0;">
              Your greenhouse footprint. Typical national average benchmarks hover around 650.0 kg.
            </p>
          </div>
          <div class="card">
            <h3>Calculated Eco Score</h3>
            <div class="metric">${latest.ecoScore} <span>/ 100</span></div>
            <p style="font-size: 13px; color: #64748b; margin: 0;">
              Calculated using standard IPCC emission coefficients. Higher score indicates a lower environmental threat.
            </p>
          </div>
        </div>

        <div class="card" style="margin-bottom: 40px;">
          <h3>Detailed Footprint Breakdown</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Underlying Habit Profile</th>
                <th>Carbon Footprint (kg CO2e)</th>
                <th>Share of total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Transportation</strong></td>
                <td>Car Type: ${latest.inputs.carType} (Dist: ${latest.inputs.carDistance}km), Bus: ${latest.inputs.busDistance}km, Train: ${latest.inputs.trainDistance}km</td>
                <td>${latest.breakdown.transport.toFixed(1)} kg</td>
                <td>${Math.round((latest.breakdown.transport / (latest.breakdown.total || 1)) * 100)}%</td>
              </tr>
              <tr>
                <td><strong>Household Energy</strong></td>
                <td>Electricity usage: ${latest.inputs.electricity} kWh</td>
                <td>${latest.breakdown.electricity.toFixed(1)} kg</td>
                <td>${Math.round((latest.breakdown.electricity / (latest.breakdown.total || 1)) * 100)}%</td>
              </tr>
              <tr>
                <td><strong>Food & Nutrition</strong></td>
                <td>Diet Profile: ${latest.inputs.foodHabit}</td>
                <td>${latest.breakdown.food.toFixed(1)} kg</td>
                <td>${Math.round((latest.breakdown.food / (latest.breakdown.total || 1)) * 100)}%</td>
              </tr>
              <tr>
                <td><strong>Sorting & Recycling</strong></td>
                <td>Sorting standard: ${latest.inputs.wasteHabit}</td>
                <td>${latest.breakdown.waste.toFixed(1)} kg</td>
                <td>${Math.round((latest.breakdown.waste / (latest.breakdown.total || 1)) * 100)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3>Sustainable Target Commitments</h3>
          <p style="font-size: 14px; margin: 0;">
            Target Reduction: <strong>${latest.inputs.targetReduction || 20}%</strong>.
            Achieving your target matches a sustainable footprint of <strong>${(latest.breakdown.total * (1 - (latest.inputs.targetReduction || 20)/100)).toFixed(1)} kg CO2e</strong>.
            Continue to leverage CarbonWise daily habit logs to implement small, consistent reductions.
          </p>
        </div>

        <div class="footer">
          Generated via CarbonWise Client Application. All calculations are client-side only. Sustainable living is consistent habits.
        </div>
      </div>
    `;

    document.body.appendChild(printContainer);
    
    // Call the print UI
    try {
      window.print();
    } catch (printError) {
      console.error('Print request failed inside sandbox iframe:', printError);
    }
    
    // Cleanup printable node immediately
    document.body.removeChild(printContainer);
  };

  if (history.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6 px-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800"
        >
          <HistoryIcon className="w-8 h-8 text-indigo-400" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white">
            No Historical Records
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            History tracking allows you to log monthly consumption patterns, monitor trends, and inspect your long-term eco improvements. Run the calculator first!
          </p>
        </div>

        <button
          onClick={() => onNavigate('calculator')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch Carbon Calculator</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Green History & Trends
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor prior monthly emissions, evaluate seasonal spikes, and export reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="px-4.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-emerald-200/40 dark:border-emerald-900/40"
          >
            <FileDown className="w-4 h-4 text-emerald-500" />
            <span>Export Report as PDF</span>
          </button>

          {/* Reset button with warning style */}
          <button
            onClick={() => {
              if (window.confirm('WARNING: Are you absolutely certain you want to purge all your history, badge achievements, and daily challenge records? This action is irreversible.')) {
                onReset();
              }
            }}
            className="px-4.5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-rose-200/40 dark:border-rose-900/40"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" />
            <span>Long-term Carbon Trends</span>
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Evaluating performance over consecutive trials tracks consistency and reduction speed.
          </p>
        </div>

        <div className="h-80 select-none">
          {history.length < 2 ? (
            <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 text-center text-slate-400 text-xs flex-col gap-2">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Awaiting Additional Records</p>
              <p className="max-w-xs leading-normal">
                Submit of a couple of calculations using diverse presets or revised monthly parameters to trace interactive graphs over time!
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                <Line type="monotone" dataKey="Transportation" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Household Energy" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Food habits" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Sorting & Waste" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Total Emissions" stroke="#0f172a" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Historical Ledger Grid */}
      <div className="space-y-4">
        <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200">
          Emission Logs Checklist
        </h4>
        
        <div className="overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Assessed Trial</th>
                  <th className="py-4 px-6">Transportation (kg)</th>
                  <th className="py-4 px-6">Energy (kg)</th>
                  <th className="py-4 px-6">Nutrition (kg)</th>
                  <th className="py-4 px-6">Waste sorting (kg)</th>
                  <th className="py-4 px-6">Total footprint</th>
                  <th className="py-4 px-6">Eco Score</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {history.map((entry, index) => {
                  const d = new Date(entry.date);
                  const formattedDate = d.toLocaleDateString(undefined, { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  });
                  return (
                    <tr 
                      key={entry.id} 
                      className="border-b last:border-b-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>#{index + 1} ({formattedDate})</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{entry.breakdown.transport.toFixed(1)}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{entry.breakdown.electricity.toFixed(1)}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{entry.breakdown.food.toFixed(1)}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{entry.breakdown.waste.toFixed(1)}</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                        {entry.breakdown.total.toFixed(1)} kg CO2e
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded">
                          {entry.ecoScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, lazy, Suspense } from 'react';
import { useCarbonWise } from './hooks/useCarbonWise';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

// Lazy load larger/heavy components to optimize initial JS load times & paint metrics
const Calculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.Calculator })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Recommendations = lazy(() => import('./components/Recommendations').then(m => ({ default: m.Recommendations })));
const Challenges = lazy(() => import('./components/Challenges').then(m => ({ default: m.Challenges })));
const History = lazy(() => import('./components/History').then(m => ({ default: m.History })));

// Beautiful, responsive skeleton loader to eliminate layout shifts (CLS) on dynamic transitions
const PageSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4 select-none animate-pulse" aria-hidden="true">
    <div className="space-y-3">
      <div className="h-8 w-60 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="h-4 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-md" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/40" />
      ))}
    </div>
    <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const {
    progress,
    latestEmissions,
    badges,
    addHistoryEntry,
    toggleChallengeCompletion,
    resetAllData,
  } = useCarbonWise();

  const handleSaveCalculator = (inputs: any) => {
    addHistoryEntry(inputs);
    setActiveTab('dashboard'); // Redirect to dashboard to check stats!
  };

  const handleResetData = () => {
    resetAllData();
    setActiveTab('home');
  };

  return (
    <Layout activeTab={activeTab} onChangeTab={setActiveTab} streak={progress.streak}>
      <Suspense fallback={<PageSkeleton />}>
        {activeTab === 'home' && (
          <Home 
            onNavigate={setActiveTab} 
            completedChallengesCount={progress.challenges.filter(c => c.isCompleted).length}
            streak={progress.streak}
            hasEmissionsData={progress.history.length > 0}
          />
        )}
        
        {activeTab === 'calculator' && (
          <Calculator 
            onSave={handleSaveCalculator} 
            initialValues={latestEmissions ? latestEmissions.inputs : null}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            latestEmissions={latestEmissions} 
            progress={progress}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'recommendations' && (
          <Recommendations 
            latestInputs={latestEmissions ? latestEmissions.inputs : null}
            latestBreakdown={latestEmissions ? latestEmissions.breakdown : null}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'challenges' && (
          <Challenges 
            progress={progress}
            badges={badges}
            toggleChallenge={toggleChallengeCompletion}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <History 
            history={progress.history} 
            onReset={handleResetData}
            onNavigate={setActiveTab}
          />
        )}
      </Suspense>
    </Layout>
  );
}

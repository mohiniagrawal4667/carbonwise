import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Leaf, 
  BookOpen, 
  Calculator, 
  TrendingDown, 
  Award, 
  History as HistoryIcon,
  Menu,
  X,
  Flame
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  streak: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onChangeTab, streak }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('carbonwise_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync Class-list and Storage on change
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('carbonwise_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('carbonwise_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  const navigationItems = [
    { key: 'home', label: 'Home', icon: <BookOpen className="w-4.5 h-4.5" /> },
    { key: 'calculator', label: 'Calculator', icon: <Calculator className="w-4.5 h-4.5" /> },
    { key: 'dashboard', label: 'Dashboard', icon: <TrendingDown className="w-4.5 h-4.5" /> },
    { key: 'recommendations', label: 'Insights', icon: <Leaf className="w-4.5 h-4.5" /> },
    { key: 'challenges', label: 'Daily actions', icon: <Award className="w-4.5 h-4.5" /> },
    { key: 'history', label: 'History log', icon: <HistoryIcon className="w-4.5 h-4.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => { onChangeTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition">
              <Leaf className="w-5.5 h-5.5" />
            </div>
            <div className="leading-tight">
              <span className="font-heading font-extrabold text-lg text-slate-900 dark:text-white tracking-tight block">
                CarbonWise
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block uppercase tracking-wider">
                Personal Carbon Footprint
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 font-medium text-sm">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onChangeTab(item.key)}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-bold ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Accessibility & Settings Controls */}
          <div className="flex items-center gap-3">
            {/* Streak Microboard */}
            {streak > 0 && (
              <div 
                onClick={() => onChangeTab('challenges')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-full cursor-pointer hover:scale-103 transition"
                title="Active Eco challenge streak"
              >
                <Flame className="w-4 h-4 animate-pulse" />
                <span>{streak} Day Streak</span>
              </div>
            )}

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={darkMode ? 'Toggle light mode' : 'Toggle dark mode'}
              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-slate-500 dark:text-slate-200"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close application menu' : 'Open application menu'}
              className="flex lg:hidden w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-slate-500 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden sticky top-18 z-30 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-md">
          <nav className="p-4 flex flex-col gap-2 font-medium text-sm">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    onChangeTab(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4.5 py-3 rounded-xl transition flex items-center gap-3 cursor-pointer text-xs uppercase tracking-wider font-bold ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-50 dark:bg-slate-800/30'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Humble, Professional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-heading font-extrabold text-sm text-slate-800 dark:text-white">CarbonWise</span>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © 2026 CarbonWise. Safe Local-Storage. No carbon offsets are sold here. Pure education.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <button onClick={() => onChangeTab('home')} className="hover:text-slate-600 dark:hover:text-slate-300">Home</button>
            <span>•</span>
            <button onClick={() => onChangeTab('calculator')} className="hover:text-slate-600 dark:hover:text-slate-300">Calculator</button>
            <span>•</span>
            <button onClick={() => onChangeTab('challenges')} className="hover:text-slate-600 dark:hover:text-slate-300">Daily Challenges</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

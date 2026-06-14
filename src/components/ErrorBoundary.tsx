import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside CarbonWise context:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('carbonwise_user_progress');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100 font-sans">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <AlertCircle className="w-9 h-9" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Something went wrong
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                An unexpected technical error occurred while rendering visual carbon maps or parsing calculations.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-100 dark:border-slate-800/80 text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Error Diagnostic Log
                </span>
                <code className="text-xs font-mono text-rose-600 dark:text-rose-400 break-words block max-h-24 overflow-y-auto">
                  {this.state.error.message || 'Unknown runtime error'}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 border border-slate-900 dark:border-white shadow-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 font-bold text-sm rounded-xl hover:bg-rose-100/50 transition cursor-pointer flex items-center justify-center gap-2 focus:ring-2 focus:ring-rose-500 outline-hidden"
                title="Clears potentially corrupted local storage habits history to restore pristine operation"
              >
                <span>Reset Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

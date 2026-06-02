import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary captured a rendering crash:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 bg-bgPrimary text-textSecondary transition-colors duration-300">
          <div className="max-w-md w-full glass-panel bg-bgCard border-borderColor rounded-3xl p-8 text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto animate-pulse">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl text-textPrimary leading-tight">
                Something went wrong.
              </h2>
              <p className="text-xs text-textSecondary leading-relaxed">
                Alok detected a system rendering anomaly. We apologize for the friction—let's get you back on track immediately.
              </p>
            </div>

            {/* Error Diagnostics panel */}
            <div className="p-4 rounded-xl bg-bgPrimary border border-borderColor text-[10px] font-mono text-red-400 text-left max-h-36 overflow-y-auto shadow-inner leading-normal">
              <span className="font-bold uppercase tracking-wider block mb-1">Diagnostic Report:</span>
              {this.state.error?.toString() || "Unknown react render exception."}
            </div>

            {/* Recovery actions */}
            <div className="flex gap-4">
              <MagneticButton
                onClick={this.handleReload}
                className="flex-1 bg-white text-zinc-950 hover:bg-blue-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </MagneticButton>
              <MagneticButton
                onClick={this.handleGoHome}
                className="flex-1 bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-950 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                Return Home
              </MagneticButton>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

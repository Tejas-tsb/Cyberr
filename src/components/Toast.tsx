import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        let bgStyle = 'bg-slate-900/95 border-slate-800 text-slate-100';
        let Icon = Info;
        let iconColor = 'text-cyan-400';
        let glowStyle = 'shadow-slate-900/50';

        if (toast.type === 'success') {
          bgStyle = 'bg-slate-950/95 border-emerald-500/30 text-slate-100';
          Icon = CheckCircle;
          iconColor = 'text-emerald-400';
          glowStyle = 'shadow-emerald-950/20 border-l-4 border-l-emerald-500';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-slate-950/95 border-red-500/30 text-slate-100';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
          glowStyle = 'shadow-red-950/20 border-l-4 border-l-red-500';
        } else {
          bgStyle = 'bg-slate-950/95 border-cyan-500/30 text-slate-100';
          Icon = Info;
          iconColor = 'text-cyan-400';
          glowStyle = 'shadow-cyan-950/20 border-l-4 border-l-cyan-500';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${bgStyle} ${glowStyle}`}
          >
            <div className={`mt-0.5 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-grow text-xs font-medium font-sans">
              {toast.message}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

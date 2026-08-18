import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 animate-slideUp bg-white ${
            toast.type === 'success'
              ? 'border-emerald-200 text-emerald-950'
              : toast.type === 'warning'
              ? 'border-amber-200 text-amber-950'
              : toast.type === 'error'
              ? 'border-red-200 text-red-950'
              : 'border-[#E8E6DF] text-neutral-900'
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">{toast.title}</h4>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-700 p-1 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        let borderClass = 'border-neutral-200 bg-white';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          borderClass = 'border-emerald-200 bg-emerald-50/90';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          borderClass = 'border-amber-200 bg-amber-50/90';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
          borderClass = 'border-red-200 bg-red-50/90';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderClass} backdrop-blur-md transition-all duration-300 transform translate-y-0`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-neutral-900 leading-snug">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#FAF9F6]">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-neutral-600 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import { AlertTriangle, Sparkles, X } from 'lucide-react';

export const DimensionAlertBanner: React.FC = () => {
  const { conflicts, optimizeConflictAutomatically } = useProject();
  const { addToast } = useUI();
  const [isDismissed, setIsDismissed] = useState(false);

  if (conflicts.length === 0 || isDismissed) return null;

  const primaryConflict = conflicts[0];

  return (
    <div className="w-full bg-[#FFFBEB] dark:bg-[#201A12] border-b border-amber-200 dark:border-amber-900/60 px-5 py-2.5 flex items-center justify-between gap-4 z-20 flex-shrink-0 shadow-2xs font-sans animate-fadeIn transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-400 flex-shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950 px-2 py-0.5 rounded flex-shrink-0 border border-amber-300 dark:border-amber-800">
            ⚠️ Spatial Conflict
          </span>
          <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
            {primaryConflict.title}:
          </span>
          <span className="text-xs text-neutral-600 dark:text-neutral-300 truncate">
            {primaryConflict.message}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {primaryConflict.fixCoordinates && (
          <button
            onClick={() => {
              optimizeConflictAutomatically(primaryConflict.id);
              addToast({
                type: 'success',
                title: 'Conflict Resolved',
                message: 'Repositioned furniture to maintain optimal walking clearance.',
              });
            }}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
            <span>Auto Optimize</span>
          </button>
        )}

        <button
          onClick={() => {
            setIsDismissed(true);
            addToast({
              type: 'info',
              title: 'Alert Acknowledged',
              message: 'Kept current layout per your preference.',
            });
          }}
          className="px-2.5 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition-colors"
        >
          Keep Anyway
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-950/40"
          title="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

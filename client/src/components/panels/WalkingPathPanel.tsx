import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import {
  Navigation,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const WalkingPathPanel: React.FC = () => {
  const { walkingPaths, layoutScore } = useProject();
  const { showWalkingPaths, setShowWalkingPaths } = useUI();

  return (
    <div className="p-4 space-y-5 select-none animate-fadeIn font-sans transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Circulation & Heatmap</span>
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Real-time movement corridor analysis
          </p>
        </div>

        <button
          onClick={() => setShowWalkingPaths(!showWalkingPaths)}
          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#21262D] transition-colors"
          title={showWalkingPaths ? 'Hide Walking Lines on 2D' : 'Show Walking Lines on 2D'}
        >
          {showWalkingPaths ? <Eye className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-4 bg-[#FAF9F6] dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block">Movement Score</span>
          <span className="font-mono text-xl font-extrabold text-neutral-900 dark:text-white">
            {layoutScore.breakdown.movement}/100
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block">Min Clearance</span>
          <span
            className={`font-mono text-sm font-bold ${
              layoutScore.minWalkingClearanceCm >= 85 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {layoutScore.minWalkingClearanceCm} cm
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
          Primary Walking Routes ({walkingPaths.length})
        </h4>

        <div className="space-y-2">
          {walkingPaths.map((path) => {
            const isClear = path.status === 'clear';
            const isRestricted = path.status === 'restricted';

            return (
              <div
                key={path.id}
                className="p-3 bg-white dark:bg-[#161B22] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-1 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {path.fromName} → {path.toName}
                  </span>
                  <div className="flex items-center gap-1">
                    {isClear && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    {isRestricted && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />}
                    <span
                      className={`text-[10px] font-mono font-bold capitalize ${
                        isClear ? 'text-emerald-700 dark:text-emerald-400' : isRestricted ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {path.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>Corridor: {path.clearanceCm} cm</span>
                  <span className="text-[10px]">Min Rec: 90 cm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

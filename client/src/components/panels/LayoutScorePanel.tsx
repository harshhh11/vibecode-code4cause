import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import { ScoreRing } from '../common/ScoreRing';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Wand2,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const LayoutScorePanel: React.FC = () => {
  const { layoutScore, conflicts, optimizeConflictAutomatically } = useProject();
  const { setGenerateLayoutsModalOpen, addToast } = useUI();
  const { breakdown } = layoutScore;

  const metrics = [
    { label: 'Space Utilization', value: breakdown.spaceUtilization, weight: '20%', icon: Zap },
    { label: 'Circulation & Walkways', value: breakdown.movement, weight: '25%', icon: ShieldCheck },
    { label: 'Furniture Boundary & Fit', value: breakdown.furnitureFit, weight: '20%', icon: CheckCircle2 },
    { label: 'Door Swing Clearance', value: breakdown.doorClearance, weight: '15%', icon: AlertTriangle },
    { label: 'Natural Light Access', value: breakdown.naturalLight, weight: '10%', icon: Sparkles },
    { label: 'Storage Accessibility', value: breakdown.storage, weight: '10%', icon: HelpCircle },
  ];

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (val >= 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="p-4 space-y-5 select-none animate-fadeIn text-neutral-900 dark:text-neutral-100">
      {/* Top Gauge Capsule */}
      <div className="p-4 bg-linear-to-br from-[#FAF9F6] to-[#F3EFE6] dark:from-[#161B22] dark:to-[#0E1217] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] shadow-sm flex items-center gap-4">
        <ScoreRing score={layoutScore.overall} size={84} strokeWidth={8} showGrade={false} />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37]">
              ⚡ AERA HYPE SCORE • SPATIAL FLOW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-neutral-950 dark:text-white tracking-tight">
              {layoutScore.grade}
            </h3>
            <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border shadow-xs ${getScoreColor(layoutScore.overall)}`}>
              {layoutScore.overall}/100
            </span>
          </div>

          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
            {layoutScore.usableAreaSqFt} sq.ft usable / {layoutScore.totalAreaSqFt} sq.ft room
          </p>
        </div>
      </div>

      {/* Rationale Bubble */}
      <div className="p-3.5 bg-white dark:bg-[#161B22] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-200">
          <HelpCircle className="w-3.5 h-3.5 text-[#B26A4A]" />
          <span>Why this score?</span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {layoutScore.rationale}
        </p>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            Metric Breakdown
          </h4>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Weighted Total</span>
        </div>

        <div className="space-y-2.5">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1 bg-[#FAF9F6] dark:bg-[#161B22] p-2.5 rounded-xl border border-[#E8E6DF] dark:border-[#30363D]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px] flex items-center gap-1.5">
                  <m.icon className="w-3 h-3 text-neutral-400" />
                  {m.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono">({m.weight})</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white text-[11px]">{m.value}/100</span>
                </div>
              </div>

              <div className="w-full bg-[#EAE6DF] dark:bg-[#21262D] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    m.value >= 85
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : m.value >= 70
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Spatial Warnings & Quick Fixes */}
      {conflicts.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-[#E8E6DF] dark:border-[#30363D]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Spatial Conflicts ({conflicts.length})</span>
          </h4>

          <div className="space-y-2">
            {conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300">
                  <span>{conflict.title}</span>
                  {conflict.clearanceDelta && (
                    <span className="text-[10px] font-mono bg-white dark:bg-[#161B22] px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                      {conflict.clearanceDelta.currentCm}cm → {conflict.clearanceDelta.recommendedCm}cm
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">{conflict.message}</p>
                {conflict.fixCoordinates && (
                  <button
                    onClick={() => {
                      optimizeConflictAutomatically(conflict.id);
                      addToast({
                        type: 'success',
                        title: 'Auto-Adjusted Position',
                        message: 'Moved item to clear door/walking path.',
                      });
                    }}
                    className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    ✨ Auto-Fix Position
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trigger AI Layouts Modal */}
      <button
        onClick={() => setGenerateLayoutsModalOpen(true)}
        className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
      >
        <Wand2 className="w-3.5 h-3.5 text-[#D4B996] dark:text-[#8C5232]" />
        <span>Generate 4 AI Layout Permutations</span>
      </button>
    </div>
  );
};


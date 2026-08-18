import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Sparkles, RotateCcw } from 'lucide-react';

export const WhatIfWidget: React.FC = () => {
  const { whatIfState, undo, canUndo } = useProject();
  const { scoreBefore, scoreAfter, clearanceBeforeCm, clearanceAfterCm } = whatIfState;

  if (scoreBefore === scoreAfter && clearanceBeforeCm === clearanceAfterCm) {
    return null;
  }

  const scoreDiff = scoreAfter - scoreBefore;
  const isPositive = scoreDiff >= 0;

  return (
    <div className="absolute top-16 right-4 z-20 bg-white/95 dark:bg-[#161B22]/95 p-3.5 rounded-2xl shadow-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2 select-none animate-fadeIn max-w-xs backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#B26A4A]" />
          What-If Live Analysis
        </span>
        {canUndo && (
          <button
            onClick={undo}
            className="text-[10px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-bold flex items-center gap-1 bg-[#F5F4EF] dark:bg-[#21262D] px-2 py-0.5 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono font-bold">
        <div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-sans">Score</span>
          <span className="text-neutral-600 dark:text-neutral-300">{scoreBefore}</span>
          <span className="mx-1 text-neutral-400">→</span>
          <span className={isPositive ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-red-600 dark:text-red-400 font-extrabold'}>{scoreAfter}/100</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-sans">Corridor</span>
          <span className="text-neutral-600 dark:text-neutral-300">{clearanceBeforeCm} cm</span>
          <span className="mx-1 text-neutral-400">→</span>
          <span className={clearanceAfterCm >= 85 ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-amber-600 dark:text-amber-400 font-extrabold'}>
            {clearanceAfterCm} cm
          </span>
        </div>
      </div>
    </div>
  );
};


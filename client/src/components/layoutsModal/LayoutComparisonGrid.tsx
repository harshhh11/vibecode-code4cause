import React from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import { generateAlternativeLayouts } from '../../utils/layoutGenerator';
import type { GeneratedLayoutOption } from '../../types/layout';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const LayoutComparisonGrid: React.FC = () => {
  const { compareLayoutsModalOpen, setCompareLayoutsModalOpen, addToast } = useUI();
  const { activeRoom, furniture, applyLayout } = useProject();

  const options: GeneratedLayoutOption[] = generateAlternativeLayouts(
    activeRoom.dimensions,
    activeRoom.doors,
    activeRoom.windows,
    activeRoom.obstacles,
    furniture
  );

  const handleApply = (opt: GeneratedLayoutOption) => {
    applyLayout(opt);
    setCompareLayoutsModalOpen(false);
    addToast({
      type: 'success',
      title: 'Layout Applied',
      message: `${opt.name} loaded into 2D and 3D scenes.`,
    });
  };

  return (
    <Modal
      isOpen={compareLayoutsModalOpen}
      onClose={() => setCompareLayoutsModalOpen(false)}
      maxWidth="max-w-5xl"
      title="Layout Comparison Matrix"
      subtitle="Side-by-side spatial score breakdown and circulation comparison"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="bg-white rounded-2xl border border-[#E8E6DF] p-4 flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] bg-[#FAF4ED] px-2 py-0.5 rounded">
                    {opt.focusLabel}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900 mt-1.5">{opt.name}</h4>
                </div>

                <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Overall Score</span>
                    <span className="font-extrabold text-emerald-800">{opt.score.overall}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Movement</span>
                    <span className="font-bold text-neutral-900">{opt.score.breakdown.movement}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Min Clearance</span>
                    <span className="font-bold text-neutral-900">{opt.score.minWalkingClearanceCm} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Usable Area</span>
                    <span className="font-bold text-neutral-900">{opt.score.usableAreaSqFt} sq.ft</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Key Strengths</span>
                  {opt.strengths.slice(0, 2).map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1 text-[11px] text-neutral-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{s}</span>
                    </div>
                  ))}
                </div>

                {opt.warnings.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Tradeoffs</span>
                    {opt.warnings.map((w, idx) => (
                      <div key={idx} className="flex items-start gap-1 text-[10px] text-amber-800">
                        <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleApply(opt)}
                className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Select Option</span>
                <ArrowRight className="w-3 h-3 text-[#D4B996]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

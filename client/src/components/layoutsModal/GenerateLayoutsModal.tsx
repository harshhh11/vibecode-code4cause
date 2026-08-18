import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import { generateAlternativeLayouts } from '../../utils/layoutGenerator';
import type { GeneratedLayoutOption } from '../../types/layout';
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Columns,
} from 'lucide-react';

export const GenerateLayoutsModal: React.FC = () => {
  const {
    generateLayoutsModalOpen,
    setGenerateLayoutsModalOpen,
    setCompareLayoutsModalOpen,
    addToast,
  } = useUI();

  const { activeRoom, furniture, applyLayout } = useProject();

  const [prompt, setPrompt] = useState(
    'Maximize walking space and ensure full wardrobe door swing clearance without blocking the window.'
  );

  const [generatedOptions, setGeneratedOptions] = useState<GeneratedLayoutOption[]>(() =>
    generateAlternativeLayouts(
      activeRoom.dimensions,
      activeRoom.doors,
      activeRoom.windows,
      activeRoom.obstacles,
      furniture
    )
  );

  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(generatedOptions[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const options = generateAlternativeLayouts(
        activeRoom.dimensions,
        activeRoom.doors,
        activeRoom.windows,
        activeRoom.obstacles,
        furniture,
        prompt
      );
      setGeneratedOptions(options);
      setSelectedLayoutId(options[0].id);
      setIsGenerating(false);

      addToast({
        type: 'success',
        title: '4 AI Layouts Generated',
        message: 'Spatial scoring and walking corridor analysis completed.',
      });
    }, 600);
  };

  const handleApply = (layout: GeneratedLayoutOption) => {
    applyLayout(layout);
    setGenerateLayoutsModalOpen(false);
    addToast({
      type: 'success',
      title: 'AI Layout Applied!',
      message: `${layout.name} loaded onto active 2D & 3D canvas (Score: ${layout.score.overall}/100).`,
    });
  };

  return (
    <Modal
      isOpen={generateLayoutsModalOpen}
      onClose={() => setGenerateLayoutsModalOpen(false)}
      maxWidth="max-w-4xl"
      title="AI Spatial Layout Generator"
      subtitle={`Generating 4 deterministic layout permutations for ${activeRoom.name} (${activeRoom.dimensions.length} × ${activeRoom.dimensions.width} ft)`}
    >
      <div className="space-y-6">
        {/* Natural Language Preference Input */}
        <form onSubmit={handleRegenerate} className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E6DF] space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B26A4A]" />
            <span>Design Intent & Spatial Constraints</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Prioritize desk near window, maximize floor space for yoga..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] text-xs bg-white focus:outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#D4B996]" />
              <span>{isGenerating ? 'Computing...' : 'Regenerate'}</span>
            </button>
          </div>
        </form>

        {/* 4 Generated Layout Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedOptions.map((opt) => {
            const isSelected = selectedLayoutId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedLayoutId(opt.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-neutral-950 bg-white ring-2 ring-neutral-950/10 shadow-lg'
                    : 'border-[#E8E6DF] bg-white hover:border-neutral-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] bg-[#FAF4ED] px-2 py-0.5 rounded">
                        {opt.focusLabel}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 mt-1">{opt.name}</h4>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {opt.score.overall}/100
                      </span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1 pt-2">
                    {opt.strengths.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warnings if any */}
                  {opt.warnings.length > 0 && (
                    <div className="pt-2 border-t border-[#F0ECE4] space-y-1">
                      {opt.warnings.map((w, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Circulation: {opt.score.minWalkingClearanceCm} cm
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(opt);
                    }}
                    className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Apply Layout</span>
                    <ArrowRight className="w-3 h-3 text-[#D4B996]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Comparison Trigger */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E8E6DF]">
          <button
            type="button"
            onClick={() => {
              setGenerateLayoutsModalOpen(false);
              setCompareLayoutsModalOpen(true);
            }}
            className="text-xs font-bold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5"
          >
            <Columns className="w-4 h-4 text-[#B26A4A]" />
            <span>Open Side-by-Side Comparison Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setGenerateLayoutsModalOpen(false)}
            className="px-4 py-2 border border-[#E8E6DF] rounded-xl text-xs font-semibold text-neutral-600 hover:bg-[#F5F4EF]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

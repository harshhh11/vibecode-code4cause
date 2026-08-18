import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import { Send, ShieldCheck } from 'lucide-react';

export const ConsultationModal: React.FC = () => {
  const {
    consultationModalOpen,
    setConsultationModalOpen,
    selectedDesigner,
    setCurrentView,
    addToast,
  } = useUI();

  const { projects, activeProject } = useProject();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject.id);
  const [topic, setTopic] = useState('AIA Clearance Verification & Custom Millwork Plan');
  const [message, setMessage] = useState(
    'Hi Ethan, our current wardrobe setup feels cramped around the door swing. Looking for an optimal architectural layout & clearance verification before ordering millwork.'
  );
  const [budget, setBudget] = useState('$2,000 - $5,000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationModalOpen(false);
    addToast({
      type: 'success',
      title: 'Consultation Request Sent!',
      message: `Your project blueprint was shared with ${selectedDesigner?.name || 'the professional'}.`,
    });
    setCurrentView('chat');
  };

  return (
    <Modal
      isOpen={consultationModalOpen}
      onClose={() => setConsultationModalOpen(false)}
      maxWidth="max-w-md"
      title={<span className="text-neutral-950 font-extrabold">{`Request Consultation with ${selectedDesigner?.name || 'Architect / Designer'}`}</span>}
      subtitle="Project-linked collaboration inside AERA without contact info exchange"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-neutral-950">
        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">Select Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-950 font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.totalAreaSqFt} sq.ft • Score {p.layoutScore}/100)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">Consultation Topic & Scope</label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-950 placeholder:text-neutral-500 font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
            placeholder="e.g. AIA Clearance Verification & Custom Millwork Plan"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">Estimated Budget Range</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-950 font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
          >
            <option value="$1,000 - $2,500">$1,000 - $2,500 (Layout & Millwork Concept)</option>
            <option value="$2,000 - $5,000">$2,000 - $5,000 (Detailed 3D CAD & Clearance Sign-off)</option>
            <option value="$5,000+">$5,000+ (Full Home Architectural Overhaul)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">Message to Architect / Designer</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs bg-white text-neutral-950 placeholder:text-neutral-500 font-semibold focus:outline-none focus:border-neutral-950 shadow-2xs"
            placeholder="Describe your design goals, concerns, or spatial constraints..."
          />
        </div>

        <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#E5D4C4] flex items-center gap-2.5 text-xs text-[#8C5232]">
          <ShieldCheck className="w-5 h-5 shrink-0 text-[#8C5232]" />
          <p className="text-[11px] leading-relaxed font-semibold">
            All blueprints, 2D floor plans, and 3D scenes synchronize in your private encrypted thread.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Send className="w-4 h-4 text-[#D4AF37]" />
          <span>Send Consultation & Share Blueprint</span>
        </button>
      </form>
    </Modal>
  );
};

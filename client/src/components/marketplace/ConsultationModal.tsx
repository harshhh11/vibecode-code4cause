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
  const [topic, setTopic] = useState('Wardrobe Clearance & Circulation Optimization');
  const [message, setMessage] = useState(
    'Hi Ethan, our current wardrobe setup feels cramped around the door swing. Looking for an optimal architectural layout before ordering millwork.'
  );
  const [budget, setBudget] = useState('$2,000 - $5,000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationModalOpen(false);
    addToast({
      type: 'success',
      title: 'Consultation Request Sent!',
      message: `Your project blueprint was shared with ${selectedDesigner?.name || 'the designer'}.`,
    });
    setCurrentView('chat');
  };

  return (
    <Modal
      isOpen={consultationModalOpen}
      onClose={() => setConsultationModalOpen(false)}
      maxWidth="max-w-md"
      title={`Request Consultation with ${selectedDesigner?.name || 'Designer'}`}
      subtitle="Project-linked collaboration inside AERA without contact info exchange"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Select Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E8E6DF] text-xs bg-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.totalAreaSqFt} sq.ft • Score {p.layoutScore}/100)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Consultation Topic</label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E8E6DF] text-xs bg-white"
            placeholder="e.g. Walking Clearance & Custom Millwork"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Estimated Budget Range</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E8E6DF] text-xs bg-white"
          >
            <option value="$1,000 - $2,500">$1,000 - $2,500 (Layout & Millwork Concept)</option>
            <option value="$2,000 - $5,000">$2,000 - $5,000 (Detailed 3D & Millwork Drafting)</option>
            <option value="$5,000+">$5,000+ (Full Home Architectural Overhaul)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Message to Designer</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E8E6DF] text-xs bg-white"
            placeholder="Describe your design goals, concerns, or spatial constraints..."
          />
        </div>

        <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#E5D4C4] flex items-center gap-2.5 text-xs text-[#8C5232]">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            All blueprints, 2D floor plans, and 3D scenes synchronize in your private encrypted thread.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5 text-[#D4B996]" />
          <span>Send Request & Open Private Chat</span>
        </button>
      </form>
    </Modal>
  );
};

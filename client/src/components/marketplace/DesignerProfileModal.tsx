import React from 'react';
import { useUI } from '../../context/UIContext';
import { Modal } from '../common/Modal';
import {
  Star,
  UserCheck,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

export const DesignerProfileModal: React.FC = () => {
  const {
    designerProfileModalOpen,
    setDesignerProfileModalOpen,
    selectedDesigner,
    setConsultationModalOpen,
  } = useUI();

  if (!selectedDesigner) return null;

  return (
    <Modal
      isOpen={designerProfileModalOpen}
      onClose={() => setDesignerProfileModalOpen(false)}
      maxWidth="max-w-3xl"
      title={`${selectedDesigner.name} — Portfolio & Verification`}
      subtitle={selectedDesigner.title}
    >
      <div className="space-y-6">
        {/* Profile Bio Header */}
        <div className="flex items-start gap-4 p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E6DF]">
          <img
            src={selectedDesigner.avatar}
            alt={selectedDesigner.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-neutral-900">{selectedDesigner.name}</h3>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Verified Architect
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">{selectedDesigner.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {selectedDesigner.rating} ({selectedDesigner.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Responds {selectedDesigner.responseTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {selectedDesigner.location}
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Selected Work & 3D Visualizations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedDesigner.portfolio.map((item) => (
              <div key={item.id} className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6DF] overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-3.5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#B26A4A]">{item.category}</span>
                  <h5 className="text-xs font-bold text-neutral-900">{item.title}</h5>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Client Testimonials
          </h4>
          <div className="space-y-2.5">
            {selectedDesigner.reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-white rounded-xl border border-[#E8E6DF] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">{rev.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 italic">“{rev.comment}”</p>
                <span className="text-[10px] text-neutral-400 font-mono">Project: {rev.projectType}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Request Consultation */}
        <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold block">Consultation Rate</span>
            <span className="font-mono text-sm font-bold text-neutral-900">
              ${selectedDesigner.ratePerSqFt}/sq.ft <span className="text-xs text-neutral-400 font-normal">(${selectedDesigner.hourlyRate}/hr)</span>
            </span>
          </div>

          <button
            onClick={() => {
              setDesignerProfileModalOpen(false);
              setConsultationModalOpen(true);
            }}
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>Request In-App Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#D4B996]" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

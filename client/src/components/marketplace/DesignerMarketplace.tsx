import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { DESIGNERS_DATA } from '../../data/designersData';
import type { DesignerProfile } from '../../types/designer';
import {
  Search,
  Star,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

export const DesignerMarketplace: React.FC = () => {
  const {
    setSelectedDesigner,
    setDesignerProfileModalOpen,
    setConsultationModalOpen,
  } = useUI();

  const [search, setSearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const styles = ['all', 'Modern', 'Minimal', 'Scandinavian', 'Luxury', 'Industrial', 'Japandi'];

  const filtered = DESIGNERS_DATA.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesStyle =
      selectedStyle === 'all' || d.styles.includes(selectedStyle);

    return matchesSearch && matchesStyle;
  });

  const handleOpenProfile = (designer: DesignerProfile) => {
    setSelectedDesigner(designer);
    setDesignerProfileModalOpen(true);
  };

  const handleConsult = (designer: DesignerProfile) => {
    setSelectedDesigner(designer);
    setConsultationModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4ED] dark:bg-[#282115] border border-[#E5D4C4] dark:border-[#523E28] rounded-full text-xs font-bold text-[#8C5232] dark:text-[#D4AF37] uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verified Spatial Architects</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Find Your Interior Designer
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Collaborate with certified spatial planners directly inside AERA. Share live 2D/3D blueprints and receive layout optimizations without exchanging personal contact info.
          </p>
        </div>
      </div>

      {/* Search & Style Filter Bar */}
      <div className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by designer name, specialization, or style..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E6DF] dark:border-[#30363D] text-xs bg-[#FBFBF9] dark:bg-[#0D1117] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
            />
          </div>
        </div>

        {/* Style Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mr-1">Style:</span>
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStyle(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedStyle === s
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                  : 'bg-[#F5F4EF] dark:bg-[#21262D] text-neutral-700 dark:text-neutral-300 hover:bg-[#ECE8DF] dark:hover:bg-[#30363D]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Designer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((designer) => (
          <div
            key={designer.id}
            className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top Showcase Image */}
            <div className="relative h-44 bg-[#F5F4EF] dark:bg-[#0D1117] overflow-hidden">
              <img
                src={designer.portfolio[0]?.imageUrl || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'}
                alt={designer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs text-xs font-bold text-neutral-900 dark:text-white border border-[#E8E6DF] dark:border-[#30363D]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{designer.rating}</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">({designer.reviewsCount})</span>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={designer.avatar}
                    alt={designer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#161B22] shadow-md -mt-10 relative z-10"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{designer.name}</h3>
                      {designer.verified && (
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{designer.experienceYears} Years Exp • {designer.location}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                  {designer.bio}
                </p>

                {/* Specializations & Styles */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {designer.styles.map((style) => (
                    <span
                      key={style}
                      className="text-[10px] font-semibold bg-[#FAF4ED] dark:bg-[#282115] text-[#8C5232] dark:text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#E5D4C4] dark:border-[#523E28]"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-3 border-t border-[#F0ECE4] dark:border-[#21262D] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-bold block">Rate</span>
                  <span className="text-xs font-mono font-extrabold text-neutral-950 dark:text-white">
                    ${designer.ratePerSqFt}/sq.ft <span className="text-neutral-400 dark:text-neutral-500 font-normal">or ${designer.hourlyRate}/hr</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenProfile(designer)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#21262D] transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleConsult(designer)}
                    className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Consult</span>
                    <ArrowRight className="w-3 h-3 text-[#D4AF37] dark:text-[#8C5232]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

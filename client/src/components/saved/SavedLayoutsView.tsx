import React from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Bookmark, Clock, Eye, Box } from 'lucide-react';

export const SavedLayoutsView: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { activeProject } = useProject();

  const handleOpenVersion = () => {
    setStudioMode('2d');
    setCurrentView('studio');
    addToast({
      type: 'info',
      title: 'Layout Version Loaded',
      message: 'Active blueprint loaded onto 2D/3D studio.',
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          Saved Layouts & Version History
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
          Review snapshots, rollback to previous layout iterations, and compare spatial score progress.
        </p>
      </div>

      <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#E8E6DF] dark:border-[#30363D] bg-[#FAF9F6] dark:bg-[#12161E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Project Snapshots ({activeProject.name})
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
            Latest Score: {activeProject.layoutScore}/100
          </span>
        </div>

        <div className="divide-y divide-[#E8E6DF] dark:divide-[#30363D]">
          {activeProject.versions.map((ver, idx) => (
            <div
              key={ver.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F6] dark:hover:bg-[#1C2128] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">{ver.name}</span>
                  {idx === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37] bg-[#FAF4ED] dark:bg-[#282115] px-2 py-0.5 rounded border border-[#E5D4C4] dark:border-[#523E28]">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {ver.timestamp}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Score: {ver.layoutScore}/100</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenVersion}
                  className="px-3.5 py-2 bg-white dark:bg-[#21262D] hover:bg-neutral-100 dark:hover:bg-[#30363D] border border-[#E8E6DF] dark:border-[#30363D] text-neutral-800 dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in 2D</span>
                </button>
                <button
                  onClick={() => {
                    setStudioMode('3d');
                    setCurrentView('studio');
                  }}
                  className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Box className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
                  <span>Open 3D Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { ScoreRing } from '../common/ScoreRing';
import {
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { projects, selectProject } = useProject();
  const { user } = useAuth();

  const handleOpenProject = (projectId: string, mode: '2d' | '3d' = '2d') => {
    selectProject(projectId);
    setStudioMode(mode);
    setCurrentView('studio');
    addToast({
      type: 'info',
      title: 'Project Opened',
      message: `Loaded spatial canvas in ${mode.toUpperCase()} mode.`,
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4ED] dark:bg-[#282115] border border-[#E5D4C4] dark:border-[#523E28] rounded-full text-xs font-bold text-[#8C5232] dark:text-[#D4AF37] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Spatial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your spatial projects, optimize circulation clearance, and test furniture layouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('wizard')}
            className="flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#D4AF37] dark:text-[#8C5232]" />
            <span>New Design Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">Recent Projects & Blueprints</h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">{projects.length} spaces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37] bg-[#FAF4ED] dark:bg-[#282115] px-2 py-0.5 rounded-full border border-[#E5D4C4] dark:border-[#523E28]">
                        {project.type === 'home' ? project.configType || 'Apartment' : 'Single Room'}
                      </span>
                      {/* Prominent High-Contrast Hype Score Badge */}
                      <span className="text-[10px] font-mono font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        HYPE SCORE: {project.layoutScore}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 group-hover:text-[#B26A4A] dark:group-hover:text-[#D4AF37] transition-colors">
                      {project.name}
                    </h3>
                  </div>

                  <ScoreRing score={project.layoutScore} size={52} strokeWidth={5} />
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 font-mono pt-2 border-t border-[#F0ECE4] dark:border-[#21262D]">
                  <span>{project.totalAreaSqFt} sq.ft</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.lastEdited}
                  </span>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-[#FAF9F6] dark:bg-[#12161E] border-t border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
                <button
                  onClick={() => handleOpenProject(project.id, '2d')}
                  className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  2D CAD Floor Plan
                </button>
                <button
                  onClick={() => handleOpenProject(project.id, '3d')}
                  className="flex items-center gap-1 text-xs font-bold text-[#B26A4A] dark:text-[#D4AF37] hover:text-[#8C5232] transition-colors"
                >
                  <span>3D Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick Create Card */}
          <div
            onClick={() => setCurrentView('wizard')}
            className="border-2 border-dashed border-[#DCD8CD] dark:border-[#30363D] hover:border-neutral-900 dark:hover:border-neutral-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#FAF9F6] dark:bg-[#161B22] hover:bg-white dark:hover:bg-[#1C2128] min-h-[220px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#21262D] border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-center text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white group-hover:border-neutral-950 transition-colors shadow-2xs">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-3">Start a New Space</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-[200px]">
              AI 3-level dimension advisor & circulation planner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

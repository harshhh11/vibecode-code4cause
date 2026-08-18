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
  Award,
  Layers,
  Box,
  Palette,
  MessageSquare,
  Compass,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { projects, selectProject, optimizeConflictAutomatically, applyTheme } = useProject();
  const { user } = useAuth();

  const handleOpenProject = (projectId: string, mode: '2d' | '3d' = '2d') => {
    selectProject(projectId);
    setStudioMode(mode);
    setCurrentView('studio');
    addToast({
      type: 'info',
      title: 'Project Loaded',
      message: `Loaded architectural spatial canvas in ${mode.toUpperCase()} mode.`,
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none font-sans transition-colors duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-linear-to-r from-[#FAF4ED] via-white to-[#FAF4ED] dark:from-[#161B22] dark:via-[#12161E] dark:to-[#161B22] p-6 lg:p-8 rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#21262D] border border-[#E5D4C4] dark:border-[#523E28] rounded-full text-xs font-extrabold text-[#8C5232] dark:text-[#D4AF37] uppercase tracking-wider shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI Spatial Intelligence • AERA Studio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Manage your whole-home CAD blueprints, adjust 5-surface color palettes, optimize door clearances, and collaborate with verified architects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('wizard')}
            className="flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#D4AF37] dark:text-[#8C5232]" />
            <span>+ New Design Project</span>
          </button>
        </div>
      </div>

      {/* AERA Spatial AI Assistant Feature Card */}
      <div className="bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#D4AF37] dark:text-[#8C5232]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>AERA Spatial AI Assistant</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Active Spatial Co-Pilot
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Deterministic whole-room dimension intelligence, collision resolution & theme recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenProject(projects[0].id, '2d')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#21262D] hover:bg-[#F0EEE8] dark:hover:bg-[#282E37] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Launch AI Studio</span>
          </button>
        </div>

        {/* Assistant Message Bubble */}
        <div className="p-4 bg-[#FAF9F6] dark:bg-[#12161E] rounded-2xl border border-[#E8E6DF] dark:border-[#21262D] space-y-3">
          <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
            Hello <span className="font-bold">{user.name}</span>! I analyzed your active spaces. Your Master Bedroom blueprint maintains optimal <span className="font-bold text-emerald-600 dark:text-emerald-400">105 cm door clearance</span> with a <span className="font-bold text-[#8C5232] dark:text-[#D4AF37]">94/100 Hype Score</span>. Select a quick action:
          </p>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                optimizeConflictAutomatically();
                addToast({
                  type: 'success',
                  title: 'Auto-Optimization Applied',
                  message: 'All furniture arranged for maximum walking clearance & 0 collisions.',
                });
              }}
              className="px-3 py-1.5 bg-white dark:bg-[#1C2128] hover:bg-[#FAF4ED] dark:hover:bg-[#282115] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
              <span>✨ Auto-Optimize Circulation</span>
            </button>

            <button
              onClick={() => {
                applyTheme('theme-japandi');
                addToast({
                  type: 'success',
                  title: 'Theme Applied',
                  message: 'Japandi Earth & Hinoki palette synced to 2D & 3D.',
                });
              }}
              className="px-3 py-1.5 bg-white dark:bg-[#1C2128] hover:bg-[#FAF4ED] dark:hover:bg-[#282115] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>🎨 Recommend Japandi Theme</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('chat');
              }}
              className="px-3 py-1.5 bg-white dark:bg-[#1C2128] hover:bg-[#FAF4ED] dark:hover:bg-[#282115] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>💬 Consult AIA Architect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-white">Recent Architectural Blueprints</h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">{projects.length} spaces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#161B22] rounded-3xl border border-[#E8E6DF] dark:border-[#21262D] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37] bg-[#FAF4ED] dark:bg-[#282115] px-2.5 py-0.5 rounded-full border border-[#E5D4C4] dark:border-[#523E28]">
                        {project.type === 'home' ? project.configType || 'Apartment' : 'Single Room'}
                      </span>
                      {/* Prominent High-Contrast Hype Score Badge */}
                      <span className="text-[10px] font-mono font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        HYPE SCORE: {project.layoutScore}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-neutral-900 dark:text-white mt-1 group-hover:text-[#B26A4A] dark:group-hover:text-[#D4AF37] transition-colors">
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

              {/* Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-[#FAF9F6] dark:bg-[#12161E] border-t border-[#E8E6DF] dark:border-[#21262D] flex items-center justify-between">
                <button
                  onClick={() => handleOpenProject(project.id, '2d')}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D CAD</span>
                </button>

                <button
                  onClick={() => handleOpenProject(project.id, '3d')}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-[#B26A4A] dark:text-[#D4AF37] hover:text-[#8C5232] transition-colors"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useUI, type Camera3DPreset } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import {
  Box,
  Layers,
  Wand2,
  Download,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Compass,
  Sun,
  Moon,
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    currentView,
    studioMode,
    setStudioMode,
    camera3DPreset,
    setCamera3DPreset,
    is360ImmersiveView,
    setIs360ImmersiveView,
    setGenerateLayoutsModalOpen,
    setExportModalOpen,
    globalTheme,
    toggleGlobalTheme,
  } = useUI();

  const {
    projects,
    activeProject,
    selectProject,
    activeRoom,
    selectRoom,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useProject();

  const isStudio = currentView === 'studio';

  return (
    <header className="h-14 bg-white dark:bg-[#12161E] border-b border-[#E8E6DF] dark:border-[#21262D] px-4 md:px-6 flex items-center justify-between z-20 select-none transition-colors duration-200 gap-2">
      {/* Left: Project & Room Selector */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Project Dropdown */}
        <div className="relative">
          <select
            value={activeProject.id}
            onChange={(e) => selectProject(e.target.value)}
            className="appearance-none bg-[#FAF9F6] dark:bg-[#1C2128] hover:bg-[#F0EEE8] dark:hover:bg-[#282E37] text-neutral-900 dark:text-neutral-100 font-extrabold text-xs px-3 py-1.5 pr-7 rounded-xl border border-[#E8E6DF] dark:border-[#30363D] cursor-pointer focus:outline-none transition-colors shadow-2xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Room Dropdown (in Studio) */}
        {activeProject.rooms.length > 1 && isStudio && (
          <>
            <span className="text-neutral-300 dark:text-neutral-700 text-xs">/</span>
            <div className="relative">
              <select
                value={activeRoom.id}
                onChange={(e) => selectRoom(e.target.value)}
                className="appearance-none bg-white dark:bg-[#161B22] text-neutral-800 dark:text-neutral-200 font-bold text-xs px-2.5 py-1.5 pr-6 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] cursor-pointer focus:outline-none transition-colors"
              >
                {activeProject.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.dimensions.length} × {r.dimensions.width}')
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </>
        )}
      </div>

      {/* Center: 2D CAD vs 3D Studio & Camera Selector */}
      {isStudio && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Main 2D / 3D Mode Toggle */}
          <div className="bg-[#FAF9F6] dark:bg-[#161B22] p-1 rounded-xl border border-[#E0DCD3] dark:border-[#30363D] flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setStudioMode('2d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                studioMode === '2d'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D CAD</span>
            </button>

            <button
              onClick={() => setStudioMode('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                studioMode === '3d'
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
              <span>3D Studio</span>
            </button>
          </div>

          {/* 3D Camera Controls (Compact Dropdown & 360 Icon) */}
          {studioMode === '3d' && (
            <div className="flex items-center gap-1.5 bg-[#FAF9F6] dark:bg-[#161B22] p-1 rounded-xl border border-[#E0DCD3] dark:border-[#30363D]">
              <div className="relative">
                <select
                  value={camera3DPreset}
                  onChange={(e) => setCamera3DPreset(e.target.value as Camera3DPreset)}
                  className="appearance-none bg-white dark:bg-[#21262D] text-neutral-800 dark:text-neutral-200 font-bold text-[11px] pl-2.5 pr-6 py-1 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] cursor-pointer focus:outline-none"
                >
                  <option value="isometric">Isometric</option>
                  <option value="top">Top Down</option>
                  <option value="walkthrough">Walkthrough</option>
                </select>
                <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => setIs360ImmersiveView(!is360ImmersiveView)}
                title="Toggle 360° Immersive Walkthrough"
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  is360ImmersiveView
                    ? 'bg-neutral-950 dark:bg-white text-[#D4AF37] dark:text-[#8C5232] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-[#EAE6DD] dark:hover:bg-[#282E37]'
                }`}
              >
                <Compass className="w-3 h-3 text-[#D4AF37]" />
                <span>360°</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Right: History, AI Permutations, Theme, Export */}
      <div className="flex items-center gap-2 shrink-0">
        {isStudio && (
          <>
            {/* Undo / Redo */}
            <div className="flex items-center border border-[#E8E6DF] dark:border-[#30363D] rounded-xl overflow-hidden bg-[#FAF9F6] dark:bg-[#161B22]">
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
                className="p-1.5 hover:bg-white dark:hover:bg-[#21262D] text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3.5 bg-[#E8E6DF] dark:bg-[#30363D]" />
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
                className="p-1.5 hover:bg-white dark:hover:bg-[#21262D] text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AI Layouts */}
            <button
              onClick={() => setGenerateLayoutsModalOpen(true)}
              className="px-3 py-1.5 bg-[#FAF4ED] dark:bg-[#282115] hover:bg-[#F3E5D4] dark:hover:bg-[#382E1E] text-[#8C5232] dark:text-[#D4AF37] border border-[#E5D4C4] dark:border-[#523E28] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Layouts</span>
            </button>
          </>
        )}

        {/* Global Dark/Light Theme Switcher */}
        <button
          onClick={toggleGlobalTheme}
          title={`Switch to ${globalTheme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2 bg-[#FAF9F6] dark:bg-[#1C2128] hover:bg-[#EAE6DD] dark:hover:bg-[#2D333B] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          {globalTheme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-neutral-600" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
          )}
        </button>

        {/* Export Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

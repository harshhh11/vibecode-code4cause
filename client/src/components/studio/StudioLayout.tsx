import React from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { LeftSidebar } from './LeftSidebar';
import { Canvas2D } from './Canvas2D';
import { Viewport3D } from './Viewport3D';
import { DimensionAlertBanner } from './DimensionAlertBanner';
import { PropertiesPanel } from '../panels/PropertiesPanel';

import { LayoutScorePanel } from '../panels/LayoutScorePanel';
import { ColorThemePanel } from '../panels/ColorThemePanel';
import { WalkingPathPanel } from '../panels/WalkingPathPanel';
import { AIAssistantPanel } from '../panels/AIAssistantPanel';
import {
  Ruler,
  Sparkles,
  Palette,
  Move,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Zap,
} from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const {
    studioMode,
    activeStudioTab,
    setActiveStudioTab,
    is360ImmersiveView,
    leftSidebarCollapsed,
    setLeftSidebarCollapsed,
    rightSidebarCollapsed,
    setRightSidebarCollapsed,
  } = useUI();

  const { layoutScore } = useProject();

  const getScoreBadgeClass = (score: number) => {
    if (score >= 85) return 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    if (score >= 70) return 'bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]';
    return 'bg-rose-500 text-white';
  };

  const rightTabs: Array<{ id: typeof activeStudioTab; label: string; icon: any; badge?: string; badgeClass?: string }> = [
    { id: 'properties', label: 'Properties', icon: Ruler },
    { id: 'score', label: 'Hype Score', icon: Sparkles, badge: `${layoutScore.overall}`, badgeClass: getScoreBadgeClass(layoutScore.overall) },
    { id: 'themes', label: 'Colors', icon: Palette },
    { id: 'paths', label: 'Paths', icon: Move },
    { id: 'ai_assistant', label: 'AERA AI', icon: Bot },
  ];

  return (
    <div className="flex-1 flex overflow-hidden relative bg-[#FAF9F5] dark:bg-[#0D1117] h-[calc(100vh-3.5rem)] transition-colors duration-200">
      {/* Left Sidebar: Furniture & Elements (hidden in 360 mode or when collapsed) */}
      {!is360ImmersiveView && !leftSidebarCollapsed && <LeftSidebar />}

      {/* Center Viewport Area: 2D Canvas or 3D Viewport */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Real-time ⚠️ Dimension Alert Banner */}
        {!is360ImmersiveView && <DimensionAlertBanner />}


        {/* Dynamic Studio Canvas & Floating Edge Toggles */}
        <div className="flex-1 relative overflow-hidden">
          {studioMode === '2d' ? <Canvas2D /> : <Viewport3D />}




          {/* Left Sidebar Collapse / Expand Toggle Button */}
          {!is360ImmersiveView && (
            <button
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              title={leftSidebarCollapsed ? 'Open Furniture Library' : 'Collapse Furniture Library'}
              className="absolute top-4 left-4 z-20 p-2 bg-white/95 dark:bg-[#161B22]/95 hover:bg-[#F5F4EF] dark:hover:bg-[#21262D] text-neutral-700 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            >
              {leftSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
                  <span className="hidden md:inline">Furniture Library</span>
                </>
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Top-Center Prominent Hype Score Live Pill */}
          {!is360ImmersiveView && (
            <button
              onClick={() => {
                setRightSidebarCollapsed(false);
                setActiveStudioTab('score');
              }}
              title="Click to inspect live AERA Hype Score metrics"
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-white/95 dark:bg-[#161B22]/95 hover:bg-[#FAF4ED] dark:hover:bg-[#282115] border border-[#E8E6DF] dark:border-[#30363D] rounded-2xl shadow-lg backdrop-blur-md transition-all flex items-center gap-2 text-xs font-extrabold cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span className="text-neutral-700 dark:text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                HYPE SCORE:
              </span>
              <span className="font-mono text-xs text-white bg-emerald-600 dark:bg-emerald-500 px-2 py-0.5 rounded-full font-black shadow-xs">
                {layoutScore.overall}/100
              </span>
            </button>
          )}

          {/* Right Sidebar Collapse / Expand Toggle Button */}
          {!is360ImmersiveView && (
            <button
              onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              title={rightSidebarCollapsed ? 'Open Inspector Panel' : 'Collapse Inspector Panel'}
              className="absolute top-4 right-4 z-20 p-2 bg-white/95 dark:bg-[#161B22]/95 hover:bg-[#F5F4EF] dark:hover:bg-[#21262D] text-neutral-700 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            >
              {rightSidebarCollapsed ? (
                <>
                  <span className="hidden md:inline">Inspector</span>
                  <PanelRightOpen className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
                </>
              ) : (
                <PanelRightClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </main>



      {/* Right Sidebar: Multi-Tab Inspector (hidden in 360 mode or when collapsed) */}
      {!is360ImmersiveView && !rightSidebarCollapsed && (
        <aside className="w-84 bg-white dark:bg-[#12151B] border-l border-[#E8E6DF] dark:border-[#30363D] flex flex-col h-full select-none z-10 transition-all">
          {/* Tab Headers */}
          <div className="flex items-center border-b border-[#E8E6DF] dark:border-[#30363D] bg-[#FAF9F6] dark:bg-[#161B22] p-1 gap-1">
            {rightTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStudioTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudioTab(tab.id)}
                  className={`flex-1 py-2 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#21262D] text-neutral-900 dark:text-white shadow-2xs font-bold'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        tab.badgeClass || (isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600')
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 overflow-y-auto">
            {activeStudioTab === 'properties' && <PropertiesPanel />}
            {activeStudioTab === 'score' && <LayoutScorePanel />}
            {activeStudioTab === 'themes' && <ColorThemePanel />}
            {activeStudioTab === 'paths' && <WalkingPathPanel />}
            {activeStudioTab === 'ai_assistant' && <AIAssistantPanel />}
          </div>
        </aside>
      )}
    </div>
  );
};

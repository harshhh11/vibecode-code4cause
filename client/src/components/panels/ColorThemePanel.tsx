import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { COLOR_THEMES } from '../../data/colorThemes';
import { Palette, CheckCircle2 } from 'lucide-react';

export const ColorThemePanel: React.FC = () => {
  const { activeTheme, applyTheme } = useProject();

  return (
    <div className="p-4 space-y-5 select-none animate-fadeIn font-sans transition-colors duration-200">
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          <span>Curated Color Themes</span>
        </h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          Apply architectural color harmonies with 1-click sync to 2D blueprint and 3D studio.
        </p>
      </div>

      <div className="space-y-3.5">
        {COLOR_THEMES.map((theme) => {
          const isSelected = activeTheme.id === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                isSelected
                  ? 'border-neutral-950 dark:border-white bg-white dark:bg-[#161B22] ring-2 ring-neutral-950/10 dark:ring-white/20 shadow-md'
                  : 'border-[#E8E6DF] dark:border-[#30363D] bg-[#FAF9F6] dark:bg-[#12161E] hover:bg-white dark:hover:bg-[#1C2128] hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{theme.name}</h4>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 capitalize">{theme.style}</span>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold">
                    Apply
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                  style={{ backgroundColor: theme.palette.walls }}
                  title={`Walls: ${theme.palette.wallsName}`}
                />
                <span
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                  style={{ backgroundColor: theme.palette.accent }}
                  title={`Accent: ${theme.palette.accentName}`}
                />
                <span
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                  style={{ backgroundColor: theme.palette.furniture }}
                  title={`Furniture: ${theme.palette.furnitureName}`}
                />
                <span
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                  style={{ backgroundColor: theme.palette.curtains }}
                  title={`Curtains: ${theme.palette.curtainsName}`}
                />
                <span
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                  style={{ backgroundColor: theme.palette.flooring }}
                  title={`Floors: ${theme.palette.flooringName}`}
                />
              </div>

              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono flex items-center justify-between pt-1 border-t border-[#F0ECE4] dark:border-[#21262D]">
                <span>Floors: {theme.palette.flooringName}</span>
                <span>Walls: {theme.palette.wallsName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

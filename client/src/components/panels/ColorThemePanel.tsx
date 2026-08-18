import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { COLOR_THEMES } from '../../data/colorThemes';
import type { ColorPalette } from '../../types/theme';
import {
  Palette,
  CheckCircle2,
  Sliders,
  Sparkles,
  Save,
} from 'lucide-react';


const PRESET_WALL_SWATCHES = [
  { name: 'Chantilly Lace', hex: '#F5F4EF' },
  { name: 'Alabaster Warm White', hex: '#FAF7F2' },
  { name: 'Limewash Beige', hex: '#E8E2D5' },
  { name: 'Sage Mist', hex: '#8A9A86' },
  { name: 'Slate Charcoal', hex: '#33383F' },
];

const PRESET_FURNITURE_SWATCHES = [
  { name: 'Natural White Oak', hex: '#7D5836' },
  { name: 'Smoked Dark Walnut', hex: '#4A3525' },
  { name: 'Raw Bleached Ash', hex: '#9C826A' },
  { name: 'Blackened Teak', hex: '#2B231D' },
  { name: 'Warm Caramel Maple', hex: '#8C5232' },
];

const PRESET_ACCENT_SWATCHES = [
  { name: 'Brushed Brass', hex: '#D4AF37' },
  { name: 'Burnt Terracotta', hex: '#B26A4A' },
  { name: 'Matte Black', hex: '#1F1F1F' },
  { name: 'Forest Emerald', hex: '#2E5A44' },
  { name: 'Champagne Bronze', hex: '#C5A059' },
];

const PRESET_CURTAIN_SWATCHES = [
  { name: 'Oatmeal Bouclé', hex: '#EFEAE1' },
  { name: 'Natural Flax Linen', hex: '#D8CEBD' },
  { name: 'Warm Cashmere', hex: '#C4B49E' },
  { name: 'Moody Indigo', hex: '#283648' },
  { name: 'Sage Velvet', hex: '#A3B19B' },
];

const PRESET_FLOOR_SWATCHES = [
  { name: 'Light Scandinavian Oak', hex: '#D4B38C' },
  { name: 'Smoked Walnut Plank', hex: '#6E4E38' },
  { name: 'Italian Carrara Marble', hex: '#F0EEE9' },
  { name: 'Polished Concrete', hex: '#B8B8B5' },
  { name: 'Natural Herringbone Teak', hex: '#8F6541' },
];

export const ColorThemePanel: React.FC = () => {
  const { activeTheme, applyTheme, customThemes, applyCustomPalette } = useProject();

  const [panelTab, setPanelTab] = useState<'presets' | 'custom'>('presets');
  const [customPaletteName, setCustomPaletteName] = useState('Bespoke Architectural Palette');

  const [customPalette, setCustomPalette] = useState<ColorPalette>({
    walls: activeTheme.palette.walls || '#FAF7F2',
    wallsName: activeTheme.palette.wallsName || 'Alabaster Warm White',
    accent: activeTheme.palette.accent || '#D4AF37',
    accentName: activeTheme.palette.accentName || 'Brushed Brass',
    furniture: activeTheme.palette.furniture || '#7D5836',
    furnitureName: activeTheme.palette.furnitureName || 'Natural White Oak',
    curtains: activeTheme.palette.curtains || '#EFEAE1',
    curtainsName: activeTheme.palette.curtainsName || 'Oatmeal Bouclé',
    flooring: activeTheme.palette.flooring || '#D4B38C',
    flooringName: activeTheme.palette.flooringName || 'Light Scandinavian Oak',
  });

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    applyCustomPalette(customPalette, customPaletteName || 'My Custom Palette');
  };

  return (
    <div className="p-4 space-y-5 select-none animate-fadeIn font-sans transition-colors duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Color & Materials</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-neutral-400 bg-[#FAF9F6] dark:bg-[#161B22] px-2 py-0.5 rounded-full border border-[#E8E6DF] dark:border-[#30363D]">
            2D & 3D Synced
          </span>
        </div>

        {/* Tab Switcher: Curated vs Custom Palette */}
        <div className="p-1 bg-[#ECEAE3] dark:bg-[#161B22] rounded-xl flex items-center gap-1 border border-[#DFDDD5] dark:border-[#30363D]">
          <button
            onClick={() => setPanelTab('presets')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              panelTab === 'presets'
                ? 'bg-white dark:bg-[#21262D] text-neutral-950 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Curated Themes</span>
          </button>

          <button
            onClick={() => setPanelTab('custom')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              panelTab === 'custom'
                ? 'bg-white dark:bg-[#21262D] text-neutral-950 dark:text-white shadow-2xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Custom Palette</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURATED ARCHITECTURAL THEMES */}
      {panelTab === 'presets' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* User's Custom Themes (if any) */}
          {customThemes.length > 0 && (
            <div className="space-y-2 pb-2 border-b border-[#E8E6DF] dark:border-[#21262D]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Your Saved Custom Palettes
              </span>
              {customThemes.map((cTheme) => {
                const isSelected = activeTheme.id === cTheme.id;
                return (
                  <div
                    key={cTheme.id}
                    onClick={() => applyTheme(cTheme.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-[#E8E6DF] dark:border-[#30363D] bg-[#FAF9F6] dark:bg-[#12161E] hover:bg-white dark:hover:bg-[#1C2128]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{cTheme.name}</h4>
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold">
                          Apply
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[cTheme.palette.walls, cTheme.palette.accent, cTheme.palette.furniture, cTheme.palette.curtains, cTheme.palette.flooring].map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
      )}

      {/* TAB 2: CUSTOM COLOR PALETTE BUILDER STUDIO */}
      {panelTab === 'custom' && (
        <form onSubmit={handleApplyCustom} className="space-y-4 animate-fadeIn">
          {/* Custom Palette Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block">
              Palette Name
            </label>
            <input
              type="text"
              value={customPaletteName}
              onChange={(e) => setCustomPaletteName(e.target.value)}
              placeholder="e.g. Penthouse Sunset Oak"
              className="w-full px-3 py-2 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
            />
          </div>

          {/* Active Palette Preview Bar */}
          <div className="p-3 bg-[#FAF9F6] dark:bg-[#12161E] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Live Harmony Preview
            </span>
            <div className="flex h-7 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-xs">
              <div style={{ backgroundColor: customPalette.walls }} className="flex-1" title="Walls" />
              <div style={{ backgroundColor: customPalette.flooring }} className="flex-1" title="Floors" />
              <div style={{ backgroundColor: customPalette.furniture }} className="flex-1" title="Furniture" />
              <div style={{ backgroundColor: customPalette.curtains }} className="flex-1" title="Curtains" />
              <div style={{ backgroundColor: customPalette.accent }} className="flex-1" title="Accent" />
            </div>
          </div>

          {/* 1. Wall Paint */}
          <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                1. Wall Paint Finish
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.walls}
                  onChange={(e) =>
                    setCustomPalette({ ...customPalette, walls: e.target.value, wallsName: 'Custom Wall' })
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border border-[#E8E6DF] dark:border-[#30363D] bg-transparent"
                />
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{customPalette.walls}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {PRESET_WALL_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch.hex}
                  onClick={() => setCustomPalette({ ...customPalette, walls: swatch.hex, wallsName: swatch.name })}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    customPalette.walls === swatch.hex
                      ? 'ring-2 ring-neutral-950 dark:ring-white scale-110'
                      : 'border-black/15 dark:border-white/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* 2. Furniture & Millwork Wood */}
          <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                2. Furniture & Wood Finish
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.furniture}
                  onChange={(e) =>
                    setCustomPalette({ ...customPalette, furniture: e.target.value, furnitureName: 'Custom Wood' })
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border border-[#E8E6DF] dark:border-[#30363D] bg-transparent"
                />
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{customPalette.furniture}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {PRESET_FURNITURE_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch.hex}
                  onClick={() => setCustomPalette({ ...customPalette, furniture: swatch.hex, furnitureName: swatch.name })}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    customPalette.furniture === swatch.hex
                      ? 'ring-2 ring-neutral-950 dark:ring-white scale-110'
                      : 'border-black/15 dark:border-white/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* 3. Hardware & Accent Trim */}
          <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                3. Accent Trim & Lighting
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.accent}
                  onChange={(e) =>
                    setCustomPalette({ ...customPalette, accent: e.target.value, accentName: 'Custom Accent' })
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border border-[#E8E6DF] dark:border-[#30363D] bg-transparent"
                />
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{customPalette.accent}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {PRESET_ACCENT_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch.hex}
                  onClick={() => setCustomPalette({ ...customPalette, accent: swatch.hex, accentName: swatch.name })}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    customPalette.accent === swatch.hex
                      ? 'ring-2 ring-neutral-950 dark:ring-white scale-110'
                      : 'border-black/15 dark:border-white/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* 4. Curtains & Fabrics */}
          <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                4. Drapes & Upholstery
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.curtains}
                  onChange={(e) =>
                    setCustomPalette({ ...customPalette, curtains: e.target.value, curtainsName: 'Custom Fabric' })
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border border-[#E8E6DF] dark:border-[#30363D] bg-transparent"
                />
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{customPalette.curtains}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {PRESET_CURTAIN_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch.hex}
                  onClick={() => setCustomPalette({ ...customPalette, curtains: swatch.hex, curtainsName: swatch.name })}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    customPalette.curtains === swatch.hex
                      ? 'ring-2 ring-neutral-950 dark:ring-white scale-110'
                      : 'border-black/15 dark:border-white/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* 5. Flooring */}
          <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                5. Architectural Flooring Tone
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.flooring}
                  onChange={(e) =>
                    setCustomPalette({ ...customPalette, flooring: e.target.value, flooringName: 'Custom Floor' })
                  }
                  className="w-6 h-6 rounded-md cursor-pointer border border-[#E8E6DF] dark:border-[#30363D] bg-transparent"
                />
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{customPalette.flooring}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {PRESET_FLOOR_SWATCHES.map((swatch) => (
                <button
                  type="button"
                  key={swatch.hex}
                  onClick={() => setCustomPalette({ ...customPalette, flooring: swatch.hex, flooringName: swatch.name })}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    customPalette.flooring === swatch.hex
                      ? 'ring-2 ring-neutral-950 dark:ring-white scale-110'
                      : 'border-black/15 dark:border-white/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Save className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
            <span>Apply Custom Palette to 2D & 3D</span>
          </button>
        </form>
      )}
    </div>
  );
};

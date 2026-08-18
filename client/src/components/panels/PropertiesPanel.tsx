import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { checkFurnitureDimensionCompatibility } from '../../utils/dimensionAdvisor';
import type { WallSide } from '../../types/project';
import {
  Ruler,
  AlertTriangle,
  Tag,
  Box,
  Trash2,
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const {
    furniture,
    selectedFurnitureId,
    updateFurniture,
    activeRoom,
    selectedDoorId,
    updateDoor,
    removeDoor,
  } = useProject();

  const selectedItem = furniture.find((f) => f.id === selectedFurnitureId);
  const selectedDoor = activeRoom.doors.find((d) => d.id === selectedDoorId);

  // 1. DOOR SELECTED INSPECTOR
  if (selectedDoor) {
    const isHorizontal = selectedDoor.wall === 'north' || selectedDoor.wall === 'south';
    const wallLength = isHorizontal ? activeRoom.dimensions.length : activeRoom.dimensions.width;

    return (
      <div className="p-4 space-y-5 select-none animate-fadeIn font-sans transition-colors duration-200">
        <div className="space-y-1 border-b border-[#E8E6DF] dark:border-[#30363D] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37]">
            Architectural Opening
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">{selectedDoor.name}</h3>
            <button
              onClick={() => removeDoor(selectedDoor.id)}
              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors"
              title="Delete Door"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Wall Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block">Wall Location</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['south', 'west', 'north', 'east'] as WallSide[]).map((w) => (
              <button
                key={w}
                onClick={() => updateDoor(selectedDoor.id, { wall: w, offset: 2.0 })}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedDoor.wall === w
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                    : 'bg-[#F5F4EF] dark:bg-[#21262D] hover:bg-[#EAE6DD] dark:hover:bg-[#30363D] text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Wall Offset Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Offset Along Wall</span>
            <span className="font-mono font-bold text-[#8C5232] dark:text-[#D4AF37] bg-[#FAF4ED] dark:bg-[#282115] px-2 py-0.5 rounded border border-[#E5D4C4] dark:border-[#523E28]">
              {selectedDoor.offset} ft ({ (selectedDoor.offset * 0.3048).toFixed(2) } m)
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max={Math.max(1, wallLength - selectedDoor.width - 0.5)}
            step="0.25"
            value={selectedDoor.offset}
            onChange={(e) => updateDoor(selectedDoor.id, { offset: Number(e.target.value) })}
            className="w-full accent-[#B26A4A] dark:accent-[#D4AF37] cursor-pointer"
          />
        </div>

        {/* Door Width */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block">Door Leaf Width</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[2.5, 3.0, 3.5, 4.0].map((widthVal) => (
              <button
                key={widthVal}
                onClick={() => updateDoor(selectedDoor.id, { width: widthVal })}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedDoor.width === widthVal
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'bg-[#F5F4EF] dark:bg-[#21262D] hover:bg-[#EAE6DD] dark:hover:bg-[#30363D] text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {widthVal}'
              </button>
            ))}
          </div>
        </div>

        {/* Swing Direction */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block">Swing Orientation</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'inside_left', label: 'Inside Left' },
              { id: 'inside_right', label: 'Inside Right' },
              { id: 'outside_left', label: 'Outside Left' },
              { id: 'outside_right', label: 'Outside Right' },
            ].map((sw) => (
              <button
                key={sw.id}
                onClick={() => updateDoor(selectedDoor.id, { swing: sw.id as any })}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                  selectedDoor.swing === sw.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold'
                    : 'bg-[#F5F4EF] dark:bg-[#21262D] text-neutral-700 dark:text-neutral-300 hover:bg-[#EAE6DD] dark:hover:bg-[#30363D]'
                }`}
              >
                {sw.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. NO SELECTION FALLBACK
  if (!selectedItem) {
    return (
      <div className="p-6 text-center text-neutral-400 space-y-3 font-sans transition-colors duration-200">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] dark:bg-[#161B22] border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-500">
          <Box className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-200">No Item Selected</h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Click any furniture element or door on the 2D floor plan or 3D studio to inspect and adjust properties in real time.
          </p>
        </div>
      </div>
    );
  }

  // 3. FURNITURE SELECTED INSPECTOR
  const check = checkFurnitureDimensionCompatibility(
    selectedItem.name,
    selectedItem.category,
    { width: selectedItem.width, depth: selectedItem.depth, height: selectedItem.height },
    activeRoom.dimensions,
    furniture.length
  );

  return (
    <div className="p-4 space-y-5 select-none animate-fadeIn font-sans transition-colors duration-200">
      <div className="space-y-1 border-b border-[#E8E6DF] dark:border-[#30363D] pb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A4A] dark:text-[#D4AF37]">
          {selectedItem.category} Element
        </span>
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">{selectedItem.name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Dimensions</span>
          </h4>
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">Footprint: {(selectedItem.width * selectedItem.depth).toFixed(1)} sq.ft</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Width (X)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={selectedItem.width}
                onChange={(e) => updateFurniture(selectedItem.id, { width: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] text-xs font-mono font-bold bg-[#FAF9F6] dark:bg-[#161B22] text-neutral-900 dark:text-white"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Depth (Y)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={selectedItem.depth}
                onChange={(e) => updateFurniture(selectedItem.id, { depth: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] text-xs font-mono font-bold bg-[#FAF9F6] dark:bg-[#161B22] text-neutral-900 dark:text-white"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">Height (Z)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="15"
                value={selectedItem.height || 2.5}
                onChange={(e) => updateFurniture(selectedItem.id, { height: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E6DF] dark:border-[#30363D] text-xs font-mono font-bold bg-[#FAF9F6] dark:bg-[#161B22] text-neutral-900 dark:text-white"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">ft</span>
            </div>
          </div>
        </div>
      </div>

      {check.status !== 'suitable' && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>Level 3 Compatibility Alert</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">{check.message}</p>
          <div className="text-[10px] text-amber-900 dark:text-amber-300 font-mono bg-white/70 dark:bg-[#161B22]/70 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
            <p>Clearance Impact: {check.currentClearanceCm} cm → {check.optimizedClearanceCm} cm</p>
          </div>
          <button
            onClick={() => {
              updateFurniture(selectedItem.id, {
                width: check.recommendedDims.width,
                depth: check.recommendedDims.depth,
              });
            }}
            className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            Apply Recommended ({check.recommendedDims.width} × {check.recommendedDims.depth} ft)
          </button>
        </div>
      )}

      <div className="p-3 bg-[#FAF9F6] dark:bg-[#161B22] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Existing Furniture</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">I already own this item</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={selectedItem.isExisting}
          onChange={(e) => updateFurniture(selectedItem.id, { isExisting: e.target.checked })}
          className="w-4 h-4 accent-neutral-900 dark:accent-white rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import type { FurnitureCategory } from '../../types/furniture';
import { checkFurnitureDimensionCompatibility } from '../../utils/dimensionAdvisor';
import { AlertTriangle, Plus, Tag } from 'lucide-react';

export const CustomFurnitureModal: React.FC = () => {
  const { customFurnitureModalOpen, setCustomFurnitureModalOpen, addToast } = useUI();
  const { activeRoom, addFurniture, furniture } = useProject();

  const [name, setName] = useState('Custom Wardrobe');
  const [category, setCategory] = useState<FurnitureCategory>('storage');
  const [width, setWidth] = useState<number>(8.0);
  const [depth, setDepth] = useState<number>(3.0);
  const [height, setHeight] = useState<number>(7.0);
  const [isExisting, setIsExisting] = useState<boolean>(false);

  const check = checkFurnitureDimensionCompatibility(
    name,
    category,
    { width, depth, height },
    activeRoom.dimensions,
    furniture.length
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const L = activeRoom.dimensions.length;
    const W = activeRoom.dimensions.width;

    addFurniture({
      name,
      category,
      width,
      depth,
      height,
      x: Math.max(1, (L - width) / 2),
      y: Math.max(1, (W - depth) / 2),
      rotation: 0,
      isExisting,
      color: category === 'storage' ? '#6E472A' : '#8C6847',
      modelType: category === 'storage' ? 'wardrobe' : 'custom_item',
    });

    setCustomFurnitureModalOpen(false);
    addToast({
      type: check.status === 'suitable' ? 'success' : 'warning',
      title: `${name} Added to Blueprint`,
      message: `${width} × ${depth} ft placed on canvas.`,
    });
  };

  return (
    <Modal
      isOpen={customFurnitureModalOpen}
      onClose={() => setCustomFurnitureModalOpen(false)}
      maxWidth="max-w-md"
      title="Create Custom Furniture"
      subtitle={`Evaluates compatibility against ${activeRoom.name} (${activeRoom.dimensions.length} × ${activeRoom.dimensions.width} ft)`}
    >
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Item Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E8E6DF] text-xs font-semibold bg-white"
            placeholder="e.g. Custom Millwork Wardrobe"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs bg-white"
          >
            <option value="storage">Storage & Wardrobes</option>
            <option value="bedroom">Bedroom</option>
            <option value="living">Living Room</option>
            <option value="office">Office & Study</option>
            <option value="dining">Dining</option>
            <option value="decor">Decor & Accents</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Width (X)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Depth (Y)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Height (Z)</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="15"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E6DF] text-xs font-mono font-bold"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono">ft</span>
            </div>
          </div>
        </div>

        {check.status !== 'suitable' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>⚠️ Dimension Compatibility Alert</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">{check.message}</p>
            <div className="text-[10px] text-amber-900 font-mono bg-white/60 p-2 rounded-lg border border-amber-200">
              <p>Current: {width} × {depth} ft</p>
              <p>Recommended: {check.recommendedDims.width} × {check.recommendedDims.depth} ft</p>
              <p>Walking Clearance: {check.currentClearanceCm} cm → {check.optimizedClearanceCm} cm</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setWidth(check.recommendedDims.width);
                setDepth(check.recommendedDims.depth);
              }}
              className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
            >
              Apply Recommended Dimensions ({check.recommendedDims.width} × {check.recommendedDims.depth} ft)
            </button>
          </div>
        )}

        <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#B26A4A]" />
            <div>
              <p className="text-xs font-bold text-neutral-900">Existing Furniture</p>
              <p className="text-[10px] text-neutral-500">I already own this item</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isExisting}
            onChange={(e) => setIsExisting(e.target.checked)}
            className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#D4B996]" />
          <span>Add Custom Furniture to Room</span>
        </button>
      </form>
    </Modal>
  );
};

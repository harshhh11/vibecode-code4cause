import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import { FURNITURE_CATALOG } from '../../data/furnitureLibrary';
import type { FurnitureCategory } from '../../types/furniture';
import {
  Search,
  Plus,
  Bed,
  Sofa,
  Utensils,
  Briefcase,
  Columns,
  Sparkles,
  Tag,
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { addFurniture, setExistingFurnitureMode, activeRoom } = useProject();
  const { setCustomFurnitureModalOpen, addToast } = useUI();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | 'all'>('all');
  const [isExistingMode, setIsExistingMode] = useState(false);

  const categories: Array<{ id: FurnitureCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Items', icon: Sparkles },
    { id: 'bedroom', label: 'Bedroom', icon: Bed },
    { id: 'living', label: 'Living', icon: Sofa },
    { id: 'dining', label: 'Dining', icon: Utensils },
    { id: 'office', label: 'Office', icon: Briefcase },
    { id: 'storage', label: 'Storage', icon: Columns },
  ];

  const filteredItems = FURNITURE_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (item: typeof FURNITURE_CATALOG[0]) => {
    const L = activeRoom.dimensions.length;
    const W = activeRoom.dimensions.width;

    addFurniture({
      name: item.name,
      category: item.category,
      width: item.width,
      depth: item.depth,
      height: item.height,
      x: Math.max(1, (L - item.width) / 2),
      y: Math.max(1, (W - item.depth) / 2),
      rotation: 0,
      isExisting: isExistingMode,
      color: item.defaultColor,
      modelType: item.modelType,
    });

    addToast({
      type: 'success',
      title: 'Added to Floor Plan',
      message: `${item.name} (${item.width} × ${item.depth} ft) placed on canvas.`,
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-[#12161E] border-r border-[#E8E6DF] dark:border-[#21262D] flex flex-col h-full select-none z-10 font-sans transition-colors duration-200">
      <div className="p-4 border-b border-[#E8E6DF] dark:border-[#21262D] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Furniture Library
          </h3>
          <button
            onClick={() => setCustomFurnitureModalOpen(true)}
            className="text-[11px] font-bold text-[#B26A4A] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Custom Size</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search furniture items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-[#F5F4EF] dark:bg-[#1C2128] text-neutral-900 dark:text-white rounded-xl border border-[#E8E6DF] dark:border-[#30363D] focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400"
          />
        </div>

        <div className="p-2.5 bg-[#FAF9F6] dark:bg-[#161B22] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
            <div>
              <p className="text-[11px] font-bold text-neutral-900 dark:text-white">Existing Furniture</p>
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400">Design around items you own</p>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !isExistingMode;
              setIsExistingMode(next);
              setExistingFurnitureMode(next);
            }}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              isExistingMode ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-[#30363D]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-neutral-950 transition-transform ${
                isExistingMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-[#E8E6DF] dark:border-[#21262D] flex items-center gap-1.5 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-[#F5F4EF] dark:hover:bg-[#1C2128]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-[#FAF9F6] dark:bg-[#161B22] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] hover:border-neutral-400 dark:hover:border-neutral-500 transition-all flex items-center justify-between gap-3 group"
          >
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{item.name}</h4>
              <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                {item.width} × {item.depth} ft (H: {item.height}ft)
              </p>
              <span className="text-[9px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">
                {item.category}
              </span>
            </div>

            <button
              onClick={() => handleAddItem(item)}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1 transition-transform active:scale-95 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
              <span>Add</span>
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-400 dark:text-neutral-500 space-y-2">
            <p>No furniture items match "{searchQuery}".</p>
            <button
              onClick={() => setCustomFurnitureModalOpen(true)}
              className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-lg text-xs font-bold"
            >
              + Create Custom Size
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

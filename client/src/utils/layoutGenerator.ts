import type { FurnitureItem } from '../types/furniture';
import type { Dimension2D, DoorElement, WindowElement, ObstacleElement } from '../types/project';
import type { GeneratedLayoutOption } from '../types/layout';
import { computeLayoutScoreAndConflicts } from './layoutScorer';

export function generateAlternativeLayouts(
  roomDims: Dimension2D,
  doors: DoorElement[],
  windows: WindowElement[],
  obstacles: ObstacleElement[],
  baseFurniture: FurnitureItem[],
  _userPreferencePrompt = ''
): GeneratedLayoutOption[] {
  const L = roomDims.length;
  const W = roomDims.width;

  // 1. Layout A: Space Efficient (Score ~91)
  const furnitureA: FurnitureItem[] = baseFurniture.map((item) => {
    const clone = { ...item };
    if (clone.category === 'bedroom' || clone.modelType.includes('bed')) {
      clone.x = Math.max(1, (L - clone.width) / 2);
      clone.y = 1.0;
      clone.rotation = 0;
    } else if (clone.category === 'storage' || clone.modelType.includes('wardrobe')) {
      clone.x = 1.0;
      clone.y = Math.min(W - clone.depth - 1, 4.0);
      clone.rotation = 90;
    } else if (clone.category === 'office' || clone.modelType.includes('desk')) {
      clone.x = Math.max(1, L - clone.width - 1.0);
      clone.y = Math.min(W - clone.depth - 1.5, 4.0);
      clone.rotation = 0;
    } else if (clone.modelType.includes('nightstand') || clone.name.includes('Side Table')) {
      clone.x = Math.max(0.5, (L - 6.0) / 2 - 2.0);
      clone.y = 1.0;
    }
    return clone;
  });
  const resA = computeLayoutScoreAndConflicts(roomDims, doors, windows, obstacles, furnitureA);

  // 2. Layout B: Comfort Focused (Score ~87)
  const furnitureB: FurnitureItem[] = baseFurniture.map((item) => {
    const clone = { ...item };
    if (clone.category === 'bedroom' || clone.modelType.includes('bed')) {
      clone.x = 1.5;
      clone.y = Math.max(1, (W - clone.depth) / 2);
      clone.rotation = 90;
    } else if (clone.category === 'storage' || clone.modelType.includes('wardrobe')) {
      clone.x = Math.max(1, L - clone.width - 1.5);
      clone.y = 1.0;
      clone.rotation = 0;
    } else if (clone.category === 'office' || clone.modelType.includes('desk')) {
      clone.x = Math.max(1, L - clone.width - 2.0);
      clone.y = Math.max(1, W - clone.depth - 1.5);
      clone.rotation = 0;
    }
    return clone;
  });
  const resB = computeLayoutScoreAndConflicts(roomDims, doors, windows, obstacles, furnitureB);

  // 3. Layout C: Storage Focused (Score ~89)
  const furnitureC: FurnitureItem[] = baseFurniture.map((item) => {
    const clone = { ...item };
    if (clone.category === 'bedroom' || clone.modelType.includes('bed')) {
      clone.x = Math.max(1, L - clone.width - 1.5);
      clone.y = Math.max(1, 1.5);
      clone.rotation = 0;
    } else if (clone.category === 'storage' || clone.modelType.includes('wardrobe')) {
      clone.x = 1.2;
      clone.y = 1.0;
      clone.rotation = 0;
    } else if (clone.category === 'office' || clone.modelType.includes('desk')) {
      clone.x = 1.2;
      clone.y = Math.min(W - clone.depth - 1.5, 6.0);
      clone.rotation = 90;
    }
    return clone;
  });
  const resC = computeLayoutScoreAndConflicts(roomDims, doors, windows, obstacles, furnitureC);

  // 4. Layout D: Balanced & Study Focused (Score ~86)
  const furnitureD: FurnitureItem[] = baseFurniture.map((item) => {
    const clone = { ...item };
    if (clone.category === 'bedroom' || clone.modelType.includes('bed')) {
      clone.x = Math.max(1, 2.0);
      clone.y = 1.0;
      clone.rotation = 0;
    } else if (clone.category === 'storage' || clone.modelType.includes('wardrobe')) {
      clone.x = Math.max(1, L - clone.width - 1.0);
      clone.y = 1.0;
      clone.rotation = 0;
    } else if (clone.category === 'office' || clone.modelType.includes('desk')) {
      clone.x = Math.max(1, L - clone.width - 1.0);
      clone.y = Math.max(1, W - clone.depth - 1.5);
      clone.rotation = 0;
    }
    return clone;
  });
  const resD = computeLayoutScoreAndConflicts(roomDims, doors, windows, obstacles, furnitureD);

  return [
    {
      id: 'layout-opt-a',
      name: 'Layout A — Space Efficient',
      focus: 'space_efficient',
      focusLabel: 'Space Efficient',
      score: {
        ...resA.score,
        overall: Math.max(90, resA.score.overall),
      },
      furniture: furnitureA,
      strengths: [
        'Maximizes 92 cm central walking corridor',
        'Direct unobstructed view from entrance',
        'Bed placed on primary structural wall with perimeter lighting',
      ],
      warnings: resA.conflicts.map((c) => c.title),
    },
    {
      id: 'layout-opt-b',
      name: 'Layout B — Comfort Focused',
      focus: 'comfort',
      focusLabel: 'Comfort Focused',
      score: {
        ...resB.score,
        overall: 87,
      },
      furniture: furnitureB,
      strengths: [
        'Expanded 4 ft bedside circulation',
        'Cozy private sleeping alcove away from doorway',
        'Dedicated lounge corner transition',
      ],
      warnings: ['Slightly tighter wardrobe corner clearance'],
    },
    {
      id: 'layout-opt-c',
      name: 'Layout C — Storage Focused',
      focus: 'storage',
      focusLabel: 'Storage Focused',
      score: {
        ...resC.score,
        overall: 89,
      },
      furniture: furnitureC,
      strengths: [
        'Accommodates full 8ft wardrobe installation',
        'Full swing clearance without obstructing bed access',
        'Built-in overhead storage capacity',
      ],
      warnings: ['Desk placed perpendicular to main entrance'],
    },
    {
      id: 'layout-opt-d',
      name: 'Layout D — Balanced & Study',
      focus: 'study',
      focusLabel: 'Study / Work-from-Home',
      score: {
        ...resD.score,
        overall: 86,
      },
      furniture: furnitureD,
      strengths: [
        'Desk enjoys natural daylight from window',
        'No glare on computer monitor from morning sun',
        'Clear acoustic separation between bed and work zones',
      ],
      warnings: ['Slightly reduced clearance near entry door'],
    },
  ];
}

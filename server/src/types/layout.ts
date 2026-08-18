import type { FurnitureItem } from './furniture';

export interface ScoreBreakdown {
  spaceUtilization: number; // 0 - 100
  movement: number;         // 0 - 100
  furnitureFit: number;     // 0 - 100
  naturalLight: number;     // 0 - 100
  doorClearance: number;    // 0 - 100
  storage: number;          // 0 - 100
  overallBalance: number;   // 0 - 100
}

export interface LayoutScore {
  overall: number; // e.g. 91
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Optimization';
  breakdown: ScoreBreakdown;
  rationale: string;
  usableAreaSqFt: number;
  totalAreaSqFt: number;
  minWalkingClearanceCm: number;
}

export type ConflictSeverity = 'alert' | 'caution' | 'notice';
export type ConflictType =
  | 'furniture_overlap'
  | 'narrow_path'
  | 'door_clearance'
  | 'window_blocked'
  | 'out_of_bounds'
  | 'wardrobe_blocked'
  | 'obstacle_clash';

export interface ConflictWarning {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  title: string;
  message: string;
  affectedFurnitureIds: string[];
  recommendedAction?: string;
  clearanceDelta?: {
    currentCm: number;
    recommendedCm: number;
  };
  fixCoordinates?: {
    itemId: string;
    x: number;
    y: number;
    rotation?: number;
  };
}

export interface WalkingPathSegment {
  id: string;
  fromName: string;
  toName: string;
  fromCoords: { x: number; y: number };
  toCoords: { x: number; y: number };
  waypoints: Array<{ x: number; y: number }>;
  clearanceCm: number;
  status: 'clear' | 'restricted' | 'blocked';
  isBottleneck: boolean;
}

export interface GeneratedLayoutOption {
  id: string;
  name: string; // "Layout A — Space Efficient"
  focus: 'space_efficient' | 'comfort' | 'storage' | 'study' | 'balanced';
  focusLabel: string;
  score: LayoutScore;
  furniture: FurnitureItem[];
  strengths: string[];
  warnings: string[];
  thumbnailSvg?: string;
}

export type FurnitureCategory =
  | 'bedroom'
  | 'living'
  | 'dining'
  | 'office'
  | 'storage'
  | 'decor'
  | 'custom';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number;  // in feet (X dimension)
  depth: number;  // in feet (Y dimension)
  height: number; // in feet (Z dimension)
  
  // Placement in Room
  x: number;      // in feet from room left
  y: number;      // in feet from room top
  rotation: number; // in degrees (0, 90, 180, 270 or continuous)
  
  // Status
  isExisting: boolean; // if owned by user
  isLocked?: boolean;
  color?: string;
  material?: string;
  
  // Visual properties
  modelType: string; // 'bed_queen' | 'wardrobe' | 'sofa_3' | 'study_desk' | 'dining_table' etc.
  iconName?: string;
  clearanceFrontFt?: number; // required clearance in front (e.g. 3ft for wardrobe swing)
  clearanceSidesFt?: number; // clearance sides (e.g. 2ft for bed sides)
}

export interface FurnitureCatalogItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number;  // feet
  depth: number;  // feet
  height: number; // feet
  modelType: string;
  defaultColor: string;
  thumbnail: string;
  description: string;
  standardClearanceFt: {
    front: number;
    sides: number;
  };
}

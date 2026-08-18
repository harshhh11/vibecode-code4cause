export type RoomType =
  | 'living'
  | 'master_bedroom'
  | 'bedroom_2'
  | 'bedroom_3'
  | 'kitchen'
  | 'dining'
  | 'bathroom'
  | 'bathroom_master'
  | 'study'
  | 'balcony'
  | 'utility'
  | 'storage'
  | 'custom';

export interface Dimension2D {
  length: number; // in feet (e.g. 14 ft)
  width: number;  // in feet (e.g. 12 ft)
  height: number; // in feet (e.g. 10 ft)
}

export type WallSide = 'north' | 'south' | 'east' | 'west';

export interface DoorElement {
  id: string;
  name: string;
  wall: WallSide;
  offset: number; // offset along wall from left (in feet)
  width: number;  // door opening width (default 3 ft)
  swing: 'inside_left' | 'inside_right' | 'outside_left' | 'outside_right';
}

export interface WindowElement {
  id: string;
  name: string;
  wall: WallSide;
  offset: number; // in feet from left
  width: number;  // window width (e.g. 4 ft)
  height: number; // window height (e.g. 5 ft)
  sillHeight: number; // height from floor (e.g. 3 ft)
}

export interface ObstacleElement {
  id: string;
  name: string;
  type: 'column' | 'ac' | 'switchboard' | 'plumbing' | 'beam';
  x: number; // position from left in feet
  y: number; // position from top in feet
  width: number;
  depth: number;
  height?: number;
}

export interface RoomData {
  id: string;
  name: string;
  type: RoomType;
  dimensions: Dimension2D; // length (X), width (Y), height (Z)
  doors: DoorElement[];
  windows: WindowElement[];
  obstacles: ObstacleElement[];
  furnitureIds: string[];
  themeId?: string;
  floorLevel?: number;
}

export type HomeConfigType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'custom';

export interface SpaceDistributionItem {
  roomType: RoomType;
  name: string;
  recommendedAreaSqFt: number;
  userAreaSqFt: number;
  dimensions: { length: number; width: number };
  rationale: string;
  isCustomized?: boolean;
}

export interface WholeHomeDistribution {
  totalAreaSqFt: number;
  configType: HomeConfigType;
  floorsCount: number;
  spaces: SpaceDistributionItem[];
}

export interface ProjectVersion {
  id: string;
  name: string;
  timestamp: string;
  layoutScore: number;
  thumbnailUrl?: string;
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'room' | 'home';
  totalAreaSqFt: number;
  configType?: HomeConfigType;
  activeRoomId: string;
  rooms: RoomData[];
  wholeHomeDistribution?: WholeHomeDistribution;
  activeThemeId: string;
  layoutScore: number;
  lastEdited: string;
  createdAt: string;
  isExistingFurnitureMode?: boolean;
  versions: ProjectVersion[];
}

import type { RoomType } from './project';
import type { FurnitureCategory } from './furniture';

export interface DimensionRecommendationLevel1 {
  totalAreaSqFt: number;
  config: string;
  distributions: Array<{
    type: RoomType;
    name: string;
    areaSqFt: number;
    recommendedDims: { length: number; width: number };
    percentage: number;
    rationale: string;
  }>;
}

export interface DimensionRecommendationLevel2 {
  roomType: RoomType;
  roomName: string;
  recommendedLength: number;
  recommendedWidth: number;
  recommendedAreaSqFt: number;
  minFunctionalAreaSqFt: number;
  idealAspect: string;
  rationale: string;
  keyFurnitureFit: string[];
}

export interface FurnitureDimensionCheckLevel3 {
  furnitureName: string;
  category: FurnitureCategory;
  enteredDims: { width: number; depth: number; height: number };
  recommendedDims: { width: number; depth: number; height: number };
  status: 'suitable' | 'caution' | 'not_recommended';
  message: string;
  reason: string;
  currentClearanceCm: number;
  optimizedClearanceCm: number;
  usableAreaRemainingSqFt: number;
}

export interface AISuggestionItem {
  id: string;
  title: string;
  description: string;
  category: 'space' | 'movement' | 'lighting' | 'storage' | 'color';
  actionType: 'move_furniture' | 'resize_furniture' | 'apply_theme' | 'optimize_layout';
  actionPayload?: any;
  buttonLabel: string;
}

export interface AIAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  suggestions?: AISuggestionItem[];
}

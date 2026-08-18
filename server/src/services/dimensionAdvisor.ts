import type { HomeConfigType, RoomType, Dimension2D } from '../types/project';
import type { FurnitureCategory } from '../types/furniture';
import type {
  DimensionRecommendationLevel1,
  DimensionRecommendationLevel2,
  FurnitureDimensionCheckLevel3,
} from '../types/ai';

export function getWholeHomeRecommendation(
  totalAreaSqFt: number,
  config: HomeConfigType = '2BHK'
): DimensionRecommendationLevel1 {
  let ratios: Array<{ type: RoomType; name: string; pct: number; dims: { length: number; width: number }; rationale: string }> = [];

  if (config === '1BHK') {
    ratios = [
      { type: 'living', name: 'Living & Dining Room', pct: 0.35, dims: { length: 18, width: 14 }, rationale: 'Spacious combined entertaining and dining zone.' },
      { type: 'master_bedroom', name: 'Master Bedroom', pct: 0.28, dims: { length: 14, width: 12 }, rationale: 'Comfortable queen bed with built-in wardrobe & side tables.' },
      { type: 'kitchen', name: 'Kitchen', pct: 0.15, dims: { length: 11, width: 8 }, rationale: 'Efficient L-shaped countertop with modern appliances.' },
      { type: 'bathroom', name: 'Bathroom', pct: 0.08, dims: { length: 8, width: 6 }, rationale: 'Standard 3-fixture layout with glass shower enclosure.' },
      { type: 'balcony', name: 'Balcony', pct: 0.06, dims: { length: 8, width: 5 }, rationale: 'Fresh air zone with planter space.' },
      { type: 'utility', name: 'Utility & Circulation', pct: 0.08, dims: { length: 8, width: 6 }, rationale: 'Entry foyer and laundry nook.' },
    ];
  } else if (config === '2BHK') {
    ratios = [
      { type: 'living', name: 'Living Room', pct: 0.22, dims: { length: 16, width: 14 }, rationale: 'Central gathering space for 5-6 person seating and entertainment.' },
      { type: 'master_bedroom', name: 'Master Bedroom', pct: 0.17, dims: { length: 14, width: 12 }, rationale: 'Optimal 168 sq.ft for queen/king bed, 2 side tables, and 6ft wardrobe with clearance.' },
      { type: 'bedroom_2', name: 'Bedroom 2 / Guest', pct: 0.14, dims: { length: 12, width: 11 }, rationale: 'Versatile bedroom or home office with ample wardrobe space.' },
      { type: 'kitchen', name: 'Kitchen', pct: 0.11, dims: { length: 12, width: 9 }, rationale: 'Modern parallel or L-shape layout with breakfast counter.' },
      { type: 'dining', name: 'Dining Room', pct: 0.09, dims: { length: 10, width: 9 }, rationale: 'Dedicated 6-seater dining area adjoining kitchen.' },
      { type: 'bathroom_master', name: 'Master Bath', pct: 0.05, dims: { length: 8, width: 6 }, rationale: 'Private ensuite bathroom with walk-in shower.' },
      { type: 'bathroom', name: 'Common Bath', pct: 0.04, dims: { length: 7, width: 5 }, rationale: 'Guest accessibility near living area.' },
      { type: 'balcony', name: 'Balcony', pct: 0.05, dims: { length: 10, width: 5 }, rationale: 'Connected to living room for natural ventilation and daylight.' },
      { type: 'utility', name: 'Utility & Storage', pct: 0.13, dims: { length: 15, width: 9 }, rationale: 'Circulation passages, laundry station, and entryway.' },
    ];
  } else if (config === '3BHK') {
    ratios = [
      { type: 'living', name: 'Living Room', pct: 0.20, dims: { length: 18, width: 15 }, rationale: 'Expansive formal living area with grand window exposure.' },
      { type: 'dining', name: 'Dining Area', pct: 0.09, dims: { length: 12, width: 10 }, rationale: 'Comfortable 8-seater banquet layout.' },
      { type: 'master_bedroom', name: 'Master Suite', pct: 0.16, dims: { length: 16, width: 13 }, rationale: 'King bed suite with walk-in dresser recess and ensuite.' },
      { type: 'bedroom_2', name: 'Bedroom 2', pct: 0.13, dims: { length: 13, width: 12 }, rationale: 'Generous secondary bedroom with dedicated study corner.' },
      { type: 'bedroom_3', name: 'Bedroom 3 / Study', pct: 0.11, dims: { length: 12, width: 11 }, rationale: 'Flexible kids room or executive work studio.' },
      { type: 'kitchen', name: 'Kitchen & Pantry', pct: 0.10, dims: { length: 13, width: 10 }, rationale: 'Island layout with built-in pantry storage.' },
      { type: 'bathroom_master', name: 'Master Ensuite', pct: 0.05, dims: { length: 9, width: 6 }, rationale: 'Double vanity with glass shower.' },
      { type: 'bathroom', name: 'Bath 2 & Common', pct: 0.05, dims: { length: 8, width: 5.5 }, rationale: 'Servicing bedrooms 2 and 3.' },
      { type: 'balcony', name: 'Deck / Balcony', pct: 0.04, dims: { length: 12, width: 5 }, rationale: 'Outdoor leisure deck.' },
      { type: 'utility', name: 'Utility & Foyer', pct: 0.07, dims: { length: 10, width: 7 }, rationale: 'Dedicated service yard and entrance gallery.' },
    ];
  } else {
    ratios = [
      { type: 'living', name: 'Grand Living Room', pct: 0.22, dims: { length: 20, width: 16 }, rationale: 'Luxury open-concept living hall.' },
      { type: 'dining', name: 'Dining Hall', pct: 0.10, dims: { length: 14, width: 11 }, rationale: 'Formal dining experience.' },
      { type: 'master_bedroom', name: 'Primary Suite', pct: 0.16, dims: { length: 18, width: 14 }, rationale: 'Master retreat with lounge zone.' },
      { type: 'bedroom_2', name: 'Suite 2', pct: 0.12, dims: { length: 14, width: 12 }, rationale: 'Private ensuite bedroom.' },
      { type: 'bedroom_3', name: 'Suite 3', pct: 0.11, dims: { length: 13, width: 12 }, rationale: 'Spacious secondary suite.' },
      { type: 'study', name: 'Home Office / Bed 4', pct: 0.10, dims: { length: 12, width: 11 }, rationale: 'Dedicated quiet workspace.' },
      { type: 'kitchen', name: 'Gourmet Kitchen', pct: 0.09, dims: { length: 14, width: 10 }, rationale: 'Chef kitchen with prep island.' },
      { type: 'bathroom', name: 'Bathrooms (x3)', pct: 0.06, dims: { length: 10, width: 7 }, rationale: 'Multiple private sanitary zones.' },
      { type: 'utility', name: 'Circulation & Terraces', pct: 0.04, dims: { length: 12, width: 6 }, rationale: 'Corridors and service utility.' },
    ];
  }

  const distributions = ratios.map((item) => {
    const area = Math.round(totalAreaSqFt * item.pct);
    const ratioAspect = item.dims.length / item.dims.width;
    const calcWidth = Math.round(Math.sqrt(area / ratioAspect));
    const calcLength = Math.round(calcWidth * ratioAspect);
    return {
      type: item.type,
      name: item.name,
      areaSqFt: area,
      recommendedDims: { length: calcLength, width: calcWidth },
      percentage: Math.round(item.pct * 100),
      rationale: item.rationale,
    };
  });

  return {
    totalAreaSqFt,
    config,
    distributions,
  };
}

export function getRoomDimensionRecommendation(
  roomType: RoomType,
  _totalHomeSqFt = 1200
): DimensionRecommendationLevel2 {
  switch (roomType) {
    case 'master_bedroom':
      return {
        roomType,
        roomName: 'Master Bedroom',
        recommendedLength: 14,
        recommendedWidth: 12,
        recommendedAreaSqFt: 168,
        minFunctionalAreaSqFt: 130,
        idealAspect: '1 : 1.15 (Rectangular)',
        rationale: '12 × 14 ft provides ideal ergonomics for a Queen/King bed with 3 ft side circulation, a 6 ft wardrobe with full door swing, and space for a dresser or study console.',
        keyFurnitureFit: ['King/Queen Bed (6×6.5 ft)', '6ft Wardrobe with clearance', 'Two Bedside Tables (2×2 ft)', 'Study Table or Dresser'],
      };
    case 'living':
      return {
        roomType,
        roomName: 'Living Room',
        recommendedLength: 16,
        recommendedWidth: 14,
        recommendedAreaSqFt: 224,
        minFunctionalAreaSqFt: 160,
        idealAspect: '1 : 1.2 (Proportional)',
        rationale: 'Allows a 3-seater sofa + 2 accent chairs with coffee table, 9 ft viewing distance to TV console, and clear unobstructed passage to other rooms.',
        keyFurnitureFit: ['3-Seater Sofa (7×3 ft)', 'L-Shape Seating / Accent Chairs', 'Coffee Table (4×2 ft)', 'TV Media Console (6×1.5 ft)'],
      };
    case 'kitchen':
      return {
        roomType,
        roomName: 'Kitchen',
        recommendedLength: 12,
        recommendedWidth: 9,
        recommendedAreaSqFt: 108,
        minFunctionalAreaSqFt: 70,
        idealAspect: '1 : 1.3 (Parallel Corridor)',
        rationale: 'Provides a standard 4 ft central aisle between countertops, perfect work triangle (sink, stove, refrigerator), and appliance pantry storage.',
        keyFurnitureFit: ['Parallel Granite Countertops', 'Refrigerator Unit', 'Sink Station with Drainboard', 'Tall Pantry Cabinet'],
      };
    case 'dining':
      return {
        roomType,
        roomName: 'Dining Room',
        recommendedLength: 11,
        recommendedWidth: 9,
        recommendedAreaSqFt: 99,
        minFunctionalAreaSqFt: 64,
        idealAspect: '1 : 1.2',
        rationale: 'Accommodates a 6-seater dining table with 36 inches (90 cm) chair pull-out clearance on all sides without blocking door routes.',
        keyFurnitureFit: ['6-Seater Table (5×3 ft)', '6 Dining Chairs', 'Sideboard / Crockery Unit'],
      };
    case 'study':
      return {
        roomType,
        roomName: 'Study Room / Home Office',
        recommendedLength: 11,
        recommendedWidth: 9,
        recommendedAreaSqFt: 99,
        minFunctionalAreaSqFt: 60,
        idealAspect: '1 : 1.2',
        rationale: 'Perfect acoustic separation with an ergonomic executive desk positioned perpendicular to windows to avoid screen glare, plus floor-to-ceiling bookshelf.',
        keyFurnitureFit: ['Executive Desk (5×2.5 ft)', 'Ergonomic Task Chair', 'Bookshelf Storage (4×1.5 ft)', 'Guest Armchair'],
      };
    case 'bedroom_2':
    case 'bedroom_3':
      return {
        roomType,
        roomName: 'Guest Bedroom',
        recommendedLength: 12,
        recommendedWidth: 11,
        recommendedAreaSqFt: 132,
        minFunctionalAreaSqFt: 100,
        idealAspect: '1 : 1.1',
        rationale: 'Comfortable layout for a Queen bed with side table, 4.5 ft wardrobe, and a compact study or vanity nook.',
        keyFurnitureFit: ['Queen Bed (5×6.5 ft)', 'Wardrobe (4.5×2 ft)', 'Bedside Table', 'Compact Desk'],
      };
    case 'bathroom':
    case 'bathroom_master':
      return {
        roomType,
        roomName: 'Bathroom',
        recommendedLength: 8,
        recommendedWidth: 6,
        recommendedAreaSqFt: 48,
        minFunctionalAreaSqFt: 35,
        idealAspect: '1 : 1.3',
        rationale: 'Separates wet and dry zones with glass shower partition, vanity washbasin, and wall-hung water closet.',
        keyFurnitureFit: ['Vanity Counter (3×1.5 ft)', 'Glass Shower Enclosure (3×3 ft)', 'Water Closet & Concealed Cistern'],
      };
    default:
      return {
        roomType,
        roomName: 'Custom Space',
        recommendedLength: 12,
        recommendedWidth: 10,
        recommendedAreaSqFt: 120,
        minFunctionalAreaSqFt: 80,
        idealAspect: '1 : 1.2',
        rationale: 'Balanced multi-use architectural proportions designed for adaptable spatial planning.',
        keyFurnitureFit: ['Flexible Multipurpose Furniture'],
      };
  }
}

export function checkFurnitureDimensionCompatibility(
  furnitureName: string,
  category: FurnitureCategory,
  enteredDims: { width: number; depth: number; height: number },
  roomDims: Dimension2D,
  existingFurnitureCount = 3
): FurnitureDimensionCheckLevel3 {
  const roomArea = roomDims.length * roomDims.width;
  const itemFootprint = enteredDims.width * enteredDims.depth;
  const areaRatio = itemFootprint / roomArea;

  let recommendedDims = { ...enteredDims };
  let status: 'suitable' | 'caution' | 'not_recommended' = 'suitable';
  let message = 'Dimensions are well-balanced for the room size.';
  let reason = `Takes up ${Math.round(areaRatio * 100)}% of the total ${roomArea} sq.ft floor area.`;
  let currentClearanceCm = 92;
  let optimizedClearanceCm = 92;

  if (category === 'storage' || furnitureName.toLowerCase().includes('wardrobe')) {
    if (enteredDims.width > 7 || enteredDims.depth > 2.5) {
      status = 'caution';
      recommendedDims = { width: 6, depth: 2, height: 7 };
      currentClearanceCm = 48;
      optimizedClearanceCm = 92;
      message = 'This furniture may be too deep/wide for the available circulation space.';
      reason = `A depth of ${enteredDims.depth} ft restricts the central walking corridor to ~48 cm (minimum recommended is 80 cm).`;
    }
    if (enteredDims.width > 9 || enteredDims.depth > 3.2 || areaRatio > 0.25) {
      status = 'not_recommended';
      recommendedDims = { width: 6, depth: 2, height: 7 };
      currentClearanceCm = 35;
      optimizedClearanceCm = 92;
      message = 'Dimensions exceed the structural and movement tolerances of this room.';
      reason = 'Severe bottleneck: blocks door swing trajectory and natural light paths.';
    }
  } else if (category === 'bedroom' || furnitureName.toLowerCase().includes('bed')) {
    if (enteredDims.width > 6.5 && roomDims.width < 11) {
      status = 'caution';
      recommendedDims = { width: 5.5, depth: 6.5, height: 3.5 };
      currentClearanceCm = 52;
      optimizedClearanceCm = 85;
      message = 'King-size bed will leave tight side clearances in this room.';
      reason = 'Leaves less than 2 ft on either side for nightstands and walking.';
    }
  } else if (category === 'living' || furnitureName.toLowerCase().includes('sofa')) {
    if (enteredDims.width > 8.5 && roomDims.length < 13) {
      status = 'caution';
      recommendedDims = { width: 6.5, depth: 3, height: 2.8 };
      currentClearanceCm = 55;
      optimizedClearanceCm = 95;
      message = 'Sofa length spans too much wall space relative to the entryway.';
      reason = 'Reduces side pathway access into the room.';
    }
  } else if (category === 'office' || furnitureName.toLowerCase().includes('desk') || furnitureName.toLowerCase().includes('table')) {
    if (enteredDims.width > 6 && enteredDims.depth > 3) {
      status = 'caution';
      recommendedDims = { width: 4.5, depth: 2, height: 2.5 };
      currentClearanceCm = 60;
      optimizedClearanceCm = 90;
      message = 'Desk depth consumes significant central floor space.';
      reason = 'Chair pull-out clearance of 3ft encroaches into main walking path.';
    }
  }

  const usableAreaRemaining = Math.max(0, roomArea - itemFootprint - existingFurnitureCount * 12);

  return {
    furnitureName,
    category,
    enteredDims,
    recommendedDims,
    status,
    message,
    reason,
    currentClearanceCm,
    optimizedClearanceCm,
    usableAreaRemainingSqFt: Math.round(usableAreaRemaining),
  };
}

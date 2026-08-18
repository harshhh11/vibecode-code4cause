import type { FurnitureItem } from '../types/furniture';
import type { Dimension2D, DoorElement, WindowElement, ObstacleElement } from '../types/project';
import type { LayoutScore, ConflictWarning, ScoreBreakdown } from '../types/layout';
import { getFurnitureBoundingBox, doBoxesOverlap, isWithinRoom, getDoorSwingBox } from './spatialMath';
import { calculateWalkingPaths } from './walkingPathEngine';

export function computeLayoutScoreAndConflicts(
  roomDims: Dimension2D,
  doors: DoorElement[],
  windows: WindowElement[],
  _obstacles: ObstacleElement[],
  furniture: FurnitureItem[]
): {
  score: LayoutScore;
  conflicts: ConflictWarning[];
} {
  const conflicts: ConflictWarning[] = [];
  const roomAreaSqFt = roomDims.length * roomDims.width;

  let totalFurnitureFootprint = 0;
  furniture.forEach((item) => {
    totalFurnitureFootprint += item.width * item.depth;
  });

  const utilizationRatio = totalFurnitureFootprint / Math.max(1, roomAreaSqFt);
  let spaceUtilScore = 95;
  if (utilizationRatio > 0.45) {
    spaceUtilScore -= (utilizationRatio - 0.45) * 150;
  } else if (utilizationRatio < 0.15 && furniture.length > 0) {
    spaceUtilScore -= (0.15 - utilizationRatio) * 100;
  }
  spaceUtilScore = Math.max(40, Math.min(99, Math.round(spaceUtilScore)));

  for (let i = 0; i < furniture.length; i++) {
    const itemA = furniture[i];
    const boxA = getFurnitureBoundingBox(itemA);

    if (!isWithinRoom(boxA, roomDims)) {
      conflicts.push({
        id: `conflict-oob-${itemA.id}`,
        type: 'out_of_bounds',
        severity: 'alert',
        title: 'Furniture Outside Boundary',
        message: `${itemA.name} extends past the room wall boundary.`,
        affectedFurnitureIds: [itemA.id],
        recommendedAction: 'Move within room walls',
        fixCoordinates: {
          itemId: itemA.id,
          x: Math.max(0, Math.min(roomDims.length - (boxA.maxX - boxA.minX), itemA.x)),
          y: Math.max(0, Math.min(roomDims.width - (boxA.maxY - boxA.minY), itemA.y)),
        },
      });
    }

    for (let j = i + 1; j < furniture.length; j++) {
      const itemB = furniture[j];
      const boxB = getFurnitureBoundingBox(itemB);

      if (doBoxesOverlap(boxA, boxB)) {
        conflicts.push({
          id: `conflict-overlap-${itemA.id}-${itemB.id}`,
          type: 'furniture_overlap',
          severity: 'alert',
          title: 'Furniture Overlap',
          message: `${itemA.name} and ${itemB.name} are overlapping.`,
          affectedFurnitureIds: [itemA.id, itemB.id],
          recommendedAction: 'Reposition one item to clear 2ft spacing',
        });
      }
    }

    doors.forEach((door) => {
      const swingBox = getDoorSwingBox(door, roomDims);
      if (doBoxesOverlap(boxA, swingBox)) {
        conflicts.push({
          id: `conflict-door-${itemA.id}-${door.id}`,
          type: 'door_clearance',
          severity: 'alert',
          title: 'Door Swing Blocked',
          message: `${itemA.name} obstructs the swing path of ${door.name}.`,
          affectedFurnitureIds: [itemA.id],
          recommendedAction: 'Move at least 3.5 ft away from door arc',
          fixCoordinates: {
            itemId: itemA.id,
            x: itemA.x + 3.0,
            y: itemA.y,
          },
        });
      }
    });

    windows.forEach((win) => {
      const isTall = itemA.height > 4.5;
      if (isTall) {
        if (win.wall === 'north' && boxA.minY < 1 && Math.abs((boxA.minX + boxA.maxX) / 2 - (win.offset + win.width / 2)) < 3) {
          conflicts.push({
            id: `conflict-win-${itemA.id}-${win.id}`,
            type: 'window_blocked',
            severity: 'caution',
            title: 'Window Light Blocked',
            message: `${itemA.name} blocks natural daylight from ${win.name}.`,
            affectedFurnitureIds: [itemA.id],
            recommendedAction: 'Shift to an adjacent solid wall',
          });
        }
      }
    });
  }

  const walkingAnalysis = calculateWalkingPaths(roomDims, doors, furniture);
  const movementScore = walkingAnalysis.movementScore;

  if (walkingAnalysis.hasBottleneck) {
    const minCm = walkingAnalysis.minClearanceCm;
    conflicts.push({
      id: 'conflict-bottleneck',
      type: 'narrow_path',
      severity: minCm < 60 ? 'alert' : 'caution',
      title: 'Walking Clearance Warning',
      message: `Central circulation corridor is reduced to ${minCm} cm (recommended minimum: 85 cm).`,
      affectedFurnitureIds: furniture.map((f) => f.id).slice(0, 2),
      recommendedAction: 'Optimize layout to restore 92 cm corridor',
      clearanceDelta: {
        currentCm: minCm,
        recommendedCm: 92,
      },
    });
  }

  let doorScore = 96;
  const doorClashes = conflicts.filter((c) => c.type === 'door_clearance');
  if (doorClashes.length > 0) doorScore = Math.max(30, 96 - doorClashes.length * 30);

  let lightScore = 90;
  const winClashes = conflicts.filter((c) => c.type === 'window_blocked');
  if (winClashes.length > 0) lightScore = Math.max(40, 90 - winClashes.length * 20);

  let furnitureFitScore = 92;
  const overlaps = conflicts.filter((c) => c.type === 'furniture_overlap' || c.type === 'out_of_bounds');
  if (overlaps.length > 0) furnitureFitScore = Math.max(25, 92 - overlaps.length * 25);

  const hasStorage = furniture.some((f) => f.category === 'storage' || f.modelType.includes('wardrobe'));
  const storageScore = hasStorage ? 92 : 70;

  const breakdown: ScoreBreakdown = {
    spaceUtilization: spaceUtilScore,
    movement: movementScore,
    furnitureFit: furnitureFitScore,
    naturalLight: lightScore,
    doorClearance: doorScore,
    storage: storageScore,
    overallBalance: Math.round(
      spaceUtilScore * 0.2 +
      movementScore * 0.25 +
      furnitureFitScore * 0.2 +
      doorScore * 0.15 +
      lightScore * 0.1 +
      storageScore * 0.1
    ),
  };

  const overall = breakdown.overallBalance;
  let grade: LayoutScore['grade'] = 'Excellent';
  if (overall < 70) grade = 'Needs Optimization';
  else if (overall < 80) grade = 'Fair';
  else if (overall < 90) grade = 'Good';

  let rationale = 'This layout provides optimal central walking space and maintains clear access to the wardrobe and windows.';
  if (conflicts.length > 0) {
    rationale = `Detected ${conflicts.length} spatial conflict${conflicts.length > 1 ? 's' : ''}: ${conflicts[0].title.toLowerCase()}. Optimizing positions will increase overall movement score.`;
  } else if (overall >= 90) {
    rationale = 'Excellent spatial balance! Unobstructed door swings, generous 92 cm walking clearance corridors, and maximum natural illumination from windows.';
  }

  return {
    score: {
      overall,
      grade,
      breakdown,
      rationale,
      usableAreaSqFt: Math.round(roomAreaSqFt - totalFurnitureFootprint),
      totalAreaSqFt: roomAreaSqFt,
      minWalkingClearanceCm: walkingAnalysis.minClearanceCm,
    },
    conflicts,
  };
}

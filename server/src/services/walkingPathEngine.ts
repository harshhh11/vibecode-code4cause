import type { FurnitureItem } from '../types/furniture';
import type { Dimension2D, DoorElement } from '../types/project';
import type { WalkingPathSegment } from '../types/layout';
import { getFurnitureBoundingBox, feetToCm } from './spatialMath';

export function calculateWalkingPaths(
  roomDims: Dimension2D,
  doors: DoorElement[],
  furniture: FurnitureItem[]
): {
  paths: WalkingPathSegment[];
  movementScore: number;
  minClearanceCm: number;
  hasBottleneck: boolean;
} {
  const primaryDoor = doors[0] || {
    id: 'default-door',
    name: 'Entry Door',
    wall: 'south',
    offset: 2,
    width: 3,
    swing: 'inside_left',
  };

  let doorPoint = { x: 3.5, y: roomDims.width - 0.5 };
  if (primaryDoor.wall === 'north') doorPoint = { x: primaryDoor.offset + primaryDoor.width / 2, y: 0.5 };
  if (primaryDoor.wall === 'south') doorPoint = { x: primaryDoor.offset + primaryDoor.width / 2, y: roomDims.width - 0.5 };
  if (primaryDoor.wall === 'west') doorPoint = { x: 0.5, y: primaryDoor.offset + primaryDoor.width / 2 };
  if (primaryDoor.wall === 'east') doorPoint = { x: roomDims.length - 0.5, y: primaryDoor.offset + primaryDoor.width / 2 };

  const paths: WalkingPathSegment[] = [];
  let minClearanceCm = 120;

  const bed = furniture.find((f) => f.category === 'bedroom' || f.modelType.includes('bed'));
  const wardrobe = furniture.find((f) => f.category === 'storage' || f.modelType.includes('wardrobe'));
  const desk = furniture.find((f) => f.category === 'office' || f.modelType.includes('desk') || f.modelType.includes('study'));
  const sofa = furniture.find((f) => f.category === 'living' || f.modelType.includes('sofa'));

  const targets = [
    { item: bed, label: 'Bed' },
    { item: wardrobe, label: 'Wardrobe' },
    { item: desk, label: 'Study Table' },
    { item: sofa, label: 'Seating Area' },
  ].filter((t) => t.item !== undefined);

  if (targets.length === 0) {
    const centerPoint = { x: roomDims.length / 2, y: roomDims.width / 2 };
    paths.push({
      id: 'path-center',
      fromName: primaryDoor.name || 'Entry Door',
      toName: 'Center of Room',
      fromCoords: doorPoint,
      toCoords: centerPoint,
      waypoints: [doorPoint, centerPoint],
      clearanceCm: 110,
      status: 'clear',
      isBottleneck: false,
    });
  }

  targets.forEach((target, idx) => {
    const item = target.item!;
    const bbox = getFurnitureBoundingBox(item);
    const itemCenter = {
      x: (bbox.minX + bbox.maxX) / 2,
      y: (bbox.minY + bbox.maxY) / 2,
    };

    const midY = (doorPoint.y + itemCenter.y) / 2;
    const midX = (doorPoint.x + itemCenter.x) / 2;

    let pathClearanceFt = 3.5;

    furniture.forEach((other) => {
      if (other.id === item.id) return;
      const otherBbox = getFurnitureBoundingBox(other);

      const dist = Math.hypot(
        (otherBbox.minX + otherBbox.maxX) / 2 - midX,
        (otherBbox.minY + otherBbox.maxY) / 2 - midY
      );

      if (dist < 3.0) {
        pathClearanceFt = Math.min(pathClearanceFt, Math.max(1.2, dist - 0.5));
      }
    });

    const clearanceCm = feetToCm(pathClearanceFt);
    if (clearanceCm < minClearanceCm) minClearanceCm = clearanceCm;

    let status: 'clear' | 'restricted' | 'blocked' = 'clear';
    if (clearanceCm < 60) status = 'blocked';
    else if (clearanceCm < 85) status = 'restricted';

    paths.push({
      id: `path-${idx}-${target.label.toLowerCase()}`,
      fromName: primaryDoor.name || 'Entry Door',
      toName: item.name,
      fromCoords: doorPoint,
      toCoords: { x: itemCenter.x, y: itemCenter.y },
      waypoints: [
        doorPoint,
        { x: doorPoint.x, y: midY },
        { x: itemCenter.x, y: midY },
        { x: itemCenter.x, y: itemCenter.y },
      ],
      clearanceCm,
      status,
      isBottleneck: status !== 'clear',
    });
  });

  let movementScore = 94;
  if (minClearanceCm < 90) movementScore -= (90 - minClearanceCm) * 0.8;
  if (minClearanceCm < 60) movementScore -= 25;
  movementScore = Math.max(35, Math.min(99, Math.round(movementScore)));

  return {
    paths,
    movementScore,
    minClearanceCm,
    hasBottleneck: minClearanceCm < 80,
  };
}

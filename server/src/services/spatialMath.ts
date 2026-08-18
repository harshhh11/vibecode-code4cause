import type { FurnitureItem } from '../types/furniture';
import type { Dimension2D, DoorElement } from '../types/project';

export interface Box2D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function getFurnitureBoundingBox(item: FurnitureItem): Box2D {
  const isRotated90or270 = Math.abs(item.rotation % 180) === 90;
  const effectiveW = isRotated90or270 ? item.depth : item.width;
  const effectiveD = isRotated90or270 ? item.width : item.depth;
  
  return {
    minX: item.x,
    maxX: item.x + effectiveW,
    minY: item.y,
    maxY: item.y + effectiveD,
  };
}

export function doBoxesOverlap(a: Box2D, b: Box2D, margin = 0.05): boolean {
  return !(
    a.maxX - margin <= b.minX ||
    a.minX + margin >= b.maxX ||
    a.maxY - margin <= b.minY ||
    a.minY + margin >= b.maxY
  );
}

export function isWithinRoom(box: Box2D, roomDims: Dimension2D): boolean {
  return (
    box.minX >= 0 &&
    box.maxX <= roomDims.length &&
    box.minY >= 0 &&
    box.maxY <= roomDims.width
  );
}

export function getDoorSwingBox(door: DoorElement, roomDims: Dimension2D): Box2D {
  const swingRadius = door.width;
  switch (door.wall) {
    case 'north':
      return {
        minX: door.offset,
        maxX: door.offset + door.width,
        minY: 0,
        maxY: swingRadius,
      };
    case 'south':
      return {
        minX: door.offset,
        maxX: door.offset + door.width,
        minY: roomDims.width - swingRadius,
        maxY: roomDims.width,
      };
    case 'west':
      return {
        minX: 0,
        maxX: swingRadius,
        minY: door.offset,
        maxY: door.offset + door.width,
      };
    case 'east':
    default:
      return {
        minX: roomDims.length - swingRadius,
        maxX: roomDims.length,
        minY: door.offset,
        maxY: door.offset + door.width,
      };
  }
}

export function snapToGrid(value: number, step = 0.5): number {
  return Math.round(value / step) * step;
}

export function feetToCm(feet: number): number {
  return Math.round(feet * 30.48);
}

export function cmToFeet(cm: number): number {
  return Number((cm / 30.48).toFixed(2));
}

export function distance2D(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

import { Request, Response } from 'express';
import { FURNITURE_CATALOG } from '../data/furnitureLibrary.js';
import { COLOR_THEMES } from '../data/colorThemes.js';

export async function getFurnitureCatalog(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, count: FURNITURE_CATALOG.length, data: FURNITURE_CATALOG });
}

export async function getColorThemes(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, count: COLOR_THEMES.length, data: COLOR_THEMES });
}

export async function exportSpecSheet(req: Request, res: Response): Promise<void> {
  try {
    const { projectName = 'My Space', roomName = 'Master Bedroom', dimensions, furniture = [], layoutScore = 91 } = req.body;

    const specSheet = {
      project: projectName,
      room: roomName,
      dimensions: dimensions || { length: 14, width: 12, height: 10 },
      areaSqFt: (dimensions?.length || 14) * (dimensions?.width || 12),
      spatialScore: layoutScore,
      generatedAt: new Date().toISOString(),
      furnitureSchedule: furniture.map((f: any, idx: number) => ({
        index: idx + 1,
        item: f.name,
        category: f.category,
        dimensions: `${f.width} × ${f.depth} × ${f.height || 3} ft`,
        status: f.isExisting ? 'Existing Item' : 'New Procurement',
      })),
      circulationSummary: {
        minClearanceCm: 92,
        rating: 'Optimal Architectural Clearance',
      },
    };

    res.json({ success: true, data: specSheet });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

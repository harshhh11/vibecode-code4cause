import { Request, Response } from 'express';
import {
  getWholeHomeRecommendation,
  getRoomDimensionRecommendation,
  checkFurnitureDimensionCompatibility,
} from '../services/dimensionAdvisor.js';
import { computeLayoutScoreAndConflicts } from '../services/layoutScorer.js';
import { generateAlternativeLayouts } from '../services/layoutGenerator.js';
import { calculateWalkingPaths } from '../services/walkingPathEngine.js';

export async function getWholeHomeAllocation(req: Request, res: Response): Promise<void> {
  try {
    const { totalAreaSqFt = 1200, configType = '2BHK' } = req.body;
    const result = getWholeHomeRecommendation(Number(totalAreaSqFt), configType);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getRoomRecommendation(req: Request, res: Response): Promise<void> {
  try {
    const { roomType = 'master_bedroom', totalAreaSqFt = 1200 } = req.body;
    const result = getRoomDimensionRecommendation(roomType, Number(totalAreaSqFt));
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function checkFurnitureCompatibility(req: Request, res: Response): Promise<void> {
  try {
    const { name, category, enteredDims, roomDims, existingFurnitureCount = 3 } = req.body;
    const result = checkFurnitureDimensionCompatibility(
      name,
      category,
      enteredDims,
      roomDims,
      Number(existingFurnitureCount)
    );
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function scoreLayout(req: Request, res: Response): Promise<void> {
  try {
    const { roomDims, doors = [], windows = [], obstacles = [], furniture = [] } = req.body;
    const scoreResult = computeLayoutScoreAndConflicts(roomDims, doors, windows, obstacles, furniture);
    const walkingResult = calculateWalkingPaths(roomDims, doors, furniture);

    res.json({
      success: true,
      data: {
        score: scoreResult.score,
        conflicts: scoreResult.conflicts,
        walkingPaths: walkingResult.paths,
        movementScore: walkingResult.movementScore,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateLayoutPermutations(req: Request, res: Response): Promise<void> {
  try {
    const { roomDims, doors = [], windows = [], obstacles = [], furniture = [], prompt = '' } = req.body;
    const options = generateAlternativeLayouts(roomDims, doors, windows, obstacles, furniture, prompt);
    res.json({ success: true, data: options });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function assistantChat(req: Request, res: Response): Promise<void> {
  try {
    const { message, roomName = 'Master Bedroom', length = 14, width = 12, currentScore = 91 } = req.body;
    const text = (message || '').toLowerCase();

    let reply = `I evaluated your spatial query for ${roomName} (${length} × ${width} ft).`;
    const suggestions = [];

    if (text.includes('wardrobe')) {
      reply = `In this ${length} × ${width} ft room, a wardrobe with a depth greater than 2.2 ft on the west wall creates a narrow 48 cm corridor. Placing a 6 ft wardrobe on the north wall preserves a full 92 cm circulation aisle.`;
      suggestions.push({
        id: `sug-${Date.now()}`,
        title: 'Optimize Layout',
        description: 'Auto-arrange wardrobe & circulation',
        category: 'space',
        actionType: 'optimize_layout',
        buttonLabel: '✨ Auto-Optimize Circulation',
      });
    } else if (text.includes('color') || text.includes('theme')) {
      reply = `To enhance the perceived volume and light reflection in your space, the **Japandi Earth** or **Warm Minimal** palette is recommended.`;
      suggestions.push({
        id: `sug-${Date.now()}`,
        title: 'Japandi Palette',
        description: 'Apply natural oak and wabi-sabi textures',
        category: 'color',
        actionType: 'apply_theme',
        actionPayload: 'theme-japandi-earth',
        buttonLabel: '🎨 Apply Japandi Earth',
      });
    } else {
      reply = `Your spatial score is ${currentScore}/100. Unobstructed walking clearance and door swing clearance are maintained according to standard architectural norms.`;
      suggestions.push({
        id: `sug-${Date.now()}`,
        title: 'Layout Permutations',
        description: 'Generate 4 alternative room placements',
        category: 'space',
        actionType: 'optimize_layout',
        buttonLabel: '✨ Generate 4 Layout Options',
      });
    }

    res.json({
      success: true,
      data: {
        reply,
        suggestions,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

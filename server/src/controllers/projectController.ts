import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { Project, RoomData } from '../types/project.js';
import type { FurnitureItem } from '../types/furniture.js';

export async function getAllProjects(_req: Request, res: Response): Promise<void> {
  try {
    const rawProjects = await db.projects.findMany();
    const projects: Project[] = [];

    for (const p of rawProjects) {
      const roomsRaw = await db.rooms.findByProject(String(p.id));
      const rooms: RoomData[] = [];

      for (const r of roomsRaw) {
        const furnitureRaw = await db.furniture.findByRoom(String(r.id));
        rooms.push({
          id: r.id,
          name: r.name,
          type: r.type,
          dimensions: { length: r.length_ft, width: r.width_ft, height: r.height_ft },
          doors: r.doors || [],
          windows: r.windows || [],
          obstacles: r.obstacles || [],
          furnitureIds: furnitureRaw.map((f: any) => f.id),
          themeId: r.theme_id || undefined,
        });
      }

      projects.push({
        id: p.id,
        name: p.name,
        description: p.description,
        type: p.type,
        totalAreaSqFt: p.total_area_sqft,
        configType: p.config_type || undefined,
        activeRoomId: p.active_room_id || (rooms[0]?.id || ''),
        activeThemeId: p.active_theme_id,
        layoutScore: p.layout_score,
        versions: p.versions || [],
        createdAt: p.created_at,
        lastEdited: p.last_edited,
        rooms,
      });
    }

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getProjectById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const p = await db.projects.findById(id);
    if (!p) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    const roomsRaw = await db.rooms.findByProject(id);
    const rooms: RoomData[] = [];
    const furnitureByRoom: Record<string, FurnitureItem[]> = {};

    for (const r of roomsRaw) {
      const itemsRaw = await db.furniture.findByRoom(String(r.id));
      const items: FurnitureItem[] = itemsRaw.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        width: item.width_ft,
        depth: item.depth_ft,
        height: item.height_ft,
        x: item.pos_x,
        y: item.pos_y,
        rotation: item.rotation_deg,
        isExisting: Boolean(item.is_existing),
        color: item.color || undefined,
        material: item.material || undefined,
        modelType: item.model_type,
      }));

      furnitureByRoom[r.id] = items;
      rooms.push({
        id: r.id,
        name: r.name,
        type: r.type,
        dimensions: { length: r.length_ft, width: r.width_ft, height: r.height_ft },
        doors: r.doors || [],
        windows: r.windows || [],
        obstacles: r.obstacles || [],
        furnitureIds: items.map((f) => f.id),
        themeId: r.theme_id || undefined,
      });
    }

    const project: Project = {
      id: p.id,
      name: p.name,
      description: p.description,
      type: p.type,
      totalAreaSqFt: p.total_area_sqft,
      configType: p.config_type || undefined,
      activeRoomId: p.active_room_id || (rooms[0]?.id || ''),
      activeThemeId: p.active_theme_id,
      layoutScore: p.layout_score,
      versions: p.versions || [],
      createdAt: p.created_at,
      lastEdited: p.last_edited,
      rooms,
    };

    res.json({ success: true, data: { project, furniture: furnitureByRoom } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    const projectId = body.id || `proj-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString().split('T')[0];

    const initialRoomId = `room-${uuidv4().substring(0, 8)}`;
    const rooms = body.rooms && body.rooms.length > 0 ? body.rooms : [
      {
        id: initialRoomId,
        name: body.type === 'home' ? 'Master Bedroom' : (body.name || 'Main Room'),
        type: 'master_bedroom',
        dimensions: { length: 14, width: 12, height: 10 },
        doors: [{ id: `d-1`, name: 'Entry Door', wall: 'south', offset: 2, width: 3, swing: 'inside_left' }],
        windows: [{ id: `w-1`, name: 'North Window', wall: 'north', offset: 4.5, width: 5, height: 5, sillHeight: 3 }],
        obstacles: [],
      }
    ];

    await db.projects.create({
      id: projectId,
      name: body.name || 'New Architectural Space',
      description: body.description || 'Spatial layout design project.',
      type: body.type || 'room',
      total_area_sqft: body.totalAreaSqFt || (body.type === 'home' ? 1200 : 168),
      config_type: body.configType || null,
      active_room_id: rooms[0].id,
      active_theme_id: body.activeThemeId || 'theme-warm-minimal',
      layout_score: body.layoutScore || 88,
      versions: [{ id: `v-1`, name: 'Initial Setup', timestamp: 'Just now', layoutScore: 88 }],
      created_at: now,
      last_edited: 'Just now',
    });

    for (const r of rooms) {
      await db.rooms.create({
        id: r.id,
        project_id: projectId,
        name: r.name,
        type: r.type,
        length_ft: r.dimensions.length,
        width_ft: r.dimensions.width,
        height_ft: r.dimensions.height,
        doors: r.doors || [],
        windows: r.windows || [],
        obstacles: r.obstacles || [],
        theme_id: r.themeId || null,
      });
    }

    res.status(201).json({ success: true, projectId, message: 'Project created successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function addFurnitureItem(req: Request, res: Response): Promise<void> {
  try {
    const roomId = String(req.params.roomId);
    const body = req.body;
    const itemId = body.id || `f-${uuidv4().substring(0, 8)}`;

    await db.furniture.create({
      id: itemId,
      room_id: roomId,
      name: body.name,
      category: body.category,
      width_ft: body.width,
      depth_ft: body.depth,
      height_ft: body.height,
      pos_x: body.x,
      pos_y: body.y,
      rotation_deg: body.rotation || 0,
      is_existing: body.isExisting ? 1 : 0,
      color: body.color || null,
      material: body.material || null,
      model_type: body.modelType || 'custom_item',
    });

    res.status(201).json({ success: true, itemId, message: 'Furniture item added.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateFurnitureItem(req: Request, res: Response): Promise<void> {
  try {
    const furnitureId = String(req.params.furnitureId);
    const body = req.body;

    const existing = await db.furniture.findById(furnitureId);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Furniture item not found' });
      return;
    }

    await db.furniture.update(furnitureId, {
      pos_x: body.x !== undefined ? body.x : existing.pos_x,
      pos_y: body.y !== undefined ? body.y : existing.pos_y,
      rotation_deg: body.rotation !== undefined ? body.rotation : existing.rotation_deg,
      width_ft: body.width !== undefined ? body.width : existing.width_ft,
      depth_ft: body.depth !== undefined ? body.depth : existing.depth_ft,
      height_ft: body.height !== undefined ? body.height : existing.height_ft,
    });

    res.json({ success: true, message: 'Furniture item updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteFurnitureItem(req: Request, res: Response): Promise<void> {
  try {
    const furnitureId = String(req.params.furnitureId);
    await db.furniture.delete(furnitureId);
    res.json({ success: true, message: 'Furniture item deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

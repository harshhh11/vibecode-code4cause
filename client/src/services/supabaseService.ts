// AERA Supabase Database Integration Service
// Provides live synchronization for Projects, Rooms, Furniture, and AI Spatial Evaluations

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zbeuzfltablkkjcqcwup.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export interface SupabaseProjectRow {
  id: string;
  name: string;
  room_count: number;
  total_area_sqft: number;
  spatial_score: number;
  active_theme: string;
  last_synced_at: string;
}

export interface SupabaseAIEvaluationRow {
  id: string;
  room_name: string;
  score: number;
  circulation_score: number;
  clearance_score: number;
  feng_shui_score: number;
  ai_model: string;
  created_at: string;
}

// REST helper to directly query Supabase tables without heavyweight external runtime dependencies
async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Prefer: 'return=representation',
    ...options.headers,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      console.warn(`Supabase API responded with status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

// 1. Sync Active Project state to Supabase
export async function syncProjectToSupabase(project: {
  id: string;
  name: string;
  roomsCount: number;
  totalAreaSqFt: number;
  layoutScore: number;
  themeName: string;
}): Promise<boolean> {
  const payload = {
    id: project.id,
    name: project.name,
    room_count: project.roomsCount,
    total_area_sqft: project.totalAreaSqFt,
    spatial_score: project.layoutScore,
    active_theme: project.themeName,
    last_synced_at: new Date().toISOString(),
  };

  const result = await supabaseFetch('projects', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Prefer: 'resolution=merge-duplicates',
    },
  });

  return !!result;
}

// 2. Log Gemini AI Spatial Evaluation to Supabase
export async function logAIEvaluationToSupabase(evaluation: {
  roomName: string;
  score: number;
  circulation: number;
  clearance: number;
  fengShui: number;
  aiModel?: string;
}): Promise<boolean> {
  const payload = {
    room_name: evaluation.roomName,
    score: evaluation.score,
    circulation_score: evaluation.circulation,
    clearance_score: evaluation.clearance,
    feng_shui_score: evaluation.fengShui,
    ai_model: evaluation.aiModel || 'gemini-2.0-flash',
    created_at: new Date().toISOString(),
  };

  const result = await supabaseFetch('ai_evaluations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return !!result;
}

// 3. Mock seed generator for instant Supabase demonstration
export const INITIAL_MOCK_SUPABASE_DATA = {
  projects: [
    {
      id: 'proj-skyline-penthouse',
      name: 'Skyline Penthouse 4B',
      room_count: 5,
      total_area_sqft: 2450,
      spatial_score: 94,
      active_theme: 'Warm Minimalist Oak',
      last_synced_at: new Date().toISOString(),
    },
    {
      id: 'proj-zenith-villa',
      name: 'Zenith Coastal Villa',
      room_count: 7,
      total_area_sqft: 3800,
      spatial_score: 89,
      active_theme: 'Japandi Earth',
      last_synced_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'proj-artisan-loft',
      name: 'Artisan Urban Loft',
      room_count: 3,
      total_area_sqft: 1650,
      spatial_score: 91,
      active_theme: 'Nordic Light',
      last_synced_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  aiEvaluations: [
    {
      id: 'eval-1',
      room_name: 'Master Bedroom',
      score: 92,
      circulation_score: 95,
      clearance_score: 88,
      feng_shui_score: 93,
      ai_model: 'gemini-2.0-flash',
      created_at: new Date().toISOString(),
    },
    {
      id: 'eval-2',
      room_name: 'Living & Dining Great Room',
      score: 88,
      circulation_score: 89,
      clearance_score: 91,
      feng_shui_score: 84,
      ai_model: 'gemini-2.0-flash',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
};

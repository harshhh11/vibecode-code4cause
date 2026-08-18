-- ============================================================================
-- AERA SPATIAL INTELLIGENCE PLATFORM — COMPLETE SUPABASE DATABASE SCHEMA
-- Everything: Profiles, Projects, Rooms, Dimensions, Doors, Windows, Obstacles,
-- Furniture Catalog, Live Placements, AI Spatial Evaluations & Consultations
-- ============================================================================

-- 1. USER PROFILES & DESIGNER DIRECTORY
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'homeowner', -- 'homeowner' | 'designer' | 'architect'
    avatar_url TEXT,
    location TEXT,
    firm_name TEXT,
    rating NUMERIC DEFAULT 4.9,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    owner_id TEXT REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    project_type TEXT DEFAULT 'home', -- 'home' | 'room'
    config_type TEXT DEFAULT '2BHK',  -- '1BHK' | '2BHK' | '3BHK' | 'Penthouse' | 'Villa'
    total_area_sqft NUMERIC NOT NULL,
    carpet_area_sqft NUMERIC,
    spatial_score NUMERIC DEFAULT 85,
    active_theme TEXT DEFAULT 'Warm Minimalist Oak',
    city TEXT DEFAULT 'New York',
    status TEXT DEFAULT 'active',
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROOMS & DIMENSIONS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    room_type TEXT NOT NULL, -- 'master_bedroom' | 'living' | 'kitchen' | 'dining' | 'study' | 'bathroom'
    length_ft NUMERIC NOT NULL,
    width_ft NUMERIC NOT NULL,
    height_ft NUMERIC DEFAULT 10.0,
    area_sqft NUMERIC GENERATED ALWAYS AS (length_ft * width_ft) STORED,
    wall_color TEXT DEFAULT '#FAF9F6',
    floor_material TEXT DEFAULT 'White Oak Hardwood',
    target_clearance_cm NUMERIC DEFAULT 90.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROOM DOORS TABLE
CREATE TABLE IF NOT EXISTS public.room_doors (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Entry Door',
    wall TEXT NOT NULL, -- 'north' | 'south' | 'east' | 'west'
    offset_ft NUMERIC NOT NULL,
    width_ft NUMERIC DEFAULT 3.0,
    swing TEXT DEFAULT 'inside_left', -- 'inside_left' | 'inside_right' | 'outside_left' | 'outside_right'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROOM WINDOWS TABLE
CREATE TABLE IF NOT EXISTS public.room_windows (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Daylight Window',
    wall TEXT NOT NULL, -- 'north' | 'south' | 'east' | 'west'
    offset_ft NUMERIC NOT NULL,
    width_ft NUMERIC DEFAULT 5.0,
    height_ft NUMERIC DEFAULT 5.0,
    sill_height_ft NUMERIC DEFAULT 3.0,
    glazing_type TEXT DEFAULT 'Double Glazed Low-E',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STRUCTURAL OBSTACLES & MEP CHASES
CREATE TABLE IF NOT EXISTS public.room_obstacles (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    obstacle_type TEXT DEFAULT 'column', -- 'column' | 'hvac' | 'plumbing' | 'electrical'
    pos_x_ft NUMERIC NOT NULL,
    pos_y_ft NUMERIC NOT NULL,
    width_ft NUMERIC NOT NULL,
    depth_ft NUMERIC NOT NULL,
    height_ft NUMERIC DEFAULT 10.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MASTER FURNITURE CATALOG (2D & 3D SPECS)
CREATE TABLE IF NOT EXISTS public.furniture_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'beds' | 'storage' | 'seating' | 'tables' | 'decor' | 'lighting'
    width_ft NUMERIC NOT NULL,
    depth_ft NUMERIC NOT NULL,
    height_ft NUMERIC NOT NULL,
    material TEXT NOT NULL,
    default_price_usd NUMERIC DEFAULT 499.0,
    cad_footprint_svg TEXT,
    three_mesh_type TEXT DEFAULT 'procedural',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTIVE FURNITURE PLACEMENTS
CREATE TABLE IF NOT EXISTS public.furniture_placements (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    catalog_item_id TEXT REFERENCES public.furniture_catalog(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    pos_x_ft NUMERIC NOT NULL,
    pos_y_ft NUMERIC NOT NULL,
    rotation_deg INT DEFAULT 0,
    width_ft NUMERIC NOT NULL,
    depth_ft NUMERIC NOT NULL,
    height_ft NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GEMINI AI SPATIAL EVALUATIONS & HYPE SCORES
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL,
    overall_hype_score NUMERIC NOT NULL,
    circulation_score NUMERIC NOT NULL,
    door_clearance_score NUMERIC NOT NULL,
    natural_light_score NUMERIC NOT NULL,
    ergonomics_score NUMERIC NOT NULL,
    feng_shui_score NUMERIC NOT NULL,
    min_corridor_clearance_cm NUMERIC DEFAULT 92.0,
    ai_model TEXT DEFAULT 'gemini-2.0-flash',
    ai_rationale TEXT,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CLIENT-ARCHITECT CONSULTATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_role TEXT DEFAULT 'homeowner', -- 'homeowner' | 'architect' | 'ai_assistant'
    message TEXT NOT NULL,
    spatial_score_context NUMERIC,
    attached_layout_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. COLOR PALETTES & MATERIAL THEMES
CREATE TABLE IF NOT EXISTS public.design_themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    wall_color TEXT NOT NULL,
    floor_color TEXT NOT NULL,
    furniture_color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    ambient_light_temp_k INT DEFAULT 4500
);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PRODUCTION
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_doors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_obstacles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furniture_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furniture_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access room_doors" ON public.room_doors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access room_windows" ON public.room_windows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access room_obstacles" ON public.room_obstacles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access furniture_catalog" ON public.furniture_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access furniture_placements" ON public.furniture_placements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access ai_evaluations" ON public.ai_evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access design_themes" ON public.design_themes FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED INITIAL DATA (ALL ROOM DIMENSIONS, FURNITURE, AI HYPE SCORES & THEMES)
-- ============================================================================

-- Profiles
INSERT INTO public.user_profiles (id, name, email, role, location, firm_name, rating, reviews_count)
VALUES
    ('usr-alexander', 'Alexander Wright', 'alexander@aera.design', 'homeowner', 'Tribeca, New York', 'Private Residence', 5.0, 12),
    ('usr-ethan', 'Ethan Rodrigues', 'ethan.arch@aera.design', 'architect', 'SoHo, New York', 'Rodrigues Spatial Architecture', 4.98, 84),
    ('usr-elena', 'Elena Rostova', 'elena.interior@aera.design', 'designer', 'Stockholm / London', 'Studio Rostova', 4.95, 62)
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO public.projects (id, owner_id, name, project_type, config_type, total_area_sqft, carpet_area_sqft, spatial_score, active_theme, city)
VALUES
    ('proj-penthouse-01', 'usr-alexander', 'Skyline Penthouse Residence 4B', 'home', 'Penthouse', 2450, 2180, 94, 'Warm Minimalist Oak', 'New York'),
    ('proj-zenith-02', 'usr-alexander', 'Zenith Coastal Villa & Retreat', 'home', 'Villa', 3800, 3420, 89, 'Japandi Earth', 'Malibu'),
    ('proj-loft-03', 'usr-alexander', 'Artisan Urban Design Loft', 'home', '2BHK', 1650, 1490, 91, 'Nordic Light', 'London'),
    ('proj-minimal-04', 'usr-alexander', 'Minimalist Studio Residence', 'room', '1BHK', 850, 780, 96, 'Warm Minimalist Oak', 'Tokyo')
ON CONFLICT (id) DO NOTHING;

-- Rooms with Exact Dimensions
INSERT INTO public.rooms (id, project_id, name, room_type, length_ft, width_ft, height_ft, wall_color, floor_material)
VALUES
    ('room-mb-01', 'proj-penthouse-01', 'Master Suite & Lounge', 'master_bedroom', 16.0, 14.0, 10.0, '#FAF9F6', 'White Oak Planks'),
    ('room-lr-01', 'proj-penthouse-01', 'Great Living & Media Salon', 'living', 22.0, 18.0, 11.5, '#F5F4EF', 'Natural Walnut Planks'),
    ('room-ki-01', 'proj-penthouse-01', 'Chef Island Kitchen & Bar', 'kitchen', 14.0, 12.0, 10.0, '#FFFFFF', 'Honed Terrazzo'),
    ('room-st-01', 'proj-penthouse-01', 'Executive Study & Library', 'study', 12.0, 10.0, 10.0, '#FAF4ED', 'Herringbone Oak')
ON CONFLICT (id) DO NOTHING;

-- Doors with Clearance Angles
INSERT INTO public.room_doors (id, room_id, name, wall, offset_ft, width_ft, swing)
VALUES
    ('door-1', 'room-mb-01', 'Master Suite Primary Entry', 'south', 2.5, 3.0, 'inside_left'),
    ('door-2', 'room-mb-01', 'Walk-in Closet En-Suite Door', 'west', 9.0, 2.8, 'inside_right'),
    ('door-3', 'room-lr-01', 'Grand Foyer Double Door', 'south', 8.0, 5.0, 'inside_left')
ON CONFLICT (id) DO NOTHING;

-- Architectural Windows
INSERT INTO public.room_windows (id, room_id, name, wall, offset_ft, width_ft, height_ft, sill_height_ft)
VALUES
    ('win-1', 'room-mb-01', 'East Panoramic Sunrise Window', 'north', 4.0, 8.0, 6.0, 2.5),
    ('win-2', 'room-lr-01', 'Floor-to-Ceiling Skyline Glazing', 'north', 2.0, 16.0, 9.5, 1.0),
    ('win-3', 'room-st-01', 'Corner Daylight Casement', 'west', 3.0, 5.0, 5.0, 3.0)
ON CONFLICT (id) DO NOTHING;

-- Furniture Catalog
INSERT INTO public.furniture_catalog (id, name, category, width_ft, depth_ft, height_ft, material, default_price_usd)
VALUES
    ('cat-bed-king', 'King Bed & Oak Floating Frame', 'beds', 6.5, 7.0, 4.0, 'Natural White Oak & Linen', 1850),
    ('cat-bed-queen', 'Queen Bed & Boucle Headboard', 'beds', 5.5, 6.8, 3.8, 'Oatmeal Boucle & Walnut', 1450),
    ('cat-ward-8ft', '8-Door Built-in Wardrobe System', 'storage', 8.0, 2.2, 8.5, 'Fluted Oak & Matte Black Handles', 2600),
    ('cat-ward-6ft', '6-Door Minimalist Wardrobe', 'storage', 6.0, 2.0, 8.0, 'Matte Lacquer & Walnut Trim', 1950),
    ('cat-sofa-3s', 'Architectural 3-Seater Sofa', 'seating', 7.5, 3.2, 2.8, 'Italian Sand Chenille', 2200),
    ('cat-desk-exec', 'Minimalist Executive Desk', 'tables', 5.0, 2.5, 2.5, 'Solid Oak & Steel Frame', 980),
    ('cat-night-oak', 'Floating Oak Nightstand', 'tables', 2.0, 1.6, 2.0, 'Solid White Oak', 420),
    ('cat-chair-lounge', 'Prouvé Minimalist Lounge Chair', 'seating', 2.8, 3.0, 2.7, 'Natural Leather & Steel', 1150)
ON CONFLICT (id) DO NOTHING;

-- Placed Furniture
INSERT INTO public.furniture_placements (id, room_id, catalog_item_id, name, pos_x_ft, pos_y_ft, rotation_deg, width_ft, depth_ft, height_ft)
VALUES
    ('place-1', 'room-mb-01', 'cat-bed-king', 'King Bed & Oak Frame', 4.75, 0.0, 0, 6.5, 7.0, 4.0),
    ('place-2', 'room-mb-01', 'cat-night-oak', 'Minimalist Nightstand Left', 2.5, 0.0, 0, 2.0, 1.6, 2.0),
    ('place-3', 'room-mb-01', 'cat-night-oak', 'Minimalist Nightstand Right', 11.5, 0.0, 0, 2.0, 1.6, 2.0),
    ('place-4', 'room-mb-01', 'cat-ward-8ft', '8-Door Built-in Wardrobe', 0.0, 2.0, 90, 8.0, 2.2, 8.5)
ON CONFLICT (id) DO NOTHING;

-- Gemini AI Spatial Evaluations & Hype Scores
INSERT INTO public.ai_evaluations (project_id, room_name, overall_hype_score, circulation_score, door_clearance_score, natural_light_score, ergonomics_score, feng_shui_score, ai_model, ai_rationale, recommendations)
VALUES
    (
        'proj-penthouse-01',
        'Master Suite & Lounge',
        94.0,
        96.0,
        92.0,
        95.0,
        94.0,
        93.0,
        'gemini-2.0-flash',
        'Spatial layout achieves excellent 92 cm circulation clearance along main travel paths with zero door swing conflict.',
        '["Keep main circulation corridor >= 90 cm", "Orient headboard flush to solid structural wall", "Preserve unobstructed window sunrise sightlines"]'::jsonb
    ),
    (
        'proj-penthouse-01',
        'Great Living & Media Salon',
        89.0,
        91.0,
        88.0,
        94.0,
        87.0,
        85.0,
        'gemini-2.0-flash',
        'Conversation ring maintains comfortable 8.5 ft viewing distance for 75-inch screen and unobstructed terrace access.',
        '["Maintain 3.5 ft clearance around central coffee table", "Avoid placing high-back chairs directly in front of skyline glass"]'::jsonb
    );

-- Consultations
INSERT INTO public.consultations (project_id, sender_name, sender_role, message, spatial_score_context)
VALUES
    ('proj-penthouse-01', 'Alexander Wright', 'homeowner', 'Can you optimize the wardrobe placement to maximize morning natural light?', 91),
    ('proj-penthouse-01', 'Ethan Rodrigues', 'architect', 'I reviewed the layout: shifting the 8ft wardrobe to the west perimeter wall maintains an open 92cm pathway and prevents shadow on the vanity.', 94),
    ('proj-penthouse-01', 'AERA Spatial AI (Gemini 2.0)', 'ai_assistant', 'Updated master suite layout score: Hype Score boosted from 91 -> 94/100 (+3 pts).', 94);

-- Design Themes
INSERT INTO public.design_themes (id, name, description, wall_color, floor_color, furniture_color, accent_color, ambient_light_temp_k)
VALUES
    ('theme-oak', 'Warm Minimalist Oak', 'Natural white oak, soft limestone textures, and brushed bronze accents.', '#FAF9F6', '#DFD7CA', '#6E472A', '#B26A4A', 4200),
    ('theme-japandi', 'Japandi Earth', 'Tactile boucle fabrics, charcoal ceramics, and dark walnut joinery.', '#F4EFE6', '#C9BBA8', '#3D3126', '#8C5232', 3800),
    ('theme-nordic', 'Nordic Light', 'Crisp birch timbers, muted sage green accents, and airy light reflectance.', '#FFFFFF', '#ECE8DE', '#5E7260', '#3B4D3C', 5000)
ON CONFLICT (id) DO NOTHING;

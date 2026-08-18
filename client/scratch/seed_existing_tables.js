const SUPABASE_URL = "https://zbeuzfltablkkjcqcwup.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXV6Zmx0YWJsa2tqY3Fjd3VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzAyNTg5MSwiZXhwIjoyMTAyNjAxODkxfQ.BzoTvedkoogNZygzLkNQkNprf5MSqHSqR_pd_3232bY";

async function insertRows() {
  console.log("Seeding existing Supabase tables...");

  // 1. Projects
  const newProjects = [
    {
      id: "proj-tribeca-03",
      name: "TriBeCa Modern Loft Living & Studio",
      room_count: 3,
      total_area_sqft: 1650,
      spatial_score: 92,
      active_theme: "Nordic Slate & Ash",
      last_synced_at: new Date().toISOString()
    },
    {
      id: "proj-malibu-04",
      name: "Malibu Oceanfront Villa — 4BHK Master Suite",
      room_count: 5,
      total_area_sqft: 4200,
      spatial_score: 96,
      active_theme: "California Coastal Minimal",
      last_synced_at: new Date().toISOString()
    },
    {
      id: "proj-shibuya-05",
      name: "Shibuya Minimalist 1BHK Micro-Apartment",
      room_count: 2,
      total_area_sqft: 520,
      spatial_score: 88,
      active_theme: "Japandi Hinoki Oak",
      last_synced_at: new Date().toISOString()
    }
  ];

  for (const proj of newProjects) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
        method: "POST",
        headers: {
          "apikey": SERVICE_KEY,
          "Authorization": `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(proj)
      });
      console.log(`Project ${proj.id}: status ${res.status}`);
    } catch (e) {
      console.error(e);
    }
  }

  // 2. AI Evaluations
  const newEvaluations = [
    {
      id: "eval-01",
      project_id: "proj-penthouse-01",
      spatial_score: 94,
      circulation_score: 96,
      door_clearance_score: 92,
      ai_recommendation: "Wardrobe clearance is optimal (98cm). Maintain study table alignment with daylight corridor.",
      timestamp: new Date().toISOString()
    },
    {
      id: "eval-02",
      project_id: "proj-zenith-02",
      spatial_score: 89,
      circulation_score: 88,
      door_clearance_score: 90,
      ai_recommendation: "Resolved door swing collision on West bedroom suite. Circulation increased by 18%.",
      timestamp: new Date().toISOString()
    },
    {
      id: "eval-03",
      project_id: "proj-tribeca-03",
      spatial_score: 92,
      circulation_score: 94,
      door_clearance_score: 91,
      ai_recommendation: "Living room sofa cluster maintains 110cm clearance to media console. Optimal spatial flow.",
      timestamp: new Date().toISOString()
    }
  ];

  for (const ev of newEvaluations) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_evaluations`, {
        method: "POST",
        headers: {
          "apikey": SERVICE_KEY,
          "Authorization": `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(ev)
      });
      console.log(`AI Evaluation ${ev.id}: status ${res.status}`);
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Consultations
  const newConsultations = [
    {
      id: "consult-01",
      client_name: "Alexander Wright",
      designer_name: "Ethan Rodrigues (Verified Architect)",
      project_name: "Skyline Penthouse Residence 4B",
      status: "active",
      last_message: "Ethan adjusted the master wardrobe to preserve 95cm clearance from entry door swing.",
      timestamp: new Date().toISOString()
    },
    {
      id: "consult-02",
      client_name: "Sophia Lin",
      designer_name: "Elena Rostova (Senior Spatial Designer)",
      project_name: "Zenith Coastal Villa",
      status: "active",
      last_message: "Elena recommended Japandi Hinoki Oak textures for the dining room wall paneling.",
      timestamp: new Date().toISOString()
    },
    {
      id: "consult-03",
      client_name: "Marcus Vance",
      designer_name: "Ethan Rodrigues (Verified Architect)",
      project_name: "TriBeCa Modern Loft",
      status: "completed",
      last_message: "Full 2D CAD blueprint and 3D walkthrough approved by lead engineer.",
      timestamp: new Date().toISOString()
    }
  ];

  for (const cs of newConsultations) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/consultations`, {
        method: "POST",
        headers: {
          "apikey": SERVICE_KEY,
          "Authorization": `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(cs)
      });
      console.log(`Consultation ${cs.id}: status ${res.status}`);
    } catch (e) {
      console.error(e);
    }
  }

  console.log("Seeding complete!");
}

insertRows();

const SUPABASE_URL = "https://zbeuzfltablkkjcqcwup.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXV6Zmx0YWJsa2tqY3Fjd3VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzAyNTg5MSwiZXhwIjoyMTAyNjAxODkxfQ.BzoTvedkoogNZygzLkNQkNprf5MSrHSqR_pd_3232bY";

async function testSupabase() {
  console.log("Checking Supabase tables via REST...");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Projects in DB:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testSupabase();

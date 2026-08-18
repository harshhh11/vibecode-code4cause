import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.resolve(DATA_DIR, 'aera_spatial.json');

export interface DatabaseStore {
  projects: any[];
  rooms: any[];
  furniture_items: any[];
  designers: any[];
  consultations: any[];
  messages: any[];
}

let store: DatabaseStore = {
  projects: [],
  rooms: [],
  furniture_items: [],
  designers: [],
  consultations: [],
  messages: [],
};

// Load existing data from file if present
function loadStore(): DatabaseStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('⚠️ Could not load existing DB JSON, initializing fresh store.', err);
  }
  return store;
}

// Persist store to disk
export function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Error saving database JSON to disk:', err);
  }
}

export async function initDatabaseSchema() {
  store = loadStore();
  console.log('✅ AERA Persistent JSON Database Initialized at:', DB_FILE);
}

// DB Data Access Helpers
export const db = {
  getStore: () => store,
  
  projects: {
    findMany: async () => store.projects,
    findById: async (id: string) => store.projects.find((p) => p.id === id),
    create: async (proj: any) => {
      store.projects.push(proj);
      saveStore();
      return proj;
    },
    update: async (id: string, updates: any) => {
      const idx = store.projects.findIndex((p) => p.id === id);
      if (idx !== -1) {
        store.projects[idx] = { ...store.projects[idx], ...updates };
        saveStore();
        return store.projects[idx];
      }
      return null;
    },
  },

  rooms: {
    findByProject: async (projectId: string) => store.rooms.filter((r) => r.project_id === projectId),
    findById: async (id: string) => store.rooms.find((r) => r.id === id),
    create: async (room: any) => {
      store.rooms.push(room);
      saveStore();
      return room;
    },
  },

  furniture: {
    findByRoom: async (roomId: string) => store.furniture_items.filter((f) => f.room_id === roomId),
    findById: async (id: string) => store.furniture_items.find((f) => f.id === id),
    create: async (item: any) => {
      store.furniture_items.push(item);
      saveStore();
      return item;
    },
    update: async (id: string, updates: any) => {
      const idx = store.furniture_items.findIndex((f) => f.id === id);
      if (idx !== -1) {
        store.furniture_items[idx] = { ...store.furniture_items[idx], ...updates };
        saveStore();
        return store.furniture_items[idx];
      }
      return null;
    },
    delete: async (id: string) => {
      store.furniture_items = store.furniture_items.filter((f) => f.id !== id);
      saveStore();
    },
  },

  designers: {
    findMany: async () => store.designers,
    findById: async (id: string) => store.designers.find((d) => d.id === id),
    create: async (des: any) => {
      store.designers.push(des);
      saveStore();
      return des;
    },
  },

  consultations: {
    findMany: async () => store.consultations,
    findById: async (id: string) => store.consultations.find((c) => c.id === id),
    create: async (consult: any) => {
      store.consultations.push(consult);
      saveStore();
      return consult;
    },
  },

  messages: {
    findByConsultation: async (consultationId: string) =>
      store.messages.filter((m) => m.consultation_id === consultationId),
    create: async (msg: any) => {
      store.messages.push(msg);
      saveStore();
      return msg;
    },
  },
};

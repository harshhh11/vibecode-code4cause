# AERA — AI Spatial Design & Interior Planning Platform
> **Design your space. Make it work.**

AERA is an architectural-grade AI interior planning and spatial intelligence platform. Unlike generic generative AI image tools, AERA combines **deterministic spatial physics, mathematical circulation corridor scoring, 3-level dimension intelligence, real-time 2D CAD floor plan editing, photorealistic 3D Three.js visualization, and verified interior designer collaboration**.

---

## ⚡ Quick Start for Antigravity IDE

### 1. Open in Antigravity IDE
Open the folder `C:\Users\admin\Desktop\AERA` in Antigravity IDE as your active workspace.

### 2. Install Dependencies
Run in the root terminal:
```bash
npm run install:all
```
*(Or install in `client/` and `server/` respectively: `cd client && npm install`, `cd ../server && npm install`)*

### 3. Launch Full-Stack Platform (Backend + Frontend)
```bash
npm run dev
```

- **Frontend (React 19 + Three.js + CAD Studio)**: [http://localhost:5173](http://localhost:5173)
- **Backend (Express + SQLite REST API)**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Repository Structure

```
AERA/
├── client/                     # Frontend Application (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── api/                # REST API client connecting to backend
│   │   ├── components/         # 2D Canvas, 3D Studio, Panels, Modals, Marketplace, Chat
│   │   ├── context/            # ProjectContext, AuthContext, UIContext
│   │   ├── data/               # Seed datasets and color themes
│   │   ├── types/              # Complete TypeScript spatial definitions
│   │   └── utils/              # Client-side 2D/3D math and layout engines
│   ├── index.html              # Google Fonts (Plus Jakarta Sans, Space Grotesk)
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Backend API & Spatial Services (Express + TypeScript + SQLite)
│   ├── src/
│   │   ├── controllers/        # Project, AI, Designer, Chat, Catalog controllers
│   │   ├── db/                 # SQLite connection, schema migrations, and seeder
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # Spatial scoring, walking path math, 4-layout permutations
│   │   ├── types/              # Server-side TypeScript interfaces
│   │   └── index.ts            # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Monorepo root script with concurrently
├── .env.example
├── .gitignore
└── README.md
```

---

## 🏛️ Key System Capabilities

### 1. 3 Levels of AI Spatial Dimension Recommendations
- **Level 1 — Whole-Home Area Allocation**: Automatically proportions square footage across Living, Master Bedroom, Kitchen, Balconies, and circulation corridors for 1BHK, 2BHK, 3BHK, and 4BHK apartments (e.g. 1200 sq.ft 2BHK model).
- **Level 2 — Room Dimension Recommendations**: Functional length × width proportions with architectural explainability on how Queen/King beds, 2 bedside tables, 6ft wardrobes, and desks fit with clearances.
- **Level 3 — Smart Furniture Advisor with ⚠️ Dimension Alert**: Detects when furniture restricts corridors below 80 cm or blocks door swing trajectories, with 1-click **"✨ Optimize"** (e.g. 48 cm → 92 cm clearance restoration).

### 2. Deterministic Spatial Math & Collision Engine
- **Boundary Checks**: Validates items against exterior and interior room perimeter walls.
- **Door Swing Clearance**: Calculates 90° swing trajectory boxes and identifies conflicts with furniture corners.
- **Window Daylight Preservation**: Flags tall storage units (>4.5 ft) placed in front of windows.
- **Walking Circulation Analysis**: Calculates path clearance from the entry door to key room zones with an overall movement score (e.g. **92/100**).

### 3. Interactive 2D CAD Canvas & Three.js 3D Studio
- **2D Floor Plan Editor**: Interactive drag, 90° rotate, duplicate, delete, wall dimension redlines (feet & meters), door swing arcs, and circulation path lines.
- **3D Visualization Studio**: Three.js viewport with soft PCF shadows, realistic materials, camera presets (**Isometric**, **Top-Down**, **Walkthrough**), and dual lighting modes (**Daylight 4000K** vs **Warm Evening 2700K**).

### 4. 4-Option AI Layout Permutation Generator & Matrix
1. **Layout A — Space Efficient (Score: 91/100)**: Maximizes 92 cm central circulation corridor.
2. **Layout B — Comfort Focused (Score: 87/100)**: Expanded bedside circulation and lounge alcove.
3. **Layout C — Storage Focused (Score: 89/100)**: Built-in 8ft wardrobe with dedicated swing depth.
4. **Layout D — Study / Work-from-Home (Score: 86/100)**: Optimal natural window lighting on work surface.

### 5. Verified Designer Marketplace & Project-Linked Messenger
- Search & filter verified spatial architects (e.g. Ethan Rodrigues, Meera Shah).
- In-app encrypted messaging linked to the active room blueprint.
- **1-Click "Apply Designer Revision"** to update blueprints directly from chat cards.
- Switch between **Homeowner (Alexander Wright)** and **Interior Designer (Ethan Rodrigues)** via the sidebar persona toggle.

---

## 🌐 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all user projects with layout score metrics |
| `GET` | `/api/projects/:id` | Get project details with rooms and furniture items |
| `POST` | `/api/projects` | Create a new single-room or whole-home project |
| `POST` | `/api/projects/:id/rooms/:roomId/furniture` | Add furniture item to room |
| `PUT` | `/api/projects/:id/rooms/:roomId/furniture/:id` | Update furniture position / rotation |
| `DELETE` | `/api/projects/:id/rooms/:roomId/furniture/:id` | Remove furniture item |
| `POST` | `/api/ai/whole-home-distribution` | Level 1 Whole-Home area calculations (1/2/3/4 BHK) |
| `POST` | `/api/ai/room-dimensions` | Level 2 Room Dimension advice with rationale |
| `POST` | `/api/ai/furniture-check` | Level 3 Furniture Dimension & Clearance check |
| `POST` | `/api/ai/score-layout` | Deterministic score (91/100) & conflict detection |
| `POST` | `/api/ai/generate-layouts` | Generate 4 layout permutations |
| `POST` | `/api/ai/assistant-chat` | AI spatial design co-pilot chat |
| `GET` | `/api/designers` | Filter verified designers by style, rating, price |
| `GET` | `/api/designers/:id` | Get designer profile, portfolio, and reviews |
| `POST` | `/api/designers/consultations` | Submit project-linked consultation request |
| `GET` | `/api/chat/:consultationId/messages` | Get consultation chat thread |
| `POST` | `/api/chat/:consultationId/messages` | Send message with attached layout revision |
| `GET` | `/api/catalog/furniture` | Retrieve architectural furniture catalog |
| `GET` | `/api/catalog/themes` | Retrieve 6 architectural color & material themes |
| `POST` | `/api/catalog/export/spec-sheet` | Generate structured spatial specification report |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Three.js, TailwindCSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, SQLite (`sqlite3`), UUID, CORS.
- **Tools**: TSX (TypeScript Execute Watcher), Concurrently.

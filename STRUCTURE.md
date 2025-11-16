# Project Directory Structure

## Complete File Tree

```
hackcamp2025-redo-1/
│
├── 📁 backend/                          # Node.js Express Backend
│   ├── 📁 src/
│   │   ├── 📁 agents/                   # AI Agent Implementations
│   │   │   ├── 🤖 orchestrator.js       (Gemini 2.5 Flash coordinator)
│   │   │   ├── 🤖 locationAgent.js      (Geocoding & parsing)
│   │   │   ├── 🤖 mapsAgent.js          (Google Places API)
│   │   │   ├── 🤖 restaurantSiteAgent.js(Web scraping)
│   │   │   ├── 🤖 reviewAgent.js        (Rating aggregation)
│   │   │   └── 🤖 dietaryAgent.js       (Dietary filtering)
│   │   │
│   │   ├── 📁 routes/                   # API Route Handlers
│   │   │   ├── 🔗 search.js             (Search endpoints)
│   │   │   └── 🔗 restaurants.js        (Restaurant endpoints)
│   │   │
│   │   ├── 📁 services/                 # Business Logic
│   │   │   ├── 💼 searchService.js      (Orchestration)
│   │   │   └── 💼 dataProcessing.js     (Pipeline)
│   │   │
│   │   └── 🌐 server.js                 (Express initialization)
│   │
│   ├── 📦 package.json                  (Dependencies & scripts)
│   └── 📋 .env.example                  (Environment template)
│
├── 📁 frontend/                         # React Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/               # React Components
│   │   │   ├── ⚛️ SearchBar.jsx         (Location search)
│   │   │   ├── ⚛️ SearchBar.css
│   │   │   ├── ⚛️ FilterPanel.jsx       (Budget, dietary, rating)
│   │   │   ├── ⚛️ FilterPanel.css
│   │   │   ├── ⚛️ MapView.jsx           (Google Maps)
│   │   │   ├── ⚛️ MapView.css
│   │   │   ├── ⚛️ RestaurantList.jsx    (Infinite scroll)
│   │   │   ├── ⚛️ RestaurantList.css
│   │   │   ├── ⚛️ RestaurantCard.jsx    (Restaurant card)
│   │   │   └── ⚛️ RestaurantCard.css
│   │   │
│   │   ├── 🎨 App.jsx                   (Main app component)
│   │   ├── 🎨 App.css                   (App layout)
│   │   ├── 🎨 main.jsx                  (Entry point)
│   │   ├── 🎨 index.css                 (Global styles)
│   │   │
│   │   └── 📁 pages/                    (For future use)
│   │
│   ├── 📦 package.json                  (Dependencies)
│   ├── ⚙️ vite.config.js                (Build config)
│   └── 📄 index.html                    (HTML template)
│
├── 📚 Documentation
│   ├── 📖 README.md                     (Complete guide)
│   ├── ⚡ QUICKSTART.md                 (5-min setup)
│   ├── 🔧 SETUP.md                      (Detailed config)
│   ├── 🏗️ ARCHITECTURE.md               (System design)
│   ├── 📋 PROJECT_SUMMARY.md            (Project overview)
│   ├── 🗂️ INDEX.md                      (Navigation)
│   ├── ✅ COMPLETION_REPORT.md          (What was built)
│   └── 📊 STRUCTURE.md                  (This file)
│
├── 🔐 Configuration
│   ├── .env.example                     (Backend env template)
│   └── .gitignore                       (Git configuration)
│
└── 📦 package files (root)
    ├── .git/                            (Version control)
    ├── .github/                         (GitHub files)
    └── node_modules/                    (Not shown, created by npm)
```

## File Descriptions

### Backend Agents (`backend/src/agents/`)

| File | Lines | Purpose |
|------|-------|---------|
| **orchestrator.js** | ~180 | Coordinates all agents using Gemini 2.5 Flash |
| **locationAgent.js** | ~60 | Parses location, returns coordinates |
| **mapsAgent.js** | ~90 | Queries Google Places API, filters results |
| **restaurantSiteAgent.js** | ~120 | Scrapes websites for menus & photos |
| **reviewAgent.js** | ~80 | Aggregates ratings from multiple sources |
| **dietaryAgent.js** | ~140 | Analyzes dietary compatibility |

### Backend Services (`backend/src/services/`)

| File | Lines | Purpose |
|------|-------|---------|
| **searchService.js** | ~110 | Main orchestration of search pipeline |
| **dataProcessing.js** | ~180 | Dedup, validate, enrich, rank results |

### Backend Routes (`backend/src/routes/`)

| File | Lines | Endpoints |
|------|-------|-----------|
| **search.js** | ~40 | POST /api/search/restaurants, GET /api/search/agents |
| **restaurants.js** | ~50 | GET /api/restaurants/:placeId |

### Frontend Components (`frontend/src/components/`)

| File | Purpose |
|------|---------|
| **SearchBar.jsx** | Location input & search button |
| **FilterPanel.jsx** | Budget, dietary, rating filters |
| **MapView.jsx** | Google Maps embed with pins |
| **RestaurantList.jsx** | Infinite scroll container |
| **RestaurantCard.jsx** | Individual restaurant display |

### Frontend Styling

| File | Purpose |
|------|---------|
| **index.css** | Global styles & typography |
| **App.css** | Main layout & responsive design |
| **Component.css** | Component-specific styles (5 files) |

### Documentation Files

| File | Lines | Purpose |
|------|-------|---------|
| **README.md** | ~400 | Full documentation & reference |
| **QUICKSTART.md** | ~150 | Fast 5-minute setup guide |
| **SETUP.md** | ~200 | Detailed configuration |
| **ARCHITECTURE.md** | ~400 | System design & agent details |
| **PROJECT_SUMMARY.md** | ~300 | What was built & features |
| **INDEX.md** | ~200 | Navigation guide |
| **COMPLETION_REPORT.md** | ~250 | Build completion summary |

---

## Quick Navigation

### To Understand the System
1. Start with `INDEX.md` - Overview
2. Read `QUICKSTART.md` - Get running
3. Check `ARCHITECTURE.md` - How it works
4. Explore agent code - Implementation details

### To Set It Up
1. Follow `QUICKSTART.md` - Basic setup
2. See `SETUP.md` - Detailed config
3. Check `.env.example` files - Environment template
4. Run `npm install` in both folders

### To Customize
1. Edit `frontend/src/App.css` - Colors
2. Edit `FilterPanel.jsx` - Filter options
3. Edit `dataProcessing.js` - Ranking weights
4. Add new agents in `backend/src/agents/`

### To Deploy
1. Push to GitHub
2. See README.md deployment section
3. Deploy backend to Render/Railway
4. Deploy frontend to Vercel/Netlify

---

## File Statistics

### Code Files
- Backend JavaScript: 8 files, ~1,080 lines
- Frontend JavaScript: 6 files, ~485 lines
- Frontend CSS: 6 files, ~400 lines
- **Total Code: 20 files, ~1,965 lines**

### Configuration Files
- `package.json`: 2 files (backend, frontend)
- `vite.config.js`: 1 file
- `.env.example`: 1 file
- `.gitignore`: 1 file
- **Total Config: 5 files**

### Documentation Files
- Markdown guides: 7 files, ~1,650 lines
- **Total Documentation: 7 files, ~1,650 lines**

### Total Project
- **32 files created**
- **~3,600+ lines total**

---

## Setup Checklist

### Folders Created
- [x] `/backend` - Node.js backend
- [x] `/backend/src` - Source code
- [x] `/backend/src/agents` - 6 agents
- [x] `/backend/src/routes` - 2 route files
- [x] `/backend/src/services` - 2 services
- [x] `/frontend` - React frontend
- [x] `/frontend/src` - React source
- [x] `/frontend/src/components` - 5 components
- [x] `/frontend/src/pages` - (for future use)

### Files Created
- [x] 6 AI agents
- [x] 2 service files
- [x] 2 route files
- [x] 1 server file
- [x] 5 React components
- [x] 6 CSS files
- [x] 2 config files
- [x] 2 package.json files
- [x] 7 documentation files
- [x] .gitignore

---

## How Files Connect

### Data Flow
```
Frontend (React)
    ↓ HTTP
Backend API (Express)
    ↓
Service Layer (searchService.js)
    ↓
Agents (orchestrator + 5 specialized)
    ↓
External APIs + Data Pipeline
    ↓
Database/Cache
    ↓ Response
Frontend
    ↓
User Sees Results
```

### Dependencies
```
Frontend imports:
  - React components from /components
  - Styles from *.css files
  - API client (axios) for calls

Backend imports:
  - Agents from /agents
  - Services from /services
  - Routes from /routes
```

---

## Running the Project

### File Usage During Runtime

**Start Backend**
```bash
cd backend
# Runs: src/server.js
# Loads: agents, services, routes
npm run dev
```

**Start Frontend**
```bash
cd frontend
# Builds: src/App.jsx + components
# Loads: from vite.config.js
npm run dev
```

**User Access**
```
Browser → Frontend (App.jsx)
  ↓ Renders components
  ↓ Makes API calls
Backend Server
  ↓ Routes requests
  ↓ Uses services & agents
  ↓ Returns data
Frontend
  ↓ Displays in components
User Sees Result
```

---

## File Sizes (Approximate)

```
Backend:
  agents/        ~30 KB
  routes/        ~4 KB
  services/      ~12 KB
  server.js      ~1 KB
  package.json   ~2 KB
  Subtotal: ~50 KB

Frontend:
  components/    ~20 KB
  App.jsx        ~3 KB
  App.css        ~8 KB
  styles         ~7 KB
  package.json   ~1 KB
  config files   ~2 KB
  Subtotal: ~40 KB

Documentation: ~80 KB

Total: ~170 KB of code & docs
```

---

## Architecture Overview

### Three-Layer Architecture

```
Presentation Layer (React)
├── SearchBar (search input)
├── FilterPanel (filter controls)
├── MapView (Google Maps)
└── RestaurantList/Card (results display)

Application Layer (Express)
├── API Routes (HTTP endpoints)
├── Services (business logic)
└── Data Pipeline (processing)

Agent Layer (AI/ML)
├── Orchestrator (AI coordinator)
├── Location Agent
├── Maps Agent
├── Website Agent
├── Review Agent
└── Dietary Agent
```

---

## Extension Points

### Add New Features
- New agents → Add file to `/backend/src/agents/`
- New routes → Edit `/backend/src/routes/`
- New components → Create in `/frontend/src/components/`
- New data flow → Edit services

### Customize Behavior
- Change colors → Edit CSS files
- Change API → Update agents
- Change ranking → Edit dataProcessing.js
- Change UI → Edit React components

### Deploy Changes
- Edit code
- Commit to GitHub
- Push to production

---

**Everything is organized, documented, and ready to go! 🚀**

Start with [`QUICKSTART.md`](QUICKSTART.md) to get running in 5 minutes.

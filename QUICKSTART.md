# Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-discovery
GOOGLE_API_KEY=AIzaSyAB8Bd87WX51mNeSkkDAb2sfDd4wu_5-Ks
GOOGLE_PLACES_API_KEY=yAIzaSyD1RfZ4-onqnSVPN-tJVGThxWPOTTz3qFs
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

**Frontend** - Create `frontend/.env.local`:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAB8Bd87WX51mNeSkkDAb2sfDd4wu_5-Ks
```

### Step 3: Start the Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Step 4: Open the App

Visit `http://localhost:5173` in your browser and start searching for restaurants!

## How It Works

1. **Enter a location** in the search bar (e.g., "San Francisco, CA")
2. **Adjust filters** (budget, dietary restrictions, minimum rating)
3. **View results** on the interactive Google Map with restaurant pins
4. **Scroll through restaurants** with infinite scroll functionality
5. **Each card shows:**
   - Restaurant name and rating
   - Dietary-suitable menu items
   - Price range and location
   - Dietary restriction compatibility

## Architecture Overview

```
User Search Query
      ↓
Backend API (/api/restaurants)
      ↓
Location Agent → Parse location, get coordinates
      ↓
Google Maps Agent → Query nearby restaurants
      ↓
Restaurant Site Agent → Scrape menus & photos
      ↓
Dietary Filter Agent → Match dietary needs
      ↓
Review Agent → Aggregate ratings
      ↓
Data Pipeline → Deduplicate, validate, rank
      ↓
Frontend → Display on map + infinite scroll list
```

## Testing the Agents

To see the AI orchestration in action:

```bash
curl -X POST http://localhost:5000/api/search/ai-orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "location": "San Francisco, CA",
    "budget": "mid",
    "dietary": ["vegan"],
    "rating": 4.0
  }'
```

## Customization Options

### Change Color Scheme
Edit `frontend/src/App.css` and update the color values:
- `#2d3436` - Primary dark color
- `#fafafa` - Background color
- `#e8e8e8` - Border/divider color

### Add More Dietary Options
In `frontend/src/components/FilterPanel.jsx`, update the `dietaryOptions` array:
```javascript
const dietaryOptions = [
  'Vegan',
  'Vegetarian',
  // Add more here
]
```

### Adjust Ranking Weights
In `backend/src/services/dataProcessing.js`, modify the `rankRestaurants()` method to change how restaurants are scored.

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` in both folders |
| API key errors | Verify keys are in `.env` files and API is enabled |
| Port already in use | Change PORT in `.env` or kill existing process |
| CORS errors | Ensure frontend proxy is configured in `vite.config.js` |
| Maps not showing | Check Google Maps API is enabled and key is correct |

## Next Steps

1. ✅ Deploy backend to cloud (Heroku, Railway, Render)
2. ✅ Deploy frontend to Vercel or Netlify
3. ✅ Add user authentication
4. ✅ Set up MongoDB for production
5. ✅ Implement restaurant booking integration
6. ✅ Add more review platforms (Yelp, TripAdvisor)

## API Reference

### Search Restaurants
```
POST /api/restaurants
Query params: location, budget, dietary[], rating, page, limit
```

### Get Agents Status
```
GET /api/search/agents
Returns: List of active agents and their purposes
```

### AI Orchestration Plan
```
POST /api/search/ai-orchestrate
Returns: AI-generated plan for finding restaurants
```

---

Happy restaurant hunting! 🍽️

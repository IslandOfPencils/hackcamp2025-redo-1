# Restaurant Discovery - AI-Powered Web App

A modern, full-stack web application that uses agentic AI to help users discover restaurants based on their location, budget, dietary restrictions, and ratings. The app features an upscale minimalist design with an embedded Google Maps interface and infinite-scroll restaurant listings.

## Features

✨ **Core Features**
- **Location Search** - Find restaurants by entering any location
- **Advanced Filters** - Budget ($, $$, $$$), dietary restrictions, minimum rating
- **Google Maps Integration** - Interactive map with restaurant pins and real-time location display
- **Infinite Scroll** - Smooth, continuous restaurant listing with pagination
- **Dietary Matching** - AI-powered detection of suitable menu items based on dietary restrictions

🤖 **AI-Powered Backend**
- **Agentic AI Orchestration** - Gemini 2.5 Flash model coordinates multiple specialized agents
- **Location Agent** - Geocoding and restaurant district identification
- **Google Maps Agent** - Places API queries and detailed scraping
- **Restaurant Site Agent** - Web scraping for menus, photos, and dietary info
- **Review Agent** - Multi-platform rating aggregation
- **Dietary Filter Agent** - Allergen detection and menu analysis

## Tech Stack

**Frontend**
- React 18
- Vite (fast build tool)
- Google Maps API JavaScript Client
- CSS3 (Flexbox & Grid)

**Backend**
- Node.js + Express.js
- Google Generative AI (Gemini 2.5 Flash)
- Google Places API
- Puppeteer (for web scraping)
- Cheerio (HTML parsing)

**Database & Caching**
- MongoDB (optional, for production)
- In-memory cache for search results

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Google API Key (for Maps and Places)
- Gemini API Key (for AI agents)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your API keys to `.env`:**
   ```
   GOOGLE_API_KEY=your_google_maps_api_key
   GOOGLE_PLACES_API_KEY=yAIzaSyD1RfZ4-onqnSVPN-tJVGThxWPOTTz3qFs
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (from project root):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or next available port)

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── agents/           # AI agent implementations
│   │   │   ├── orchestrator.js       # Main AI orchestration logic
│   │   │   ├── locationAgent.js      # Location parsing & geocoding
│   │   │   ├── mapsAgent.js          # Google Places API queries
│   │   │   ├── restaurantSiteAgent.js # Web scraping
│   │   │   ├── reviewAgent.js        # Rating aggregation
│   │   │   └── dietaryAgent.js       # Dietary filtering
│   │   ├── routes/           # API route handlers
│   │   │   ├── search.js    # Search endpoint
│   │   │   └── restaurants.js # Restaurant details endpoint
│   │   ├── services/         # Business logic
│   │   │   ├── searchService.js      # Core search orchestration
│   │   │   └── dataProcessing.js     # Deduplication, validation, ranking
│   │   └── server.js         # Express app initialization
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── SearchBar.jsx      # Location search input
│   │   │   ├── FilterPanel.jsx    # Filter controls
│   │   │   ├── MapView.jsx        # Google Maps embed
│   │   │   ├── RestaurantList.jsx # Infinite scroll list
│   │   │   └── RestaurantCard.jsx # Restaurant card component
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── .gitignore
```

## API Endpoints

### Search Restaurants
```
POST /api/search/restaurants
Body: {
  location: string (required)
  budget: "budget" | "mid" | "upscale" (optional)
  dietary: string[] (optional)
  minRating: number (optional)
}
Response: {
  restaurants: Restaurant[]
  location: { latitude, longitude, name }
  totalResults: number
}
```

### Get Restaurant Details
```
GET /api/restaurants/:placeId
Response: { name, address, rating, photos, reviews, etc. }
```

### Get Agent Status
```
GET /api/search/agents
Response: { total_agents, agents: [] }
```

### AI Orchestration
```
POST /api/search/ai-orchestrate
Body: { location, budget, dietary, rating }
Response: { plan, agents_activated, status }
```

## Design Philosophy

**Upscale Minimalist Aesthetic**
- Clean, spacious layout with ample whitespace
- Muted color palette (grays, whites, dark accents)
- Professional typography (Poppins font)
- Subtle shadows and smooth transitions
- Responsive design for all devices

## Key Features Implementation

### Dietary Restriction Matching
The dietary agent analyzes menu items and restaurant information to:
- Detect allergens (peanuts, dairy, gluten, shellfish, etc.)
- Identify suitable menu items for dietary categories (vegan, vegetarian, keto, etc.)
- Provide compatibility scores for each restaurant
- Generate warnings for potential allergen risks

### Intelligent Ranking
Restaurants are ranked based on:
- User rating (30% weight)
- Dietary compatibility (30% weight)
- Budget match (20% weight)
- Review count (10% weight)
- Distance from search location (10% weight)

### Infinite Scroll Implementation
- Loads 10 restaurants at a time
- Uses Intersection Observer API for performance
- Smooth loading transition
- Shows loading state and end-of-list indicator

## Performance Optimizations

- **Caching**: Search results cached for 1 hour to reduce API calls
- **Lazy Loading**: Restaurant images and details load on demand
- **Intersection Observer**: Efficient infinite scroll without scroll event listeners
- **Debouncing**: Filter changes batched to reduce API requests
- **Image Placeholders**: Placeholder images show while real images load

## Security Considerations

- API keys stored in environment variables (never committed to repo)
- `.env` files added to `.gitignore`
- CORS enabled for frontend-backend communication
- Input validation on search queries

## Future Enhancements

- [ ] User authentication and saved preferences
- [ ] Yelp & TripAdvisor integration for more reviews
- [ ] Restaurant booking integration
- [ ] User reviews and ratings
- [ ] Advanced ML-based dietary matching
- [ ] Real-time price tracking
- [ ] Reservation system integration
- [ ] Mobile app (React Native)

## Troubleshooting

### "API Key Invalid" Error
- Verify your Google Maps and Gemini API keys in `.env`
- Ensure APIs are enabled in Google Cloud Console
- Check API quotas and usage limits

### Maps not displaying
- Confirm Google Maps API Key is valid and has appropriate permissions
- Check browser console for CORS errors
- Ensure `VITE_GOOGLE_MAPS_API_KEY` is set in frontend

### Search returns no results
- Verify location name is valid
- Check if restaurants exist in that area
- Try searching with coordinates instead of address

## License

ISC

## Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Built with AI-powered intelligence for the modern restaurant discoverer.**

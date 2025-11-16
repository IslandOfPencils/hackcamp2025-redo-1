# Architecture & Agent Documentation

## System Architecture

### High-Level Flow
```
┌────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Search Bar  │  │ Filter Panel │  │  Results View        │  │
│  │ (Location)   │  │ (Filters)    │  │ ┌────────────────┐   │  │
│  └──────┬───────┘  └──────┬───────┘  │ │ Google Maps    │   │  │
│         │                 │          │ │ + Pins         │   │  │
│         └─────────────────┼──────────▶ │ ┌──────────────┐│   │  │
│                           │          │ │ Rest List    ││   │  │
│                           │          │ │ (Infinite)   ││   │  │
│                           │          │ └──────────────┘│   │  │
│                           │          └────────────────┘   │  │
└────────────────────┬──────────────────────────────────────┘  │
                     │ HTTP Requests                           │
                     ▼                                         │
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Express)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Route Handlers                                          │  │
│  │  POST /api/search/restaurants                            │  │
│  │  GET  /api/restaurants                                   │  │
│  │  POST /api/search/ai-orchestrate                         │  │
│  │  GET  /api/search/agents                                 │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │  Service Layer (Orchestration)                           │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │ RestaurantSearchService                              ││  │
│  │  │  - Coordinates all agents                            ││  │
│  │  │  - Manages cache                                     ││  │
│  │  │  - Handles errors                                    ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│         ┌─────────────┼─────────────┬──────────────┐             │
│         │             │             │              │             │
│  ┌──────▼──┐  ┌──────▼──┐  ┌──────▼──┐  ┌───────▼───┐          │
│  │   AI    │  │ Location │  │  Maps  │  │  Review   │          │
│  │Orchestr │  │  Agent   │  │  Agent │  │  Agent    │          │
│  │ator     │  └──────────┘  └────────┘  └───────────┘          │
│  │         │                                                     │
│  │ (Gemini │  ┌──────────┐  ┌────────────┐                      │
│  │ 2.5     │  │ Restaurant│  │  Dietary   │                     │
│  │ Flash)  │  │ Site Agent│  │  Filter    │                     │
│  │         │  │           │  │  Agent     │                     │
│  └────┬────┘  └────┬──────┘  └────┬───────┘                    │
│       │             │             │                             │
│       └─────────────┼─────────────┘                             │
│                     │                                           │
│  ┌──────────────────▼──────────────────────────────────────┐  │
│  │  Data Processing Pipeline                              │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ 1. Deduplication (remove duplicates)             │  │  │
│  │  │ 2. Validation (check data quality)               │  │  │
│  │  │ 3. Enrichment (add extra data)                   │  │  │
│  │  │ 4. Ranking (score & sort results)                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────┬───────────────────────────────────────┘  │
│                   │                                           │
│  ┌────────────────▼───────────────────────────────────────┐  │
│  │  Cache Layer                                           │  │
│  │  - 1 hour TTL per search                              │  │
│  │  - Reduces API calls                                  │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                     │ External APIs
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐     ┌───▼──┐    ┌───▼──┐
    │Google│     │Google│    │Google│
    │ Maps │     │Places│    │Genr. │
    │ API  │     │ API  │    │  AI  │
    └──────┘     └──────┘    └──────┘
```

## Agent Specifications

### 1. AI Orchestrator (Master Coordinator)
**Role**: Coordinates all agents and creates execution plan
**Model**: Google Gemini 2.5 Flash
**Inputs**: 
- User search query (location, budget, dietary, rating)
**Outputs**: 
- Agent execution plan
- Task assignments
**Key Functions**:
```javascript
orchestrateSearch(searchQuery) → plan
executeAgentTask(agentName, task) → result
getAgentStatus() → agent list
```

### 2. Location Agent
**Purpose**: Parse user location input and get geographic coordinates
**Inputs**: 
- Location string (e.g., "San Francisco", "123 Main St, NYC")
**Outputs**: 
- Latitude, Longitude
- Formatted address
- Bounds/area information
**API Used**: Google Geocoding API
**Key Methods**:
```javascript
parseLocation(locationQuery) → { lat, lng, address }
identifyRestaurantDistricts(lat, lng, radius) → districts[]
```

### 3. Google Maps Agent
**Purpose**: Query nearby restaurants and get details
**Inputs**: 
- Coordinates (lat/lng)
- Radius (default 5km)
- Filters (budget, rating)
**Outputs**: 
- Restaurant list with details
- Rating, address, phone, website
- Price level, opening hours
**API Used**: Google Places API
**Key Methods**:
```javascript
searchNearbyRestaurants(lat, lng, radius, filters) → restaurants[]
enrichRestaurantData(restaurants, filters) → enriched[]
getRestaurantDetails(placeId) → details{}
```

### 4. Restaurant Site Agent
**Purpose**: Scrape restaurant websites for menus and photos
**Inputs**: 
- Restaurant website URL
**Outputs**: 
- Menu items with prices
- Food photos
- Descriptions
**Tools Used**: Puppeteer (browser automation), Cheerio (HTML parsing)
**Key Methods**:
```javascript
scrapeRestaurantMenu(url) → { menuItems[], photos[] }
extractDietaryInfo(menuItems) → dietaryLabeled[]
scrapePhotos(url) → photos[]
```

### 5. Review Agent
**Purpose**: Aggregate ratings from multiple platforms
**Inputs**: 
- Restaurant name
- Location
- Place ID
**Outputs**: 
- Aggregated rating
- Review count
- Sentiment analysis
**Platforms**: Google Maps, Yelp (placeholder), TripAdvisor (placeholder)
**Key Methods**:
```javascript
aggregateRatings(name, location) → { aggregated, sources }
getGoogleRating(name, location) → rating
getYelpRating(name, location) → rating
extractUserReviews(placeId) → reviews[]
```

### 6. Dietary Filter Agent
**Purpose**: Match restaurants to user dietary needs
**Inputs**: 
- Restaurant data (menu items, descriptions)
- User dietary restrictions/allergies
**Outputs**: 
- Dietary compatibility score (0-100)
- Suitable menu items
- Allergen warnings
- Risk assessment
**Databases**:
```javascript
allergenDatabase = {
  'peanuts': ['peanut', 'pnut', ...],
  'dairy': ['milk', 'cheese', ...],
  // ... 8+ allergen types
}

dietaryCategories = {
  'vegan': [...keywords],
  'vegetarian': [...keywords],
  // ... 5+ dietary types
}
```
**Key Methods**:
```javascript
filterRestaurantsByDietaryNeeds(restaurants, userDietary) → filtered[]
assessDietaryCompatibility(restaurant, userDietary) → score{}
isItemSuitable(menuItem, userDietary) → boolean
analyzeMenuForAllergens(menuData) → analysis{}
```

## Data Processing Pipeline

### Step 1: Deduplication
**Purpose**: Remove duplicate restaurants from multiple sources
**Method**: 
- Normalize restaurant name
- Compare with coordinates
- Keep first occurrence
**Input**: Raw restaurant list
**Output**: Unique restaurants only

### Step 2: Validation
**Purpose**: Ensure data quality
**Checks**:
- Required fields (name, address, coordinates)
- Valid ratings (1-5)
- Data integrity
**Input**: Raw restaurant data
**Output**: Validated restaurants with flags

### Step 3: Enrichment
**Purpose**: Add additional information
**Enrichments**:
- Menu items from website
- Photos
- Dietary scores
- Warnings
**Input**: Validated restaurants
**Output**: Full restaurant profiles

### Step 4: Ranking & Sorting
**Purpose**: Order restaurants by relevance
**Scoring Formula**:
```
Total Score (0-100):
  = (Rating/5 × 30)           // 30% rating weight
  + (Dietary Score/100 × 30)  // 30% dietary match
  + (Budget Match × 20)       // 20% budget alignment
  + (Review Count/100 × 10)   // 10% popularity bonus
  + (Distance Factor × 10)    // 10% proximity bonus
```
**Input**: Validated restaurants
**Output**: Ranked list with scores

## Caching Strategy

### Cache Keys
```
Format: search_{location}_{budget}_{dietary}_{rating}
Example: search_san-francisco_mid_vegan,gluten-free_4.0
```

### TTL (Time-To-Live)
- Default: 1 hour (3600000 ms)
- Configurable per search
- Auto-expiry after TTL

### Cache Flow
```
1. User searches
2. Generate cache key
3. Check if key exists & valid
4. If yes → return cached results
5. If no → run full search
6. Cache results with TTL
7. Return to user
```

## Error Handling

### API Errors
- Google Maps API failures → fallback to empty results
- Gemini API timeout → use cached results if available
- Invalid location → show user-friendly error message

### Scraping Errors
- Website structure changed → graceful degradation
- Timeout → skip website scraping, use API data
- Permission denied → log and continue

### Data Validation
- Missing required fields → filter out restaurant
- Invalid coordinates → warn user, skip
- Corrupted data → rollback to previous version

## Security Measures

### API Key Protection
- All keys in `.env` files
- Never logged or exposed
- Rotated regularly
- Restricted to specific APIs

### Input Validation
- Sanitize location strings
- Validate coordinates
- Check array bounds
- Prevent SQL injection (using MongoDB)

### Rate Limiting
- Implement per-user rate limits
- Monitor API usage
- Cache frequent queries
- Throttle scraping requests

## Performance Optimizations

### Backend
- Parallel agent execution where possible
- Request caching
- Database indexing (when using MongoDB)
- Async/await for non-blocking operations

### Frontend
- Lazy loading for images
- Virtual scrolling (infinite scroll)
- Intersection Observer API
- Component memoization

### Data
- Limit initial results to 20
- Progressive loading (10 at a time)
- Compress API responses
- CDN for images

---

**This architecture enables fast, intelligent restaurant discovery with minimal API calls and maximum user experience.**

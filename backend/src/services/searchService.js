import AgentOrchestrator from '../agents/orchestrator.js';
import LocationAgent from '../agents/locationAgent.js';
import MapsAgent from '../agents/mapsAgent.js';
import RestaurantSiteAgent from '../agents/restaurantSiteAgent.js';
import ReviewAgent from '../agents/reviewAgent.js';
import DietaryFilterAgent from '../agents/dietaryAgent.js';
import DataProcessingPipeline from './dataProcessing.js';

class RestaurantSearchService {
  constructor() {
    this.orchestrator = new AgentOrchestrator();
    this.locationAgent = new LocationAgent();
    this.mapsAgent = new MapsAgent();
    this.siteAgent = new RestaurantSiteAgent();
    this.reviewAgent = new ReviewAgent();
    this.dietaryAgent = new DietaryFilterAgent();
    this.dataPipeline = new DataProcessingPipeline();
  }

  async searchRestaurants(searchQuery) {
    // Check cache first
    const cacheKey = this.dataPipeline.generateCacheKey(searchQuery);
    const cached = this.dataPipeline.getCacheEntry(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Step 1: Get location coordinates
      const locationData = await this.locationAgent.parseLocation(searchQuery.location);

      // Step 2: Search nearby restaurants using Google Maps
      const restaurants = await this.mapsAgent.searchNearbyRestaurants(
        locationData.latitude,
        locationData.longitude,
        searchQuery.radius || 5000,
        {
          budget: searchQuery.budget,
          minRating: searchQuery.minRating
        }
      );

      // Step 3: Get restaurant details and scrape websites for dietary info
      const enrichedRestaurants = await Promise.all(
        restaurants.slice(0, 20).map(async (restaurant) => {
          try {
            const details = await this.mapsAgent.getRestaurantDetails(restaurant.id);
            return {
              ...restaurant,
              ...details,
              website: details.website || null
            };
          } catch (error) {
            console.error(`Error fetching details for ${restaurant.name}:`, error);
            return restaurant;
          }
        })
      );

      // Step 4: Filter by dietary restrictions
      const dietaryFiltered = await this.dietaryAgent.filterRestaurantsByDietaryNeeds(
        enrichedRestaurants,
        searchQuery.dietary || {}
      );

      // Step 5: Deduplicate and validate
      const deduplicated = await this.dataPipeline.deduplicateRestaurants(dietaryFiltered);
      const validated = await this.dataPipeline.validateRestaurantData(deduplicated);

      // Step 6: Rank restaurants based on user preferences
      const ranked = await this.dataPipeline.rankRestaurants(validated, {
        budget: searchQuery.budget,
        maxDistance: searchQuery.radius
      });

      const result = {
        location: locationData,
        restaurants: ranked,
        totalResults: ranked.length,
        searchQuery,
        timestamp: new Date().toISOString(),
        cached: false
      };

      // Cache the results
      this.dataPipeline.setCacheEntry(cacheKey, result, 3600000); // 1 hour cache

      return result;
    } catch (error) {
      console.error('Restaurant search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async getRestaurantDetails(placeId) {
    try {
      const details = await this.mapsAgent.getRestaurantDetails(placeId);
      return {
        ...details,
        reviews: details.reviews || [],
        photos: details.photos || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw error;
    }
  }

  async activateAIAgents(searchQuery) {
    // Get AI-powered orchestration plan
    const plan = await this.orchestrator.orchestrateSearch(searchQuery);
    return plan;
  }

  getAgentStatus() {
    return this.orchestrator.getAgentStatus();
  }
}

export default RestaurantSearchService;

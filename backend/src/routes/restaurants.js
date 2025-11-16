import express from 'express';
import RestaurantSearchService from '../services/searchService.js';

const router = express.Router();
const searchService = new RestaurantSearchService();

// Get restaurant details by place ID
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const details = await searchService.getRestaurantDetails(placeId);
    res.json(details);
  } catch (error) {
    console.error('Details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get nearby restaurants with pagination for infinite scroll
router.get('/', async (req, res) => {
  try {
    const { location, budget, dietary, rating, page = 0, limit = 20 } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter required' });
    }

    const dietaryArray = dietary ? (Array.isArray(dietary) ? dietary : [dietary]) : [];
    
    const searchQuery = {
      location,
      budget,
      dietary: dietaryArray,
      minRating: rating ? parseInt(rating) : 0
    };

    const results = await searchService.searchRestaurants(searchQuery);
    
    // Handle pagination
    const startIdx = page * limit;
    const endIdx = startIdx + limit;
    const paginatedRestaurants = results.restaurants.slice(startIdx, endIdx);

    res.json({
      ...results,
      restaurants: paginatedRestaurants,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: endIdx < results.restaurants.length
    });
  } catch (error) {
    console.error('Restaurants error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import RestaurantSearchService from '../services/searchService.js';

const router = express.Router();
const searchService = new RestaurantSearchService();

// Search restaurants
router.post('/restaurants', async (req, res) => {
  try {
    const searchQuery = req.body;

    // Validate required fields
    if (!searchQuery.location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const results = await searchService.searchRestaurants(searchQuery);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI agents status
router.get('/agents', (req, res) => {
  try {
    const status = searchService.getAgentStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate AI agents for specific search
router.post('/ai-orchestrate', async (req, res) => {
  try {
    const searchQuery = req.body;
    const plan = await searchService.activateAIAgents(searchQuery);
    res.json(plan);
  } catch (error) {
    console.error('Orchestration error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

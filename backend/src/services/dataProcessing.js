class DataProcessingPipeline {
  constructor() {
    this.cache = new Map();
  }

  async deduplicateRestaurants(restaurants) {
    const seen = new Set();
    const deduplicated = [];

    restaurants.forEach(restaurant => {
      // Create a normalized key based on name and location
      const key = this.normalizeRestaurantName(restaurant.name) + 
                  '_' + 
                  Math.round(restaurant.latitude * 10000) + 
                  '_' + 
                  Math.round(restaurant.longitude * 10000);

      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(restaurant);
      }
    });

    return deduplicated;
  }

  normalizeRestaurantName(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');
  }

  async validateRestaurantData(restaurants) {
    return restaurants.map(restaurant => {
      const validation = {
        isValid: true,
        errors: [],
        warnings: []
      };

      // Check required fields
      if (!restaurant.name) {
        validation.isValid = false;
        validation.errors.push('Missing name');
      }

      if (!restaurant.latitude || !restaurant.longitude) {
        validation.isValid = false;
        validation.errors.push('Missing location coordinates');
      }

      // Check for data quality
      if (!restaurant.rating || restaurant.rating < 1 || restaurant.rating > 5) {
        validation.warnings.push('Invalid or missing rating');
      }

      if (!restaurant.address) {
        validation.warnings.push('Missing address');
      }

      return {
        ...restaurant,
        validation
      };
    }).filter(r => r.validation.isValid);
  }

  async enrichRestaurantData(restaurants, menuData, dietaryAssessments) {
    return restaurants.map((restaurant, idx) => {
      const menuInfo = menuData[idx] || {};
      const dietaryInfo = dietaryAssessments[idx] || {};

      return {
        ...restaurant,
        menu: menuInfo.menuItems || [],
        photos: menuInfo.photos || [],
        dietaryScore: dietaryInfo.dietaryScore || 0,
        suitableItems: dietaryInfo.suitableItems || [],
        warnings: dietaryInfo.warnings || [],
        enrichedAt: new Date().toISOString()
      };
    });
  }

  async rankRestaurants(restaurants, userPreferences) {
    return restaurants.map(restaurant => {
      let score = 0;

      // Rating score (0-30 points)
      if (restaurant.rating) {
        score += (restaurant.rating / 5) * 30;
      }

      // Dietary compatibility score (0-30 points)
      if (restaurant.dietaryScore) {
        score += (restaurant.dietaryScore / 100) * 30;
      }

      // Budget match (0-20 points)
      if (userPreferences.budget) {
        const budgetMatch = this.evaluateBudgetMatch(restaurant.priceLevel, userPreferences.budget);
        score += budgetMatch * 20;
      }

      // Review count bonus (0-10 points)
      if (restaurant.reviews) {
        const reviewBonus = Math.min(restaurant.reviews / 100, 1);
        score += reviewBonus * 10;
      }

      // Distance penalty (0-10 points)
      if (userPreferences.maxDistance && restaurant.distance) {
        const distancePenalty = Math.max(0, 1 - (restaurant.distance / userPreferences.maxDistance));
        score += distancePenalty * 10;
      }

      return {
        ...restaurant,
        relevanceScore: Math.round(score),
        rank: 0 // Will be set after sorting
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((r, idx) => ({
      ...r,
      rank: idx + 1
    }));
  }

  evaluateBudgetMatch(priceLevel, userBudget) {
    const budgetMap = {
      'budget': [1],
      'mid': [2, 3],
      'upscale': [4]
    };

    const allowedLevels = budgetMap[userBudget] || [1, 2, 3, 4];
    return allowedLevels.includes(priceLevel) ? 1 : 0.5;
  }

  setCacheEntry(key, data, ttl = 3600000) {
    // TTL in milliseconds (default 1 hour)
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }

  getCacheEntry(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  generateCacheKey(searchQuery) {
    const { location, budget, dietary, rating } = searchQuery;
    return `search_${location}_${budget}_${dietary?.join(',')}_${rating}`;
  }
}

export default DataProcessingPipeline;

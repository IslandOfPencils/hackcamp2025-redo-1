import axios from 'axios';

class MapsAgent {
  async searchNearbyRestaurants(latitude, longitude, radius = 5000, filters = {}) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${latitude},${longitude}`,
          radius: radius,
          type: 'restaurant',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      });

      return this.enrichRestaurantData(response.data.results, filters);
    } catch (error) {
      console.error('Maps search error:', error);
      throw error;
    }
  }

  enrichRestaurantData(restaurants, filters) {
    return restaurants
      .filter(restaurant => this.matchesFilters(restaurant, filters))
      .map(restaurant => ({
        id: restaurant.place_id,
        name: restaurant.name,
        address: restaurant.vicinity,
        latitude: restaurant.geometry.location.lat,
        longitude: restaurant.geometry.location.lng,
        rating: restaurant.rating || null,
        reviews: restaurant.user_ratings_total || 0,
        types: restaurant.types || [],
        photos: restaurant.photos?.map(p => p.photo_reference) || [],
        openNow: restaurant.opening_hours?.open_now,
        priceLevel: restaurant.price_level || 0,
        raw: restaurant
      }));
  }

  matchesFilters(restaurant, filters) {
    // Budget filter
    if (filters.budget && restaurant.price_level) {
      if (filters.budget === 'budget' && restaurant.price_level > 2) return false;
      if (filters.budget === 'mid' && (restaurant.price_level < 2 || restaurant.price_level > 3)) return false;
      if (filters.budget === 'upscale' && restaurant.price_level < 3) return false;
    }

    // Rating filter
    if (filters.minRating && restaurant.rating < filters.minRating) return false;

    return true;
  }

  async getRestaurantDetails(placeId) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_PLACES_API_KEY,
          fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,review,photos,price_level,types'
        }
      });

      return response.data.result;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  }
}

export default MapsAgent;

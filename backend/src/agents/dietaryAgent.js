class DietaryFilterAgent {
  constructor() {
    this.allergenDatabase = {
      'peanuts': ['peanut', 'pnut', 'arachis oil'],
      'tree nuts': ['almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'hazelnut'],
      'dairy': ['milk', 'cheese', 'butter', 'cream', 'lactose'],
      'gluten': ['wheat', 'barley', 'rye', 'gluten'],
      'soy': ['soy', 'soybean', 'edamame'],
      'shellfish': ['shrimp', 'crab', 'lobster', 'oyster', 'clam', 'mussel'],
      'fish': ['salmon', 'tuna', 'cod', 'anchovies'],
      'eggs': ['egg', 'mayonnaise']
    };

    this.dietaryCategories = {
      vegan: ['plant-based', 'no animal products'],
      vegetarian: ['no meat', 'meatless'],
      pescatarian: ['no meat', 'fish allowed'],
      keto: ['low carb', 'high fat', 'no sugar'],
      paleo: ['no grain', 'no dairy', 'no processed']
    };
  }

  async filterRestaurantsByDietaryNeeds(restaurants, userDietary) {
    return restaurants.map(restaurant => {
      const compatibility = this.assessDietaryCompatibility(restaurant, userDietary);
      return {
        ...restaurant,
        dietaryScore: compatibility.score,
        suitableItems: compatibility.suitableItems,
        warnings: compatibility.warnings
      };
    }).sort((a, b) => b.dietaryScore - a.dietaryScore);
  }

  assessDietaryCompatibility(restaurant, userDietary) {
    let score = 100;
    const suitableItems = [];
    const warnings = [];

    // Check if restaurant has suitable items
    if (restaurant.menuItems) {
      restaurant.menuItems.forEach(item => {
        const isSuitable = this.isItemSuitable(item, userDietary);
        if (isSuitable) {
          suitableItems.push(item.name);
        }
      });
    }

    // If no suitable items found, reduce score
    if (suitableItems.length === 0 && userDietary.length > 0) {
      score -= 50;
      warnings.push('No known suitable items found - manual verification recommended');
    }

    // Check for allergen risks
    if (restaurant.allergenInfo) {
      Object.entries(userDietary).forEach(([allergen, value]) => {
        if (value && this.allergenDatabase[allergen]) {
          const allergenPresent = restaurant.allergenInfo.includes(allergen);
          if (allergenPresent) {
            score -= 40;
            warnings.push(`Allergen warning: ${allergen} may be present`);
          }
        }
      });
    }

    return {
      score: Math.max(0, score),
      suitableItems,
      warnings
    };
  }

  isItemSuitable(menuItem, userDietary) {
    const itemText = (menuItem.name + ' ' + (menuItem.description || '')).toLowerCase();

    // Check for incompatible items first
    for (const [allergen, keywords] of Object.entries(this.allergenDatabase)) {
      if (userDietary[allergen]) {
        if (keywords.some(keyword => itemText.includes(keyword))) {
          return false;
        }
      }
    }

    // Check for dietary category compatibility
    for (const [dietary, keywords] of Object.entries(this.dietaryCategories)) {
      if (userDietary[dietary]) {
        if (keywords.some(keyword => itemText.includes(keyword))) {
          return true;
        }
      }
    }

    return true;
  }

  async analyzeMenuForAllergens(menuData) {
    const analysis = {
      detectedAllergens: [],
      safeItems: [],
      riskItems: [],
      allergenCertifications: []
    };

    menuData.items?.forEach(item => {
      Object.entries(this.allergenDatabase).forEach(([allergen, keywords]) => {
        if (keywords.some(keyword => item.description?.toLowerCase().includes(keyword))) {
          analysis.detectedAllergens.push(allergen);
          analysis.riskItems.push(item.name);
        }
      });
    });

    return analysis;
  }
}

export default DietaryFilterAgent;

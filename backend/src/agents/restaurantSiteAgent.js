import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

class RestaurantSiteAgent {
  async scrapeRestaurantMenu(restaurantUrl) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(restaurantUrl, { waitUntil: 'networkidle2' });
      
      const pageContent = await page.content();
      await browser.close();

      const $ = cheerio.load(pageContent);
      
      // Extract menu items (this is generic and needs refinement per restaurant)
      const menuItems = [];
      $('[class*="menu"], [class*="item"], [class*="dish"]').each((i, elem) => {
        const name = $(elem).find('[class*="name"], h3, h4').text().trim();
        const price = $(elem).find('[class*="price"], .price').text().trim();
        const description = $(elem).find('[class*="description"], p').text().trim();
        
        if (name) {
          menuItems.push({
            name,
            price,
            description,
            element: i
          });
        }
      });

      return {
        url: restaurantUrl,
        menuItems,
        pageTitle: $('title').text(),
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Menu scraping error:', error);
      // Graceful fallback - return empty menu
      return {
        url: restaurantUrl,
        menuItems: [],
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  extractDietaryInfo(menuItems) {
    const dietaryLabels = {
      vegan: ['vegan', 'plant-based', 'no animal'],
      vegetarian: ['vegetarian', 'no meat'],
      glutenFree: ['gluten-free', 'gf', 'no gluten'],
      dairyFree: ['dairy-free', 'no dairy', 'vegan'],
      nutFree: ['nut-free', 'no nuts'],
      spicyWarning: ['spicy', 'hot', 'thai chili']
    };

    return menuItems.map(item => {
      const text = (item.name + ' ' + item.description).toLowerCase();
      const dietary = {};

      Object.entries(dietaryLabels).forEach(([key, labels]) => {
        dietary[key] = labels.some(label => text.includes(label));
      });

      return {
        ...item,
        dietary
      };
    });
  }

  async scrapePhotos(restaurantUrl) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(restaurantUrl, { waitUntil: 'networkidle2' });
      
      const photos = await page.$$eval('img', images => 
        images
          .map(img => ({
            src: img.src || img.getAttribute('data-src'),
            alt: img.alt
          }))
          .filter(p => p.src && (p.src.includes('food') || p.src.includes('menu') || p.src.includes('dish')))
      );

      await browser.close();
      return photos;
    } catch (error) {
      console.error('Photo scraping error:', error);
      return [];
    }
  }
}

export default RestaurantSiteAgent;

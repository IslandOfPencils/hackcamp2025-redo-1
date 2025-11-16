import React from 'react'
import './RestaurantCard.css'

function RestaurantCard({ restaurant }) {
  const getDietaryBadges = () => {
    const badges = []
    if (restaurant.dietary) {
      Object.entries(restaurant.dietary).forEach(([key, value]) => {
        if (value) badges.push(key)
      })
    }
    return badges
  }

  const getPriceDisplay = () => {
    const levels = ['', '$', '$$', '$$$', '$$$$']
    return levels[restaurant.priceLevel] || 'N/A'
  }

  return (
    <div className="restaurant-card">
      <div className="card-image-container">
        {restaurant.photos && restaurant.photos.length > 0 ? (
          <div className="card-image" style={{
            backgroundImage: `url(https://via.placeholder.com/300x200?text=${encodeURIComponent(restaurant.name)})`
          }}></div>
        ) : (
          <div className="card-image placeholder"></div>
        )}
        {restaurant.priceLevel && (
          <div className="price-badge">{getPriceDisplay()}</div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{restaurant.name}</h3>

        <div className="card-meta">
          {restaurant.rating && (
            <span className="rating">
              ⭐ {restaurant.rating.toFixed(1)}
              {restaurant.reviews && <span className="reviews">({restaurant.reviews})</span>}
            </span>
          )}
        </div>

        {restaurant.address && (
          <p className="card-address">{restaurant.address}</p>
        )}

        {getDietaryBadges().length > 0 && (
          <div className="dietary-badges">
            {getDietaryBadges().slice(0, 3).map(badge => (
              <span key={badge} className="dietary-badge">
                {badge}
              </span>
            ))}
            {getDietaryBadges().length > 3 && (
              <span className="dietary-badge more">
                +{getDietaryBadges().length - 3}
              </span>
            )}
          </div>
        )}

        {restaurant.suitableItems && restaurant.suitableItems.length > 0 && (
          <div className="suitable-items">
            <p className="items-label">Suitable items:</p>
            <ul>
              {restaurant.suitableItems.slice(0, 3).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <a href="#" className="view-details">View Details →</a>
      </div>
    </div>
  )
}

export default RestaurantCard

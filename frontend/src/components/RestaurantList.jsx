import React, { useState, useEffect, useRef, useCallback } from 'react'
import RestaurantCard from './RestaurantCard'
import './RestaurantList.css'

function RestaurantList({ restaurants }) {
  const [displayedCount, setDisplayedCount] = useState(10)
  const observerTarget = useRef(null)

  const handleInfiniteScroll = useCallback(() => {
    if (displayedCount < restaurants.length) {
      setDisplayedCount(prev => Math.min(prev + 10, restaurants.length))
    }
  }, [displayedCount, restaurants.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleInfiniteScroll()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [handleInfiniteScroll])

  const displayedRestaurants = restaurants.slice(0, displayedCount)

  return (
    <div className="restaurant-list">
      <div className="list-header">
        <h2>Results</h2>
        <p className="result-count">Showing {displayedCount} of {restaurants.length}</p>
      </div>

      <div className="restaurants-grid">
        {displayedRestaurants.map(restaurant => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant}
          />
        ))}
      </div>

      {displayedCount < restaurants.length && (
        <div ref={observerTarget} className="scroll-trigger">
          <p>Loading more restaurants...</p>
        </div>
      )}

      {displayedCount >= restaurants.length && restaurants.length > 0 && (
        <div className="end-of-list">
          <p>You've seen all {restaurants.length} restaurants</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantList

import React, { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import MapView from './components/MapView'
import RestaurantList from './components/RestaurantList'

function App() {
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    budget: null,
    dietary: [],
    rating: 0
  })
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })

  const handleSearch = async (location) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/restaurants', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          budget: searchQuery.budget,
          dietary: searchQuery.dietary,
          minRating: searchQuery.rating
        })
      })

      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setRestaurants(data.restaurants || [])
      setMapCenter({ lat: data.location.latitude, lng: data.location.longitude })
      setSearchQuery(prev => ({ ...prev, location }))
    } catch (err) {
      setError(err.message)
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    setSearchQuery(filters)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Restaurant Discovery</h1>
          <p className="tagline">Find restaurants tailored to your taste</p>
        </div>
      </header>

      <div className="main-container">
        <SearchBar onSearch={handleSearch} loading={loading} />

        <div className="content-wrapper">
          <aside className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
            <button 
              className="filter-close-btn"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
            <FilterPanel 
              onFilterChange={handleFilterChange}
              currentFilters={searchQuery}
            />
          </aside>

          <div className="content-main">
            {error && <div className="error-message">{error}</div>}

            {restaurants.length > 0 && (
              <div className="results-container">
                <button 
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(true)}
                >
                  ⚙️ Filters
                </button>

                <MapView 
                  restaurants={restaurants}
                  center={mapCenter}
                  googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                />

                <RestaurantList restaurants={restaurants} />
              </div>
            )}

            {!loading && restaurants.length === 0 && searchQuery.location && (
              <div className="no-results">
                <p>No restaurants found. Try adjusting your filters.</p>
              </div>
            )}

            {!searchQuery.location && (
              <div className="landing-message">
                <p>Search for a location to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

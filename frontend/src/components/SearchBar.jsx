import React, { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, loading }) {
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (location.trim()) {
      onSearch(location)
    }
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Enter location (e.g., San Francisco, 123 Main St)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !location.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default SearchBar

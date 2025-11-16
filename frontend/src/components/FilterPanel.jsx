import React, { useState } from 'react'
import './FilterPanel.css'

function FilterPanel({ onFilterChange, currentFilters }) {
  const [filters, setFilters] = useState({
    budget: currentFilters.budget || null,
    dietary: currentFilters.dietary || [],
    rating: currentFilters.rating || 0
  })

  const dietaryOptions = [
    'Vegan',
    'Vegetarian',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Kosher',
    'Halal',
    'Keto'
  ]

  const budgetOptions = [
    { value: 'budget', label: '$' },
    { value: 'mid', label: '$$' },
    { value: 'upscale', label: '$$$' }
  ]

  const handleBudgetChange = (value) => {
    const newFilters = { ...filters, budget: filters.budget === value ? null : value }
    setFilters(newFilters)
    onFilterChange({ ...currentFilters, ...newFilters })
  }

  const handleDietaryChange = (diet) => {
    let newDietary = filters.dietary.includes(diet)
      ? filters.dietary.filter(d => d !== diet)
      : [...filters.dietary, diet]
    
    const newFilters = { ...filters, dietary: newDietary }
    setFilters(newFilters)
    onFilterChange({ ...currentFilters, ...newFilters })
  }

  const handleRatingChange = (value) => {
    const newFilters = { ...filters, rating: value }
    setFilters(newFilters)
    onFilterChange({ ...currentFilters, ...newFilters })
  }

  return (
    <div className="filter-panel">
      <h2 className="filter-title">Filters</h2>

      <div className="filter-group">
        <label className="filter-label">Budget</label>
        <div className="budget-options">
          {budgetOptions.map(option => (
            <button
              key={option.value}
              className={`budget-btn ${filters.budget === option.value ? 'active' : ''}`}
              onClick={() => handleBudgetChange(option.value)}
              title={option.label}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <div className="rating-slider-container">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
            className="rating-slider"
          />
          <span className="rating-value">
            {filters.rating > 0 ? `${filters.rating}+ ⭐` : 'Any'}
          </span>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Dietary Restrictions</label>
        <div className="dietary-list">
          {dietaryOptions.map(option => (
            <label key={option} className="dietary-checkbox">
              <input
                type="checkbox"
                checked={filters.dietary.includes(option)}
                onChange={() => handleDietaryChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="reset-filters" onClick={() => {
        const resetFilters = { budget: null, dietary: [], rating: 0 }
        setFilters(resetFilters)
        onFilterChange({ ...currentFilters, ...resetFilters })
      }}>
        Reset Filters
      </button>
    </div>
  )
}

export default FilterPanel

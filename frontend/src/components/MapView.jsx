import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import './MapView.css'

function MapView({ restaurants, center, googleMapsApiKey }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      const loader = new Loader({
        apiKey: googleMapsApiKey || process.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps')
      const { Marker } = await loader.importLibrary('marker')

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // Create map
      const map = new Map(mapRef.current, {
        zoom: 13,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Add markers for restaurants
      restaurants.forEach(restaurant => {
        const marker = new Marker({
          map: map,
          position: {
            lat: restaurant.latitude,
            lng: restaurant.longitude
          },
          title: restaurant.name
        })

        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-family: Poppins;">
                <h3 style="margin: 0 0 5px 0; font-size: 14px;">${restaurant.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${restaurant.address || 'Address not available'}</p>
                ${restaurant.rating ? `<p style="margin: 5px 0 0 0; font-size: 12px;">⭐ ${restaurant.rating}</p>` : ''}
              </div>
            `
          })
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
      })
    }

    initMap().catch(err => console.error('Map initialization error:', err))
  }, [restaurants, center, googleMapsApiKey])

  return (
    <div className="map-container">
      <div ref={mapRef} className="map"></div>
      <p className="map-caption">{restaurants.length} restaurants found</p>
    </div>
  )
}

export default MapView

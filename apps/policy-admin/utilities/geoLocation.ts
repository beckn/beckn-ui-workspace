import { GeoCoordinate } from '@lib/types/geofence'

export const GeoLocations = [
  {
    country: {
      countryNmae: 'India',
      cities: [
        { name: 'Banglore', id: 'Banglore' },
        { name: 'Delhi', id: 'D' },
        { name: 'Mumbai', id: 'Mumbai' },
        { name: 'Chennai', id: 'Chennai' },
        { name: 'Hyderabad', id: 'Hyderabad' },
        { name: 'Pune', id: 'Pune' },
        { name: 'Ahmedabad', id: 'Ahmedabad' },
        { name: 'Visakhapatnam', id: 'Visakhapatnam' },
        { name: 'Jaipur', id: 'Jaipur' },
        { name: 'Noida', id: 'Noida' }
      ]
    }
  },
  {
    country: {
      countryNmae: 'USA',
      cities: [
        { name: 'New York', id: ' New York' },
        { name: 'Los Angeles', id: 'Los Angeles' },
        { name: 'Boston', id: 'Boston' },
        { name: 'Washington', id: 'Washington' },
        { name: 'Chicago', id: 'Chicago' },
        { name: 'Houston', id: ' Houston' },
        { name: 'Phoenix', id: 'Phoenix' },
        { name: 'Philadelphia', id: 'Philadelphia' },
        { name: 'San Antonio', id: 'San Antonio' },
        { name: 'San Diego', id: 'San Diego' },
        { name: 'Dallas', id: 'Dallas' },
        { name: 'San Jose, Calif', id: 'San Jose, Calif' }
      ]
    }
  },
  {
    country: {
      countryNmae: 'Egypt',
      cities: [
        { name: 'Alexandria', id: 'Alexandria' },
        { name: 'Cairo', id: 'Cairo' },
        { name: ' Luxor', id: ' Luxor' },
        { name: ' Aswan', id: ' Aswan' },
        { name: 'Cairo', id: 'Cairo' },
        { name: 'Suez', id: 'Suez' },
        { name: 'Damietta', id: 'Damietta' },
        { name: 'Minya', id: 'Minya' },
        { name: 'Ismailia', id: 'Ismailia' },
        { name: 'Sohag', id: 'Sohag' }
      ]
    }
  }
]

export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  banglore: { lat: 12.9716, lng: 77.5946 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  noida: { lat: 28.5355, lng: 77.391 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  houston: { lat: 29.7604, lng: -95.3698 },
  phoenix: { lat: 33.4484, lng: -112.074 },
  philadelphia: { lat: 39.9526, lng: -75.1652 },
  'san antonio': { lat: 29.4241, lng: -98.4936 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  dallas: { lat: 32.7767, lng: -96.797 },
  'san jose, calif': { lat: 37.3382, lng: -121.8863 },
  alexandria: { lat: 31.2001, lng: 29.9187 },
  cairo: { lat: 30.0444, lng: 31.2357 },
  luxor: { lat: 25.6872, lng: 32.6396 },
  aswan: { lat: 24.0889, lng: 32.8998 },
  suez: { lat: 30.0146, lng: 32.5478 },
  damietta: { lat: 31.4165, lng: 31.8133 },
  minya: { lat: 28.1099, lng: 30.7503 },
  ismailia: { lat: 30.6043, lng: 32.2723 },
  sohag: { lat: 26.556, lng: 31.6948 }
}

export const calculateCenterOfPolygon = (coordinates: GeoCoordinate[]) => {
  const totalPoints = coordinates.length

  // Summing all latitudes and longitudes
  const sum = coordinates.reduce(
    (acc, point) => {
      acc.lat += point.lat
      acc.lng += point.lng
      return acc
    },
    { lat: 0, lng: 0 }
  )

  // Calculate the average latitude and longitude
  const center = {
    lat: sum.lat / totalPoints,
    lng: sum.lng / totalPoints
  }

  return center.lat ? center : null
}

export const getGeoFenceCoords = (coords: string[]) => {
  return coords.map(item => {
    const latLong = item.split(', ')
    return {
      lat: Number(latLong[0]),
      lng: Number(latLong[1])
    }
  })
}

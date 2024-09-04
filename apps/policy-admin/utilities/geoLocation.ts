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
  Banglore: { lat: 12.9716, lng: 77.5946 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Noida: { lat: 28.5355, lng: 77.391 },
  'New York': { lat: 40.7128, lng: -74.006 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  Chicago: { lat: 41.8781, lng: -87.6298 },
  Houston: { lat: 29.7604, lng: -95.3698 },
  Phoenix: { lat: 33.4484, lng: -112.074 },
  Philadelphia: { lat: 39.9526, lng: -75.1652 },
  'San Antonio': { lat: 29.4241, lng: -98.4936 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  Dallas: { lat: 32.7767, lng: -96.797 },
  'San Jose, Calif': { lat: 37.3382, lng: -121.8863 },
  Alexandria: { lat: 31.2001, lng: 29.9187 },
  Cairo: { lat: 30.0444, lng: 31.2357 },
  Luxor: { lat: 25.6872, lng: 32.6396 },
  Aswan: { lat: 24.0889, lng: 32.8998 },
  Suez: { lat: 30.0146, lng: 32.5478 },
  Damietta: { lat: 31.4165, lng: 31.8133 },
  Minya: { lat: 28.1099, lng: 30.7503 },
  Ismailia: { lat: 30.6043, lng: 32.2723 },
  Sohag: { lat: 26.556, lng: 31.6948 }
}

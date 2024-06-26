import { useState, useEffect } from 'react'

interface Coordinates {
  latitude: number
  longitude: number
}

interface GeolocationData {
  coordinates: Coordinates | null
  currentAddress: string
  error: string
  loading: boolean
}

export interface OptionalModel {
  translation: {
    noAddressFound: string
    failedToFetch: string
    fetchAddressData: string
    errorGettingLocation: string
    geoLocationNotAvailable: string
  }
}

const useGeolocation = (apiKey: string, optional?: OptionalModel): GeolocationData => {
  const {
    translation: {
      errorGettingLocation = 'Error getting location: ',
      failedToFetch = 'Failed to fetch address data',
      fetchAddressData = 'Error fetching address data:',
      geoLocationNotAvailable = 'Geolocation is not available in this browser',
      noAddressFound = 'No address found for the given coordinates'
    } = {}
  } = optional! || {}

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (navigator) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            setCoordinates({ latitude, longitude })

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
              )

              if (response.ok) {
                const data = await response.json()

                if (data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address
                  setCurrentAddress(formattedAddress)
                } else {
                  setError(noAddressFound)
                }
              } else {
                setError(failedToFetch)
              }
            } catch (err) {
              setError(fetchAddressData + (err as any).message)
            } finally {
              setLoading(false)
            }
          },
          error => {
            setError(errorGettingLocation + error.message)
            alert(errorGettingLocation + error.message)
            setLoading(false)
          }
        )
      } else {
        setError(geoLocationNotAvailable)
        setLoading(false)
      }
    }
  }, [optional])

  return { coordinates, currentAddress, error, loading }
}

export default useGeolocation

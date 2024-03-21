'use client'

import { useState, useEffect } from 'react'

export interface PositionModel {
  latitude: any
  longitude: any
  accuracy: any
  speed: any
  heading: any
  timestamp: any
}

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0
}

export const usePosition = (watch = false, userSettings = {}) => {
  const settings = {
    ...defaultSettings,
    ...userSettings
  }

  const [position, setPosition] = useState<PositionModel | null>(null)
  const [error, setError] = useState('')

  const onChange = ({ coords, timestamp }: any) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      heading: coords.heading,
      timestamp
    })
  }

  const onError = (error: any) => {
    setError(error.message)
  }

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported')
      return
    }

    if (watch) {
      const watcher = navigator.geolocation.watchPosition(onChange, onError, settings)
      return () => navigator.geolocation.clearWatch(watcher)
    }

    navigator.geolocation.getCurrentPosition(onChange, onError, settings)
  }, [settings.enableHighAccuracy, settings.timeout, settings.maximumAge])

  return { ...position, error }
}

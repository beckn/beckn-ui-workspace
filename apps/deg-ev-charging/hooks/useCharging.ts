import { useState, useEffect } from 'react'

interface ChargingDetails {
  consumedUnits: number
  bookingTime: string
  totalCost: number
  stationId: string
  power: string
  portId: string
}

export const useCharging = () => {
  const [isCharging, setIsCharging] = useState(false)
  const [chargingProgress, setChargingProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(30) // in minutes
  const [chargingDetails, setChargingDetails] = useState<ChargingDetails>({
    consumedUnits: 0,
    bookingTime: new Date().toLocaleTimeString(),
    totalCost: 0,
    stationId: 'ST001',
    power: '7.4 kW',
    portId: 'P001'
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isCharging && chargingProgress < 100) {
      interval = setInterval(() => {
        setChargingProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setIsCharging(false)
            clearInterval(interval)
          }
          return newProgress
        })

        setRemainingTime(prev => Math.max(0, prev - 0.5))
        setChargingDetails(prev => ({
          ...prev,
          consumedUnits: prev.consumedUnits + 0.1,
          totalCost: prev.totalCost + 2
        }))
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isCharging, chargingProgress])

  const startCharging = () => {
    setIsCharging(true)
    setChargingProgress(0)
    setRemainingTime(30)
    setChargingDetails(prev => ({
      ...prev,
      consumedUnits: 0,
      totalCost: 0,
      bookingTime: new Date().toLocaleTimeString()
    }))
  }

  const stopCharging = () => {
    setIsCharging(false)
  }

  return {
    isCharging,
    chargingProgress,
    remainingTime,
    chargingDetails,
    startCharging,
    stopCharging
  }
}

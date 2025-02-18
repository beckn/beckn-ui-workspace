import { useState, useEffect } from 'react'

const useOtpTimer = (initialTime = 4 * 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (timeLeft % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return formatTime()
}

export default useOtpTimer

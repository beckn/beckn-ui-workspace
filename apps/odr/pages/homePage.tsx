import React, { useEffect } from 'react'
import LandingPage from '../components/landingPage/LandingPage'

const Homepage = () => {
  useEffect(() => {
    if (localStorage) {
      const stringifiedBecknSession = localStorage.getItem('garuda_session')
      if (stringifiedBecknSession) {
        const parsedBecknSession = JSON.parse(stringifiedBecknSession)
        localStorage.clear()
        return localStorage.setItem('garuda_session', JSON.stringify(parsedBecknSession))
      }
      localStorage.clear()
    }
  }, [])

  return <LandingPage />
}

export default Homepage

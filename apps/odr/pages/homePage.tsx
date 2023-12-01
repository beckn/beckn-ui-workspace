import React, { useEffect } from 'react'
import LandingPage from '../components/landingPage/LandingPage'

const Homepage = () => {
  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])
  return <LandingPage />
}

export default Homepage

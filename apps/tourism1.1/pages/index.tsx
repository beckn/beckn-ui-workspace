import React, { useEffect } from 'react'
import LandingPage from '@components/landingPage/LandingPage'

const HomePage = () => {
  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  return <LandingPage />
}

export default HomePage

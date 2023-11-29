import React, { useEffect } from 'react'
import Nocases from '../components/noCases/Nocases'
import SignIn from '../components/signIn/SignIn'

const Home = () => {
  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  return (
    <div>
      <SignIn />
    </div>
  )
}

export default Home

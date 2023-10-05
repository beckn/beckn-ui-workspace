import axios from 'axios'
import React, { useEffect } from 'react'
import SignIn from '../components/signIn/SignIn'

const Home = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const googleSignIn = () => {
    window.location.href = `${strapiUrl}/connect/google`
  }
  return (
    <div>
      <SignIn buttonClickHandler={() => googleSignIn()} />
    </div>
  )
}

export default Home

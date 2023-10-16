import React from 'react'
import SignIn from '../components/signIn/SignIn'

const Home = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const googleSignIn = () => {
    window.location.href = `${strapiUrl}/connect/google`
  }
  return (
    <div>
      <SignIn />
    </div>
  )
}

export default Home

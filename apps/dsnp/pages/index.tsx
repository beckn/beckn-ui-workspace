import React from 'react'
import SignIn from '../components/signIn/SignIn'

const Home = () => {
  React.useEffect(() => {
    if (typeof window !== 'undefined') localStorage.clear()
  }, [])

  return (
    <div>
      <SignIn />
    </div>
  )
}

export default Home

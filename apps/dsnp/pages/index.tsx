import React from 'react'
import SignIn from '@components/signIn'

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

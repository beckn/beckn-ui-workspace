import React, { useEffect } from 'react'
import SignIn from '../components/signIn/SignIn'

const Login = () => {
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

export default Login

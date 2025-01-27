import React, { useEffect } from 'react'
import SignIn from '@components/signIn/SignIn'

const Login = () => {
  useEffect(() => {
    localStorage.clear()
  }, [])

  return <SignIn />
}

export default Login

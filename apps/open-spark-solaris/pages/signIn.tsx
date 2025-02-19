import React, { useEffect } from 'react'
import SignIn from '@components/signIn/SignIn'
import Cookies from 'js-cookie'

const Login = () => {
  useEffect(() => {
    Cookies.remove('authToken')
    Cookies.remove('isVerified')
    localStorage.clear()
  }, [])

  return <SignIn />
}

export default Login

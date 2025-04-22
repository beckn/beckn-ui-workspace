import React, { useEffect } from 'react'
import SignUp from '@components/signUp/signUp'
import Cookies from 'js-cookie'

const Register = () => {
  useEffect(() => {
    Cookies.remove('authToken')
    Cookies.remove('isVerified')
  }, [])

  return <SignUp />
}

export default Register

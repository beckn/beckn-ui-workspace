import React, { useEffect } from 'react'
import Router from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import SignUp from '@components/signUp/signUp'
import Cookies from 'js-cookie'

const Register = () => {
  const { t } = useLanguage()

  useEffect(() => {
    Cookies.remove('p2pAuthToken')
    Cookies.remove('isVerified')
  }, [])

  return <SignUp />
}

export default Register

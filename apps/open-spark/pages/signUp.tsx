import React from 'react'
import Router from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import SignUp from '@components/signUp/signUp'

const Register = () => {
  const { t } = useLanguage()

  return <SignUp />
}

export default Register

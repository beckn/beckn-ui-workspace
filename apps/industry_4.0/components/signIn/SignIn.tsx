import React, { useEffect } from 'react'
import Router from 'next/router'
import Suppliflow_logo from '../../public/images/Suppliflow_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPage } from '@beckn-ui/common'

const Login = () => {
  const { t } = useLanguage()

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  return (
    <SignInPage
      logos={{
        mobile: { src: Suppliflow_logo, alt: 'Suppliflow logo' },
        desktop: { src: Suppliflow_logo, alt: 'Suppliflow logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

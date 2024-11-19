import React, { useEffect } from 'react'
import Router from 'next/router'
import harmoniaidsLogo from '@public/images/harmoniaidsLogo.svg'
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
        mobile: { src: harmoniaidsLogo, alt: 'harmoni aids logo', description: t.applicationDescription },
        desktop: { src: harmoniaidsLogo, alt: 'harmoni aids logo', description: t.applicationDescription }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

import React, { useEffect } from 'react'
import Router from 'next/router'
import stateForestLogo from '@public/images/stateForestLogo.svg'
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
        mobile: {
          src: stateForestLogo,
          alt: 'state forest logo',
          description: t.applicationDescription
        },
        desktop: {
          src: stateForestLogo,
          alt: 'state forest  logo',
          description: t.applicationDescription
        }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

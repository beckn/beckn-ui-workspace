import React, { useEffect } from 'react'
import Router from 'next/router'
import envirogrowthMobLogo from '@public/images/envirogrowth-logo.svg'
import nvirogrowDeskLogo from '@public/images/envirogrowth-logo.svg'
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
          src: envirogrowthMobLogo,
          alt: 'envirogrowth logo',
          description: t.applicationDescription
        },
        desktop: {
          src: nvirogrowDeskLogo,
          alt: 'envirogrowth logo',
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

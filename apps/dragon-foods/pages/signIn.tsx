import React, { useEffect } from 'react'
import Router from 'next/router'
import dragonMobLogo from '@public/images/dragonFoodLogo.svg'
import dragonDeskLogo from '@public/images/dragonFoodLogo.svg'
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
          src: dragonMobLogo,
          alt: 'dragon foods logo',
          description: t.applicationDescription
        },
        desktop: {
          src: dragonDeskLogo,
          alt: 'dragon foods logo',
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

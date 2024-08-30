import React, { useEffect } from 'react'
import Router from 'next/router'
import tourismMobLogo from '@public/images/tourism-logo.svg'
import tourismDeskLogo from '@public/images/tourism-logo.svg'
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
        mobile: { src: tourismMobLogo, alt: 'Tourism logo' },
        desktop: { src: tourismDeskLogo, alt: 'Tourism logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

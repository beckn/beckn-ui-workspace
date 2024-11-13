import React, { useEffect } from 'react'
import Router from 'next/router'
import skyAnalyticsMobLogo from '@public/images/skyAnalytics.svg'
import skyAnalyticsDeskLogo from '@public/images/skyAnalytics.svg'
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
        mobile: { src: skyAnalyticsMobLogo, alt: 'sky analytics logo' },
        desktop: { src: skyAnalyticsDeskLogo, alt: 'sky analytics logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

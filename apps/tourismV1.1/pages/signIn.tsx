import React, { useEffect } from 'react'
import Router from 'next/router'
import tourismMobLogo from '@public/images/tourism-logo.svg'
import tourismDeskLogo from '@public/images/tourism-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPage } from '@beckn-ui/common'
import Cookies from 'js-cookie'

const Login = () => {
  const { t } = useLanguage()

  const tourismType = Cookies.get('tourismType')

  const handleSignUp = () => {
    Router.push(`/signUp${tourismType ? `?tourismType=${tourismType}` : ''}`)
  }
  useEffect(() => {
    localStorage.clear()
  }, [])

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

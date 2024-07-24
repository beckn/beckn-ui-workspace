import React, { useEffect } from 'react'
import Router from 'next/router'
import OSCMobLogo from '@public/images/OSC_logo.svg'
import OSCDeskLogo from '@public/images/OSC_logo.svg'
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
        mobile: { src: OSCMobLogo, alt: 'osc logo' },
        desktop: { src: OSCDeskLogo, alt: 'osc logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

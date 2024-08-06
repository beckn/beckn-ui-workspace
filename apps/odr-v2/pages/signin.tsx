import React, { useEffect } from 'react'
import Router from 'next/router'
import ODRLogo from '../public/images/Logo.svg'
import ODRAlternateLogo from '../public/images/Logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPage } from '@beckn-ui/common'

const MobileLogin = () => {
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
        mobile: { src: ODRLogo, alt: 'odr logo' },
        desktop: { src: ODRAlternateLogo, alt: 'odr logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default MobileLogin

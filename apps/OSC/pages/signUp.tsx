import React from 'react'
import Router from 'next/router'
import OSCMobLogo from '@public/images/OSC_logo.svg'
import OSCDeskLogo from '@public/images/OSC_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignUpPage } from '@beckn-ui/common'

const Register = () => {
  const { t } = useLanguage()

  const handleSignIn = () => {
    Router.push('/signIn')
  }

  return (
    <SignUpPage
      baseUrl={process.env.NEXT_PUBLIC_STRAPI_URL!}
      logos={{
        mobile: { src: OSCMobLogo, alt: 'osc logo' },
        desktop: { src: OSCDeskLogo, alt: 'osc logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

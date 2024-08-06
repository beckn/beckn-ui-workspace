import React from 'react'
import Router from 'next/router'
import ODRLogo from '../public/images/Logo.svg'
import ODRAlternateLogo from '../public/images/Logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignUpPage } from '@beckn-ui/common'

const SignUp = () => {
  const { t } = useLanguage()

  const handleSignIn = () => {
    Router.push('/signIn')
  }

  return (
    <SignUpPage
      baseUrl={process.env.NEXT_PUBLIC_STRAPI_URL!}
      logos={{
        mobile: { src: ODRLogo, alt: 'odr logo' },
        desktop: { src: ODRAlternateLogo, alt: 'odr logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default SignUp

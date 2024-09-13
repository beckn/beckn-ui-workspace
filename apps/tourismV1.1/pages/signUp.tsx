import React from 'react'
import Router from 'next/router'
import tourismMobLogo from '@public/images/tourism-logo.svg'
import tourismDeskLogo from '@public/images/tourism-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignUpPage } from '@beckn-ui/common'
import Cookies from 'js-cookie'

const Register = () => {
  const { t } = useLanguage()
  const tourismType = Cookies.get('tourismType')

  const handleSignIn = () => {
    Router.push(`/signIn${tourismType ? `?tourismType=${tourismType}` : ''}`)
  }

  return (
    <SignUpPage
      baseUrl={process.env.NEXT_PUBLIC_STRAPI_URL!}
      logos={{
        mobile: { src: tourismMobLogo, alt: 'Tourism logo' },
        desktop: { src: tourismDeskLogo, alt: 'Tourism logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

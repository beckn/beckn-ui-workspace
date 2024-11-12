import React from 'react'
import Router from 'next/router'
import dragonMobLogo from '@public/images/dragonFoodLogo.svg'
import dragonDeskLogo from '@public/images/dragonFoodLogo.svg'
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
        mobile: { src: dragonMobLogo, alt: 'dragon foods logo' },
        desktop: { src: dragonDeskLogo, alt: 'dragon foods logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

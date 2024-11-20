import React from 'react'
import Router from 'next/router'
import envirogrowthMobLogo from '@public/images/envirogrowth-logo.svg'
import nvirogrowDeskLogo from '@public/images/envirogrowth-logo.svg'
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
        mobile: {
          src: envirogrowthMobLogo,
          alt: 'envirogrowth logo',
          description: t.applicationDescription
        },
        desktop: {
          src: nvirogrowDeskLogo,
          alt: 'envirogrowth logo',
          description: t.applicationDescription
        }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

import React from 'react'
import Router from 'next/router'
import stateForestLogo from '@public/images/stateForestLogo.svg'
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
        mobile: { src: stateForestLogo, alt: 'state Forest logo', description: t.applicationDescription },
        desktop: { src: stateForestLogo, alt: 'state forest logo', description: t.applicationDescription }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

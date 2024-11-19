import React from 'react'
import Router from 'next/router'
import harmoniaidsLogo from '@public/images/harmoniaidsLogo.svg'
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
        mobile: { src: harmoniaidsLogo, alt: 'harmoni aids logo', description: t.applicationDescription },
        desktop: { src: harmoniaidsLogo, alt: 'harmoni aids logo', description: t.applicationDescription }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

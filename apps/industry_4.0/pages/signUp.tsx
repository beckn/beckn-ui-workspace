import React from 'react'
import Router from 'next/router'
import Suppliflow_logo from '../public/images/Suppliflow_logo.svg'
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
        mobile: { src: Suppliflow_logo, alt: 'Suppliflow_logo' },
        desktop: { src: Suppliflow_logo, alt: 'Suppliflow_logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

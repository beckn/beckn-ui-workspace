import React from 'react'
import Router from 'next/router'
// import kuzaMobLogo from '@public/images/Logo.svg'
// import kuzaDeskLogo from '@public/images/KuzaLogo.svg'
import kuzaMobLogo from '@public/images/openCommerce_logo.svg'
import kuzaDeskLogo from '@public/images/openCommerce_logo.svg'
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
        mobile: { src: kuzaMobLogo, alt: 'Kuza logo' },
        desktop: { src: kuzaDeskLogo, alt: 'Kuza logo' }
      }}
      onSignIn={handleSignIn}
      onSignUp={() => {}}
      t={key => t[key]}
    />
  )
}

export default Register

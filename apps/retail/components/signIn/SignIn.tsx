import React from 'react'
import kuzaMobLogo from '../../public/images/Logo.svg'
import kuzaDeskLogo from '../../public/images/KuzaLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import Router from 'next/router'
import { SignInPage } from '@beckn-ui/common'

const SignIn = () => {
  const { t } = useLanguage()

  const handleSignUp = () => {
    Router.push('/signUp')
  }

  return (
    <SignInPage
      logos={{
        mobile: { src: kuzaMobLogo, alt: 'Kuza logo' },
        desktop: { src: kuzaDeskLogo, alt: 'Kuza logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default SignIn

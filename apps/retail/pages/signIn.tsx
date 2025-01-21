import React, { useEffect } from 'react'
import Router from 'next/router'
// import kuzaMobLogo from '@public/images/Logo.svg'
// import kuzaDeskLogo from '@public/images/KuzaLogo.svg'
import kuzaMobLogo from '@public/images/openCommerce_logo.svg'
import kuzaDeskLogo from '@public/images/openCommerce_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPage } from '@beckn-ui/common'

const Login = () => {
  const { t } = useLanguage()

  useEffect(() => {
    localStorage.clear()
  }, [])

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

export default Login

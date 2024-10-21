import { SignInPage } from '@beckn-ui/common'
import React, { useEffect } from 'react'
import energyIcon from '@public/images/flash.svg'
import { useLanguage } from '@hooks/useLanguage'

const Login = () => {
  const { t } = useLanguage()

  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <SignInPage
      logos={{
        mobile: { src: energyIcon, alt: 'open_spark' },
        desktop: { src: energyIcon, alt: 'open_spark' }
      }}
      onSignIn={() => {}}
      onSignUp={() => {}}
      t={key => t[key]}
      enableSignUp={false}
    />
  )
}

export default Login

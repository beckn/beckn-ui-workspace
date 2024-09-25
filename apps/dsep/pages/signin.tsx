import React, { useEffect } from 'react'
import Router from 'next/router'
import SkillUpMobLogo from '@public/images/skillUpHomeLogo.svg'
import SkillUpDeskLogo from '@public/images/skillUpHomeLogo.svg'
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
        mobile: { src: SkillUpMobLogo, alt: 'Kuza logo' },
        desktop: { src: SkillUpDeskLogo, alt: 'Kuza logo' }
      }}
      onSignIn={() => {}}
      onSignUp={handleSignUp}
      t={key => t[key]}
    />
  )
}

export default Login

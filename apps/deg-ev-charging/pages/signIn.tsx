import React, { useEffect } from 'react'
import SignIn from '@components/signIn/SignIn'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const AUTH_RETURN_URL_KEY = 'authReturnUrl'

const Login = () => {
  const router = useRouter()

  useEffect(() => {
    Cookies.remove('authToken')
    Cookies.remove('isVerified')
    localStorage.clear()
  }, [])

  useEffect(() => {
    const returnUrl = router.query.returnUrl
    if (typeof returnUrl === 'string' && returnUrl.startsWith('/')) {
      try {
        sessionStorage.setItem(AUTH_RETURN_URL_KEY, returnUrl)
      } catch {
        // ignore
      }
    }
  }, [router.query.returnUrl])

  return <SignIn />
}

export default Login

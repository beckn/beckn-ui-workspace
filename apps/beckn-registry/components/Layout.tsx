import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from './navbar'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { logout } from '@store/auth-slice'
import { checkTokenExpiry } from '@utils/general'

const blackListedRoutes = ['/signIn', '/signUp', '/forgotPassword', '/email-confirmation']

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!['/signIn', '/signUp', '/forgotPassword', '/email-confirmation'].includes(router.pathname)) {
      const token = Cookies.get('auth_token')
      let message = ''

      try {
        const isExpired = checkTokenExpiry(token)
        if (isExpired || !user) message = 'Token expired, please log in again!'
      } catch (error) {
        console.error('Token decoding error:', error)
        message = 'Token decode failed, please log in again!'
      } finally {
        if (message) {
          alert(message)
          dispatch(logout())
        }
      }
    }
  }, [router])

  return (
    <div>
      {blackListedRoutes.includes(router.pathname) ? <></> : <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default Layout

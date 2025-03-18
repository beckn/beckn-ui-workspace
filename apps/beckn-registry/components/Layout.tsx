import React from 'react'
import { useRouter } from 'next/router'
import Navbar from './navbar'

const blackListedRoutes = ['/signIn', '/signUp', '/forgotPassword']

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()

  return (
    <div>
      {blackListedRoutes.includes(router.pathname) ? <></> : <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default Layout

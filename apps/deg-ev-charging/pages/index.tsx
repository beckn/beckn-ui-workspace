import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

/** Homepage removed: redirect to Search by location (middleware also redirects / to /searchByLocation or /signIn) */
const HomeRedirect = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/searchByLocation')
  }, [router])
  return null
}

export default HomeRedirect

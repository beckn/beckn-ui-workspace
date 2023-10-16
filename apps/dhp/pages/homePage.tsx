import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import LandingPage from '../components/landingPage/LandingPage'

const Homepage = () => {
  const router = useRouter()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const { id_token, access_token } = router.query

  const fetchUserInfoAndProfile = async () => {
    try {
      const userData = await axios.get(
        `${strapiUrl}/auth/google/callback?id_token=${id_token}&access_token=${access_token}`
      )
      if (userData.data) {
        const jwtToken = userData.data.jwt
        Cookies.set('authToken', jwtToken)

        const profileData = await axios.get(`${strapiUrl}/profiles`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        })
        return
      }
    } catch (error: any) {
      if (error.response.data.error.message === 'Not Found') {
        router.push('/createProfile')
      }
    }
  }

  useEffect(() => {
    if (id_token && access_token) {
      fetchUserInfoAndProfile()
    }
  }, [id_token, access_token])

  return <LandingPage />
}

export default Homepage

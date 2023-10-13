import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import LandingPage from '../components/landingPage/LandingPage'

const Homepage = () => {
  const router = useRouter()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const { id_token, access_token } = router.query

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  // TODO ;- Check the below code later

  // const fetchUserInfoAndProfile = async () => {
  //   try {
  //     const userData = await axios.get(
  //       `${strapiUrl}/auth/google/callback?id_token=${id_token}&access_token=${access_token}`
  //     )
  //     if (userData.data) {
  //       const userDataFromResponse = userData.data
  //       const jwtToken = userDataFromResponse.jwt
  //       const email = userDataFromResponse.user.email

  //       Cookies.set('authToken', jwtToken)
  //       Cookies.set('userEmail', email)

  //       const profileData = await axios.get(`${strapiUrl}/profiles?populate[0]=documents.attachment`, {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`
  //         }
  //       })

  //       return
  //     }
  //   } catch (error: any) {
  //     console.error(error)
  //     if (error.response.data.error.message === 'Not Found') {
  //       router.push('/createProfile')
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (id_token && access_token) {
  //     fetchUserInfoAndProfile()
  //   }
  // }, [id_token, access_token])

  return <LandingPage />
}

export default Homepage

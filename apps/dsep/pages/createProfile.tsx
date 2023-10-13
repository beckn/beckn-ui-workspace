import React from 'react'
import CreateProfile from '../components/createProfile/CreateProfile'
import axios from 'axios'
import Cookies from 'js-cookie'
import { UserData } from '../components/createProfile/createProfile.types'
import { useRouter } from 'next/router'

const createProfile = () => {
  const router = useRouter()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const createProfileSubmitHandler = async (formData: UserData) => {
    const { name, mobileNumber, address, pinCode } = formData
    const formDataForPayload = new FormData()

    const profileCreatePayload = {
      name: name,
      phone: mobileNumber,
      address: address,
      zip_code: pinCode
    }
    formDataForPayload.append('data', JSON.stringify(profileCreatePayload))

    const bearerToken = Cookies.get('authToken')
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json' // You can set the content type as needed
      }
    }
    try {
      const createProfileResponse = await axios.post(`${strapiUrl}/profiles`, formDataForPayload, axiosConfig)

      if (createProfileResponse.status === 200) {
        router.push('/homePage')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <CreateProfile createProfileSubmitHandler={createProfileSubmitHandler} />
    </div>
  )
}

export default createProfile

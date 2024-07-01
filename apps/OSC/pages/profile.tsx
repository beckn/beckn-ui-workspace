import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { profilePageProp } from '@components/signIn/SignIn.types'
import { useLanguage } from '@hooks/useLanguage'
import { FormErrors, profileValidateForm } from '@utils/form-utils'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'

import Router from 'next/router'

import { isEmpty } from '@utils/common-utils'
import { useDispatch } from 'react-redux'
import { feedbackActions } from '@store/ui-feedback-slice'
import axios from '@services/axios'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<profilePageProp>({
    name: '',
    mobileNumber: '',
    flatNumber: '',
    street: '',
    city: '',
    zipCode: '',
    state: '',
    country: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    mobileNumber: '',
    email: '',
    zipCode: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: profilePageProp) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = profileValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    setIsLoading(true)

    axios
      .get(`${strapiUrl}/profiles`, requestOptions)
      .then(response => {
        const result = response.data
        const { name, phone, address, zip_code = '' } = result.data.attributes
        let flatNumber,
          street,
          city,
          state,
          country = ''
        if (!isEmpty(address)) {
          const addressList = address.split(',')
          flatNumber = addressList[0].trim()
          street = addressList[1].trim()
          city = addressList[2].trim()
          state = addressList[3].trim()
          country = addressList[4].trim()
        }
        setFormData({
          ...formData,
          name,
          mobileNumber: phone,
          flatNumber,
          street,
          state,
          city,
          country,
          zipCode: zip_code
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const updateProfile = () => {
    const errors = profileValidateForm(formData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...Object.keys(errors).reduce((acc, key) => {
        acc[key] = t[`${errors[key]}`] || ''
        return acc
      }, {} as FormErrors)
    }))

    setIsLoading(true)

    const currentFormData = new FormData()
    const data = {
      name: formData.name.trim(),
      phone: formData.mobileNumber,
      address: `${formData.flatNumber || ''}, ${formData.street || ''}, ${formData.city}, ${formData.state}, ${formData.country}`,
      zip_code: formData.zipCode
    }

    currentFormData.append('data', JSON.stringify(data))

    const requestOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true,
      data: currentFormData
    }

    axios
      .post(`${strapiUrl}/profiles`, currentFormData, requestOptions)
      .then(response => {
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: t.success, display: true, type: 'success', description: t.profileUpdateSuccess }
          })
        )
        Router.push('/')
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const isFormFilled = useMemo(() => {
    const { flatNumber, street, ...restFormData } = formData
    const { flatNumber: flatNumberError, street: streetError, ...restFormErrors } = formErrors

    return (
      Object.values(restFormData).every(value => value !== '') &&
      Object.values(restFormErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  return (
    <Box
      margin={'0 auto'}
      mt={['-20px', '-20px', '-70px', '-70px']}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll osc_profile"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
      <BecknAuth
        schema={{
          buttons: [
            {
              text: t.saveContinue,
              handleClick: updateProfile,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'name',
              value: formData.name,
              handleChange: handleInputChange,
              label: t.fullName,
              error: formErrors.name
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            },
            {
              type: 'text',
              name: 'flatNumber',
              value: formData.flatNumber,
              handleChange: handleInputChange,
              label: t.enterFlatDetails
              // error: formErrors.flatNumber
            },
            {
              type: 'text',
              name: 'street',
              value: formData.street,
              handleChange: handleInputChange,
              label: t.enterStreetDetails
              // error: formErrors.street
            },
            {
              type: 'text',
              name: 'city',
              value: formData.city,
              handleChange: handleInputChange,
              label: t.enterCity,
              error: formErrors.city
            },
            {
              type: 'text',
              name: 'zipCode',
              value: formData.zipCode,
              handleChange: handleInputChange,
              label: t.enterPincode,
              error: formErrors.zipCode
            },
            {
              type: 'text',
              name: 'state',
              value: formData.state,
              handleChange: handleInputChange,
              label: t.enterState,
              error: formErrors.state
            },
            {
              type: 'text',
              name: 'country',
              value: formData.country,
              handleChange: handleInputChange,
              label: t.enterCountry,
              error: formErrors.country
            }
          ]
        }}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default ProfilePage

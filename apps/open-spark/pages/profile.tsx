import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box, Divider, Flex, Image, useToast } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { profileValidateForm } from '@beckn-ui/common/src/utils'
import Cookies from 'js-cookie'
import React, { useEffect, useMemo, useState } from 'react'
import Router from 'next/router'
import { isEmpty } from '@beckn-ui/common/src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { FormErrors, ProfileProps } from '@beckn-ui/common/lib/types'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import axios from '@services/axios'
import { testIds } from '@shared/dataTestIds'
import credIcon from '@public/images/cred_icon.svg'
import tradeIcon from '@public/images/trade_icon.svg'
import derIcon from '@public/images/der_icon.svg'
import logoutIcon from '@public/images/logOutIcon.svg'
import NavigationItem from '@components/navigationItem'
import fa from '@locales/fa'
import { setProfileEditable, UserRootState } from '@store/user-slice'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileProps>({
    name: '',
    customerId: '',
    address: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    customerId: '',
    address: ''
  })

  const { profileEditable } = useSelector((state: UserRootState) => state.user)

  useEffect(() => {
    return () => {
      dispatch(setProfileEditable({ profileEditable: false }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: ProfileProps) => ({
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
      ...Object.keys(errors).reduce((acc: any, key) => {
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
        dataTestForm={testIds.profile_form}
        schema={{
          buttons: [],
          inputs: [
            {
              type: 'text',
              name: 'name',
              value: formData.name,
              handleChange: handleInputChange,
              label: t.fullName,
              error: formErrors.name,
              dataTest: testIds.profile_inputName,
              disabled: !profileEditable
            },
            {
              type: 'text',
              name: 'customerId',
              value: formData.customerId!,
              handleChange: handleInputChange,
              label: t.formCustomerId,
              error: formErrors.customerId,
              dataTest: testIds.profile_customerId,
              disabled: !profileEditable
            },
            {
              type: 'text',
              name: 'address',
              value: formData.address!,
              handleChange: handleInputChange,
              label: t.formAddress,
              error: formErrors.address,
              dataTest: testIds.profile_address,
              disabled: !profileEditable
            }
          ]
        }}
        isLoading={isLoading}
        customComponent={
          <Box marginTop={'-1.8rem'}>
            <NavigationItem
              icon={credIcon}
              label={'My Credentials'}
            />
            <NavigationItem
              icon={tradeIcon}
              label={'My Trades'}
            />
            <NavigationItem
              icon={derIcon}
              label={'My DERs'}
            />
            <NavigationItem
              icon={logoutIcon}
              label={t.logout}
              arrow={false}
              divider={false}
              color="red"
            />
          </Box>
        }
      />
    </Box>
  )
}

export default ProfilePage

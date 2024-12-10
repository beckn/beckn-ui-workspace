import React, { useEffect, useMemo, useState } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box, useBreakpoint } from '@chakra-ui/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Router from 'next/router'
import { FormErrors, SignInResponse, SignUpFormProps } from '@beckn-ui/common/lib/types'
import { useBapTradeRegisterMutation, useBppTradeRegisterMutation } from '@services/UserService'
import openSpark from '@public/images/openSparkLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { CustomFormErrorProps, signUpValidateForm } from '@utils/form-utils'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'

interface RegisterFormProps extends SignUpFormProps {
  utilityCompany: string
  address: string
}

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

const SignUp = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [formData, setFormData] = useState<RegisterFormProps>({
    email: '',
    password: '',
    address: '',
    mobileNumber: '',
    name: '',
    utilityCompany: ''
  })
  const [formErrors, setFormErrors] = useState<CustomFormErrorProps>({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    utilityCompany: ''
  })
  const [utilities, setUtilities] = useState<any[]>([])

  const breakpoint = useBreakpoint()
  const { role } = useSelector((state: AuthRootState) => state.auth)
  const [bapTradeRegister, { isLoading: bapLoading }] = useBapTradeRegisterMutation()
  const [bppTradeRegister, { isLoading: bppLoading }] = useBppTradeRegisterMutation()
  const { t } = useLanguage()
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    axios
      .get(`${strapiUrl}${ROUTE_TYPE.CONSUMER}/get-utilities`)
      .then(response => {
        const result = response.data
        const companies = result.map((company: any) => {
          return {
            label: company.name,
            value: company.name
          }
        })
      })
      .catch(error => {
        console.error('Error fetching utilities:', error)
      })
    setUtilities([
      { value: 'Maharashtra State Power Corp. Ltd', label: 'Maharashtra State Power Corp. Ltd' },
      { value: 'Reliance Power', label: 'Reliance Power' },
      { value: 'MSEB', label: 'MSEB' }
    ])
  }, [])

  // Handle input change and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    const { name, value } = e.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signUpValidateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  // Handle select input change and validation
  const handleSelectChange = (selectedItem: any) => {
    const { label, value } = selectedItem

    setFormData(prevFormData => ({
      ...prevFormData,
      ['utilityCompany']: value
    }))

    const updatedFormData = {
      ...formData,
      ['utilityCompany']: value
    }

    const errors = signUpValidateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ['utilityCompany']: t[`${errors['utilityCompany' as keyof CustomFormErrorProps]}`] || ''
    }))
  }

  // Handle sign-up action
  const handleSignUp = async () => {
    const errors = signUpValidateForm(formData)
    const isFormValid = Object.values(errors).every(error => error === '')
    const signUpData = {
      username: formData.email,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobileNumber,
      utilityCompany: formData.utilityCompany
    }

    if (isFormValid) {
      try {
        let registerResponse = null
        if (role === ROLE.CONSUMER) registerResponse = await bapTradeRegister(signUpData)
        if (role === ROLE.PRODUCER) registerResponse = await bppTradeRegister(signUpData)

        if (!registerResponse || (registerResponse as { error: FetchBaseQueryError })?.error)
          throw new Error('Could not register')

        const myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${(registerResponse as { data: SignInResponse }).data.jwt}`)

        const currentFormData = new FormData()
        const data = {
          name: formData.name,
          phone: formData.mobileNumber
        }

        currentFormData.append('data', JSON.stringify(data))

        const requestOptions: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
          body: currentFormData
        }

        fetch(`${baseUrl}/profiles`, requestOptions).then(response => {
          Router.push('/')
          return response.json()
        })
      } catch (error) {
        console.error('An error occurred:', error)
      }
    } else {
      setFormErrors({
        ...formErrors,
        name: t[errors.name!] || ''
      })
    }
  }

  // Check if form is filled
  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const handleSignIn = () => {
    Router.push('/signIn')
  }
  console.log(utilities)
  return (
    <Box
      mt={'30px'}
      className="hideScroll"
      maxH="calc(100vh - 90px)"
      overflowY={'scroll'}
    >
      <BecknAuth
        schema={{
          logo: {
            src: openSpark,
            alt: 'openSpark-logo'
          },
          buttons: [
            {
              text: t.signUp,
              handleClick: handleSignUp,
              disabled: !isFormFilled || !termsAccepted,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: bapLoading || bppLoading
            },
            {
              text: t.signIn,
              handleClick: handleSignIn,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: bapLoading || bppLoading
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
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: handleInputChange,
              label: t.enterEmailID,
              error: formErrors.email
            },
            {
              type: 'text',
              name: 'address',
              value: formData.address,
              handleChange: handleInputChange,
              label: t.enterAddrees
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            },
            // {
            //   type: 'text',
            //   name: 'utilityCompany',
            //   value: formData.utilityCompany,
            //   handleChange: handleInputChange,
            //   label: t.selectUtilityCompany,
            //   error: formErrors.utilityCompany
            // },
            {
              type: 'select',
              name: 'utilityCompany',
              options: utilities,
              value: formData.utilityCompany,
              handleChange: handleSelectChange,
              label: t.selectUtilityCompany,
              error: formErrors.utilityCompany
            },
            {
              type: 'password',
              name: 'password',
              value: formData.password,
              handleChange: handleInputChange,
              label: t.enterPassword,
              error: formErrors.password
            }
          ],
          showTermsCheckbox: true,
          termsCheckboxProps: {
            isChecked: termsAccepted,
            color: '#4498E8',
            onChange: e => setTermsAccepted(e.target.checked),
            termsText: {
              serviceName: 'Open Spark',
              termsLink: '/terms',
              privacyLink: '/privacy'
            }
          }
        }}
      />
    </Box>
  )
}

export default SignUp

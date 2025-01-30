import React, { useEffect, useMemo, useState } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Router from 'next/router'
import { FormErrors, SignUpFormProps } from '@beckn-ui/common/lib/types'
import { useTradeRegisterMutation } from '@services/UserService'
import openSpark from '@public/images/openSparkLogo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { CustomFormErrorProps, signUpValidateForm } from '@utils/form-utils'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'

interface RegisterFormProps extends SignUpFormProps {
  utilityCompany: string
  address: string
}

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

const SignUp = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [formData, setFormData] = useState<RegisterFormProps>({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    address: '',
    utilityCompany: ''
  })
  const [formErrors, setFormErrors] = useState<CustomFormErrorProps>({
    name: '',
    email: '',
    password: '',
    address: '',
    mobileNumber: '',
    utilityCompany: ''
  })
  const [utilities, setUtilities] = useState<any[]>([])

  const { role } = useSelector((state: AuthRootState) => state.auth)
  const [tradeRegister, { isLoading }] = useTradeRegisterMutation()
  const { t } = useLanguage()
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // axios
    //   .get(`${strapiUrl}${ROUTE_TYPE.CONSUMER}/get-utilities`)
    //   .then(response => {
    //     const result = response.data
    //     const companies = result?.records.map((company: any) => {
    //       return {
    //         label: company.details.company_name,
    //         value: company.details.company_name
    //       }
    //     })
    //     setUtilities(companies)
    //   })
    //   .catch(error => {
    //     console.error('Error fetching utilities:', error)
    //   })

    setUtilities([
      { value: 'Maharashtra State Power Corp. Ltd', label: 'Maharashtra State Power Corp. Ltd' },
      { value: 'Reliance Power', label: 'Reliance Power' },
      { value: 'MSEB', label: 'MSEB' },
      { value: 'Gujarat Electricity Corp. Ltd', label: 'Gujarat Electricity Corp. Ltd' }
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

  const createTradeCatalogue = async () => {
    const { name } = formData
    const tradeCatalogueData = {
      provider_name: `${name} Energy`,
      short_desc: `${name} Energy Company`,
      long_desc: `${name} Energy Company - Providing energy solutions`,
      domain_name: 'uei:p2p_trading'
    }

    try {
      const response = await axios.post(`${strapiUrl}${ROUTE_TYPE.PRODUCER}/profile`, tradeCatalogueData, {
        headers: { Authorization: `Bearer ${Cookies.get('authToken') || ''}` },
        withCredentials: true
      })
      console.log('Trade catalogue created:', response.data)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  // Handle sign-up action
  const handleSignUp = async () => {
    const errors = signUpValidateForm(formData)
    const isFormValid = Object.values(errors).every(error => error === '')
    const signUpData = {
      fullname: formData.name,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      phone_no: formData.mobileNumber,
      utility_name: formData.utilityCompany
    }

    if (isFormValid) {
      try {
        let registerResponse: any = null
        let catalogueSuccess: any = null

        registerResponse = await tradeRegister(signUpData)
        // for PRODUCER to create default catalogue
        catalogueSuccess = await createTradeCatalogue()

        console.log(registerResponse)
        if (!registerResponse || (registerResponse as { error: FetchBaseQueryError })?.error)
          throw new Error('Could not register')
        const jwtToken = registerResponse?.data?.data?.jwt
        if (jwtToken) {
          Cookies.set('authToken', jwtToken)
          console.log('JWT Token saved:', jwtToken)
        } else {
          throw new Error('JWT token not found in the response')
        }
        if (catalogueSuccess) {
          Router.push('/')
        }
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
              isLoading: isLoading
            },
            {
              text: t.signIn,
              handleClick: handleSignIn,
              variant: 'outline',
              colorScheme: 'primary',
              disabled: isLoading
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
              label: t.enterAddrees,
              error: formErrors.address
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

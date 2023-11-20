import React, { useState } from 'react'
import { Box, Flex, Image, Input } from '@chakra-ui/react'
import OpenCommerce from '../../public/images/openCommerce.svg'
import Styles from './SignIn.module.css'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import style from '../detailsCard/ShippingForm.module.css'
import { FormErrors, signInValidateForm } from '@utils/detailsForm-utils'
import Button from '../button/Button'
import { Button as BecknButton, Input as BecknInput } from '@beckn-ui/molecules'
import Router from 'next/router'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(true)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: SignInPropsModel) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    //   const errors = signInValidateForm(updatedFormData) as any
    //   setFormErrors(prevErrors => ({
    //     ...prevErrors,
    //     [name]: errors[name] || ''
    //   }))
    //   setIsFormFilled(updatedFormData.email.trim() !== '' && updatedFormData.password.trim() !== '')
  }

  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      const response = await fetch(`${baseUrl}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.jwt

        localStorage.setItem('token', token)
        Router.push('/homePage')
      } else {
        console.error('Sign In failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.logo_container}>
        <Image
          className={Styles.logo_skillup}
          src={OpenCommerce}
          alt="OpenCommerce"
          pt="15px"
        />
      </Flex>
      <Box
        className={Styles.signin_container}
        pt="40px"
      >
        <div className={style.container}>
          <BecknInput
            variant="flushed"
            type="text"
            name="email"
            value={formData.email}
            handleChange={handleInputChange}
            label="Email"
            placeholder=""
          />
          <BecknInput
            variant="flushed"
            type="password"
            name="password"
            value={formData.password}
            handleChange={handleInputChange}
            label="Password"
            placeholder=""
          />
        </div>
      </Box>
      <BecknButton
        text="SignIn"
        handleClick={handleSignIn}
        disabled={!isFormFilled}
        colorScheme="primary"
      />
      <BecknButton
        text="SignUp"
        handleClick={() => {
          Router.push('/signUp')
        }}
        disabled={!isFormFilled}
        variant="outline"
        colorScheme="primary"
      />
    </Box>
  )
}

export default SignIn

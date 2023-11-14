// 'use client'
import React, { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import HomeImg from '../../public/images/HomePageLogo.svg'
import SkillUp from '../../public/images/SkillUpLogo.svg'
import Styles from './SignIn.module.css'
import style from '../detailsCard/ShippingForm.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import GoogleLogo from '../../public/images/Google_logo.svg'
import { SignInPropsModel } from './Signin.types'
import Button from '../button/Button'
import { FormErrors, signInValidateForm } from '../../utilities/detailsForm-utils'
import Router from 'next/router'
import Cookies from 'js-cookie'

const SignIn = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)

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

    const errors = signInValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: errors[name] || ''
    }))
    setIsFormFilled(updatedFormData.email.trim() !== '' && updatedFormData.password.trim() !== '')
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
        const email = data.user.email

        Cookies.set('authToken', token)
        Cookies.set('userEmail', email)
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
          src={HomeImg}
          alt="Home Icon"
          width={77}
          height={76}
        />
        <Image
          className={Styles.logo_skillup}
          src={SkillUp}
          alt="Skill Up Icon"
          width={188}
          height={56}
        />
      </Flex>
      <Box
        className={Styles.signin_container}
        pt="40px"
      >
        <div className={style.container}>
          <div className={style.did_floating_label_content}>
            <input
              className={style.did_floating_input}
              type="text"
              placeholder=" "
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label className={style.did_floating_label}>{t.formEmail}</label>
            {formErrors.email && <div className={style.error}>{formErrors.email}</div>}
          </div>
          <div className={style.did_floating_label_content}>
            <input
              className={style.did_floating_input}
              type="password"
              placeholder=" "
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label className={style.did_floating_label}>{t.password}</label>
            {formErrors.password && <div className={style.error}>{formErrors.password}</div>}
          </div>
        </div>
      </Box>
      <Button
        buttonText={'SignIn'}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        handleOnClick={handleSignIn}
        isDisabled={!isFormFilled}
      />
      <Button
        buttonText={'SignUp'}
        color={'rgba(var(--color-primary))'}
        background={'rgba(var(--text-color))'}
        handleOnClick={() => {
          Router.push('/signUp')
        }}
        isDisabled={false}
      />
    </Box>
  )
}

export default SignIn

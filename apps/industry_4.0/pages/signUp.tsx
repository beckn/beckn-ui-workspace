import React, { useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { SignUpPropsModel } from '@components/signIn/SignIn.types'
import { FormErrors, signUpValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'

const SignUp = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignUpPropsModel>({ name: '', email: '', password: '', mobileNumber: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', email: '', password: '', mobileNumber: '' })
  const [isFormFilled, setIsFormFilled] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: SignUpPropsModel) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = signUpValidateForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
    setIsFormFilled(
      updatedFormData.name.trim() !== '' &&
        updatedFormData.email.trim() !== '' &&
        updatedFormData.password.trim() !== '' &&
        updatedFormData.mobileNumber.trim() !== ''
    )
  }

  const handleSignUp = async () => {}

  return (
    <>
      <BecknAuth
        schema={{
          buttons: [
            {
              text: 'SignUp',
              handleClick: handleSignUp,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary'
            },
            {
              text: 'SignUp',
              handleClick: () => {
                Router.push('/signUp')
              },
              disabled: false,
              variant: 'outline',
              colorScheme: 'primary'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'name',
              value: formData.name,
              handleChange: handleInputChange,
              label: 'Enter Your Full Name',
              error: formErrors.name
            },
            {
              type: 'text',
              name: 'email',
              value: formData.email,
              handleChange: handleInputChange,
              label: 'Enter Email ID',
              error: formErrors.email
            },
            {
              type: 'password',
              name: 'password',
              value: formData.password,
              handleChange: handleInputChange,
              label: 'Enter Password',
              error: formErrors.password
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: 'Enter Mobile Number',
              error: formErrors.mobileNumber
            }
          ]
        }}
      />
    </>
  )
}

export default SignUp

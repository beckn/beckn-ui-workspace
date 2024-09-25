import React, { useMemo, useState } from 'react'
import Router from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import SkillUpLogo from '../public/images/skillUpHomeLogo.svg'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors, signUpValidateForm } from '../utilities/detailsForm-utils'
import Cookies from 'js-cookie'
import { Box, useToast } from '@chakra-ui/react'
import { SignUpPropsModel } from '../components/signIn/Signin.types'
import { Toast } from '@beckn-ui/molecules'

const SignUp = () => {
  const { t } = useLanguage()
  const toast = useToast()
  const [formData, setFormData] = useState<SignUpPropsModel>({ name: '', email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', email: '', password: '' })
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

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
      [name]: errors[name] || ''
    }))
  }

  const handleRegister = async () => {
    const errors = signUpValidateForm(formData)

    const isFormValid = Object.values(errors).every(error => error === '')

    if (isFormValid) {
      const registrationData = {
        username: formData.name,
        email: formData.email,
        password: formData.password
      }

      try {
        const response = await fetch(`${baseUrl}/auth/local/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        })

        if (response.ok) {
          const data = await response.json()
          const token = data.jwt

          Cookies.set('authToken', token)
          Router.push('/signin')
        } else {
          const errorData = await response.json()
          toast({
            render: ({ onClose }) => (
              <Toast
                status="error"
                title="Error!"
                description={errorData.error.message}
                onClose={onClose}
              />
            ),
            position: 'top',
            duration: 2000,
            isClosable: true
          })
          console.error('Registration failed')
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    } else {
      setFormErrors(errors)
    }
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  return (
    <>
      <Box mt={'30px'}>
        <BecknAuth
          schema={{
            logo: {
              src: SkillUpLogo,
              alt: 'Suppliflow logo'
            },
            buttons: [
              {
                text: t.signUp,
                handleClick: handleRegister,
                disabled: !isFormFilled,
                variant: 'solid',
                colorScheme: 'primary'
              },
              {
                text: t.signIn,
                handleClick: () => {
                  Router.push('/')
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
                label: t.formName,
                error: formErrors.name
              },
              {
                type: 'text',
                name: 'email',
                value: formData.email,
                handleChange: handleInputChange,
                label: t.formEmail,
                error: formErrors.email
              },
              {
                type: 'password',
                name: 'password',
                value: formData.password,
                handleChange: handleInputChange,
                label: t.password,
                error: formErrors.password
              }
            ]
          }}
        />
      </Box>
    </>
  )
}
export default SignUp
// import React from 'react'
// import Router from 'next/router'
// import SkillUpMobLogo from '@public/images/skillUpHomeLogo.svg'
// import SkillUpDeskLogo from '@public/images/skillUpHomeLogo.svg'
// import { useLanguage } from '@hooks/useLanguage'
// import { SignUpPage } from '@beckn-ui/common'
// import { Box } from '@chakra-ui/react'

// const Register = () => {
//   const { t } = useLanguage()

//   const handleSignIn = () => {
//     Router.push('/signIn')
//   }

//   return (
//     <Box mt="-30px">
//       <SignUpPage
//         baseUrl={process.env.NEXT_PUBLIC_STRAPI_URL!}
//         logos={{
//           mobile: { src: SkillUpMobLogo, alt: 'Kuza logo' },
//           desktop: { src: SkillUpDeskLogo, alt: 'Kuza logo' }
//         }}
//         onSignIn={handleSignIn}
//         onSignUp={() => {}}
//         t={key => t[key]}
//       />
//     </Box>
//   )
// }

// export default Register

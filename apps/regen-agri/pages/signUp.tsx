import React, { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { FormErrors, signUpValidateForm } from '../utilities/detailsForm-utils'
import style from '../components/detailsCard/ShippingForm.module.css'
import Styles from '../components/signIn/SignIn.module.css'
import { Box, Flex, Image, useToast } from '@chakra-ui/react'

import Button from '../components/button/Button'
import Router from 'next/router'
import { SignUpPropsModel } from '../components/signIn/Signin.types'
import Cookies from 'js-cookie'
import { CustomToast } from '../components/signIn/SignIn'
const SignUp = () => {
    const { t } = useLanguage()
    const toast = useToast()
    const [formData, setFormData] = useState<SignUpPropsModel>({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
    })
    const [isFormFilled, setIsFormFilled] = useState(false)
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prevFormData: SignUpPropsModel) => ({
            ...prevFormData,
            [name]: value,
        }))

        const updatedFormData = {
            ...formData,
            [name]: value,
        }

        const errors = signUpValidateForm(updatedFormData) as any
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errors[name] || '',
        }))
        setIsFormFilled(
            updatedFormData.name.trim() !== '' &&
                updatedFormData.email.trim() !== '' &&
                updatedFormData.password.trim() !== ''
        )
    }

    const handleRegister = async () => {
        const errors = signUpValidateForm(formData)

        const isFormValid = Object.values(errors).every((error) => error === '')

        if (isFormValid) {
            const registrationData = {
                username: formData.name,
                email: formData.email,
                password: formData.password,
            }

            try {
                const response = await fetch(`${baseUrl}/auth/local/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(registrationData),
                })

                if (response.ok) {
                    const data = await response.json()
                    const token = data.jwt

                    Cookies.set('authToken', token)
                    Router.push('/homePage')
                } else {
                    const errorData = await response.json()
                    toast({
                        render: () => (
                            <CustomToast
                                title="Error!"
                                message={errorData.error.message}
                            />
                        ),
                        position: 'top',
                        duration: 2000,
                        isClosable: true,
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

    return (
        <>
            <Box className={Styles.main_container}>
                <Box className={Styles.signin_container}>
                    <div className={style.container}>
                        <div className={style.did_floating_label_content}>
                            <input
                                className={style.did_floating_input}
                                type="text"
                                placeholder=" "
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <label className={style.did_floating_label}>
                                {t.formName}
                            </label>
                            {formErrors.name && (
                                <div className={style.error}>
                                    {formErrors.name}
                                </div>
                            )}
                        </div>
                        <div className={style.did_floating_label_content}>
                            <input
                                className={style.did_floating_input}
                                type="text"
                                placeholder=" "
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <label className={style.did_floating_label}>
                                {t.formEmail}
                            </label>
                            {formErrors.email && (
                                <div className={style.error}>
                                    {formErrors.email}
                                </div>
                            )}
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
                            <label className={style.did_floating_label}>
                                {t.password}
                            </label>
                            {formErrors.password && (
                                <div className={style.error}>
                                    {formErrors.password}
                                </div>
                            )}
                        </div>
                        <div className={style.did_floating_label_content}>
                            <input
                                className={style.did_floating_input}
                                type="text"
                                placeholder=" "
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                            />
                            <label className={style.did_floating_label}>
                                {t.enterPhoneNumber}
                            </label>
                            {formErrors.mobileNumber && (
                                <span className={style.error}>
                                    {t[`${formErrors.mobileNumber}`]}
                                </span>
                            )}
                        </div>
                    </div>
                </Box>
                <Button
                    buttonText={t.signUp}
                    handleOnClick={handleRegister}
                    isDisabled={!isFormFilled}
                    type={'solid'}
                />
            </Box>
        </>
    )
}
export default SignUp

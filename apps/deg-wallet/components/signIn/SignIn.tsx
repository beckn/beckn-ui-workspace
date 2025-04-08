import React, { useState, useMemo, useEffect } from 'react'
import { BecknAuth } from '@beckn-ui/becknified-components'
import { FormErrors } from '@beckn-ui/common/lib/types'
// import AppLogo from '@public/images/wallet_logo.svg'
import AppLogo from '@public/images/wallet_app_logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { Box } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { LoginFormProps } from '@lib/types/user'
import { useRouter } from 'next/router'
import { mobilePhoneValidate } from '@utils/form-utils'
import {
  useRegisterLoginUserMutation,
  useGetUserMutation,
  getVerificationMethods,
  useGetVerificationMethodsMutation,
  useVerifyMutation
} from '@services/walletService'
import Cookies from 'js-cookie'
import { RegisterSubject } from '@lib/types/becknDid'
import { setPrivateKeyAndPublicKey } from '@store/auth-slice'
import { generateKeyPairFromString, generateSignature } from '@services/cryptoUtilService'
import axios from 'axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { setProfileDetails } from '@store/user-slice'

const SignIn = ({ initialFormData = { mobileNumber: '' } }) => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [formData, setFormData] = useState<LoginFormProps>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({ mobileNumber: '' })

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()

  const [registerLoginUser, { isLoading }] = useRegisterLoginUserMutation()
  const [getUser, { isLoading: getUserLoading }] = useGetUserMutation()
  const [getVerificationMethods, { isLoading: getVerificationMethodLoading }] = useGetVerificationMethodsMutation()
  const [verify, { isLoading: verifyLoading }] = useVerifyMutation()

  useEffect(() => {
    Cookies.remove('userDidAuth')
    Cookies.remove('isVerified')
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target

    // if (!value.startsWith('+91 ')) {
    //   value = '+91 '
    // }

    // // Prevent clearing the field
    // if (value.length < 4) {
    //   value = '+91 '
    // }

    const numericPart = value //.replace(/\D/g, '').slice(2)

    // value = `+91 ${numericPart}`
    value = `${numericPart}`

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = mobilePhoneValidate(updatedFormData, false)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name as keyof FormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const verifyDocument = async (user: RegisterSubject, privateKey: string) => {
    try {
      const verificationMethodsRes = await getVerificationMethods(user?.did!).unwrap()
      const { did, challenge, controller } = verificationMethodsRes[0]

      const regex = /verification_methods\/([^/]+)$/
      const match = did.match(regex)
      const verificationId = match?.[1] || ''

      const signedResponse = await generateSignature(challenge!, privateKey)

      await verify({ subjectId: controller?.did!, verificationId, signedDetails: signedResponse }).unwrap()
    } catch (error) {
      console.error('Error verifying document:', error)
      throw new Error('Error verifying document')
    }
  }

  const handleSignIn = async () => {
    const subjectKey = `users/phone/${formData.mobileNumber}` //.replace(/^(\+91\s?)/, '')
    const { publicKey, privateKey } = await generateKeyPairFromString(subjectKey)
    dispatch(setPrivateKeyAndPublicKey({ publicKey, privateKey }))
    const signInData = {
      subject: { name: subjectKey },
      publicKey
    }

    try {
      try {
        const strapiMobileLogin = await axios.post(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/mobile-login`, {
          phone: formData.mobileNumber
        })
        console.log('strapiMobileLogin', strapiMobileLogin)
        if (strapiMobileLogin.status === 200) {
          dispatch(setProfileDetails(strapiMobileLogin.data.user))
        }
      } catch (error) {
        console.error('An error occurred while strapi mobile login:', error)
      }
      const res = await registerLoginUser(signInData).unwrap()
      if (res[0].verification_methods[0].verified === 'N') {
        await verifyDocument(res[0], privateKey)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <Box>
      <BecknAuth
        schema={{
          logo: {
            src: AppLogo,
            alt: 'wallet-logo'
          },
          buttons: [
            {
              text: t.signIn,
              handleClick: handleSignIn,
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading: isLoading,
              dataTest: 'login-button'
            }
          ],
          inputs: [
            {
              type: 'text',
              name: 'mobileNumber',
              label: t.enterMobileNumber,
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              error: formErrors.mobileNumber,
              dataTest: 'input-mobile-number'
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignIn

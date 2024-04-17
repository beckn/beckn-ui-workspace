import React, { useState,useEffect } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import AlternateLogo from '../public/images/KuzaLogo.svg'
import { SignUpPropsModel } from '@components/signIn/SignIn.types'
import { FormErrors, signUpValidateForm } from '@utils/form-utils'
import { BecknAuth } from '@beckn-ui/becknified-components'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { Box, useBreakpoint, useToast, Text } from '@chakra-ui/react'
import { useRegisterMutation } from '@services/Users'
import { CustomToast } from '@components/signIn/SignIn'
import Logo from '@public/images/Logo.svg'


//dsnp imports
import { parentURLs } from '@lib/config'
import { setLocalStorage } from '@utils/localstorage'
import { signPayloadWithExtension,payloadHandle } from '@utils/signTransaction'
import {dsnpCreate,dsnpRegister,getBlockNumber} from '@utils/auth'
import { fetchHandles, fetchChallenge, dsnpLogin } from '@components/signIn/Signin.utils'

const SignUp = () => {
  const { t } = useLanguage()
  const toast = useToast()
  const [formData, setFormData] = useState<SignUpPropsModel>({ name: '', email: '', password: '', mobileNumber: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', email: '', password: '', mobileNumber: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo
  const [register, { isLoading,isError }] = useRegisterMutation()


    //dsnp state
    const [challenge, setChallenge] = useState('')
    const [handles, setHandles] = useState([])
    const [expiration, setExpiration] = useState(0)
    const [selectedAddress, setSelectedAddress] = useState('')
    const [providerInfo, setProviderInfo] = useState({})


  useEffect(()=>{
    if(isError){
      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message="Unable to login"
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  },[isError])

  const handleDsnpRegister = async () => {
    const errors = signUpValidateForm(formData)
    let isIframe = false

    const isFormValid = Object.values(errors).every(error => error === '')

    if (isFormValid) {
      const registrationData = {
        username: formData.name,
        email: formData.email,
        password: formData.password
      }

      try {
        if (selectedAddress && formData.name) {
          if (handles.length > 0) {
            if (window.location !== window.parent.location) {
              isIframe = true
              window.parent.postMessage(
                {
                  type: 'signTransaction',
                  data: { selectedAccount: selectedAddress, challenge: challenge.challenge }
                },
                '*'
              )
            } else {
              const signedChallenge = await signPayloadWithExtension(selectedAddress, challenge.challenge)
              const loginData = await dsnpLogin(signedChallenge, handles[0]?.publicKey, challenge.challenge)
              setLocalStorage('dsnpAuth', loginData)
            }
          } else {
            const dsnpHandle = formData.email.split('@')[0] || 'Beckn_user'

            if (window.location !== window.parent.location) {
              isIframe = true
              const blockNumber = await getBlockNumber(providerInfo.nodeUrl)
              const expiration = blockNumber + 50
              setExpiration(expiration)

              const handlePayload = await payloadHandle(expiration, dsnpHandle)

              const payloadData = {
                handlePayload: handlePayload.toU8a(),
                expiration,
                accountAddress: selectedAddress,
                providerId: providerInfo.providerId,
                providerSchemas: providerInfo.schemas,
                handle: dsnpHandle,
                signingAccount: selectedAddress
              }

              window.parent.postMessage(
                {
                  type: 'signCiTransaction',
                  data: payloadData
                },
                '*'
              )
            } else {
              const createData = await dsnpCreate(dsnpHandle, providerInfo, selectedAddress)
              setLocalStorage('dsnpAuth', createData)
            }
          }
        } else {
          toast({
            render: () => (
              <CustomToast
                title="Error!"
                message="No polka address found"
              />
            ),
            position: 'top',
            duration: 2000,
            isClosable: true
          })
          throw Error('No polka address found')
        }

     
      } catch (error) {
        console.error('An error occurred:', error)
      }
    } else {
      setFormErrors(errors)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProviderInfo(JSON.parse(localStorage.getItem('provider') as string))
      const accounts = JSON.parse(localStorage.getItem('polkaAddresses') as string)
      if (accounts && accounts.length > 0) {
        setSelectedAddress(accounts[0].address)
        fetchHandles(accounts[0].address).then(handles => {
          setHandles(handles)
        })
        fetchChallenge().then(challenge => setChallenge(challenge))
      }
    }
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!parentURLs.includes(event.origin)) return
      console.log('From Ec signed challenge', event.data)
      if (event.data.type && event.data.type === 'signTransaction') {
        const { signedChallenge } = event.data.data
        dsnpLogin(signedChallenge, handles[0]?.publicKey, challenge.challenge).then(loginData => {
          setLocalStorage('dsnpAuth', loginData)
          Router.push('/homePage')
        })
      } else if (event.data.type && event.data.type === 'signCiTransaction') {
        const { handleSignature, addProviderSignature, handle, signingAccount } = event.data.data
        dsnpRegister(expiration, handle, signingAccount, addProviderSignature, handleSignature).then(createData => {
          setLocalStorage('dsnpAuth', createData)
          Router.push('/homePage')
        })
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handles, challenge])

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

  const handleSignUp = async () => {
    const errors = signUpValidateForm(formData)
    const isFormValid = Object.values(errors).every(error => error === '')

    if (isFormValid) {
      try {
        register({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobileNumber
        })
      } catch (error) {
        console.error('An error occurred:', error)
        toast({
          render: () => (
            <CustomToast
              title="Error!"
              message="Unable to register"
            />
          ),
          position: 'top',
          duration: 2000,
          isClosable: true
        })
      }
    } else {
      setFormErrors({
        ...formErrors,
        name: t[`${errors.name}`] || ''
      })
    }
  }

  return (
    <Box mt={'30px'}>
      <BecknAuth
        schema={{
          logo: {
            src: currentLogo,
            alt: 'Suppliflow logo'
          },
          buttons: [
            {
              text: t.signUp,
              handleClick: async ()=>{
                await handleDsnpRegister()
                await handleSignUp()
              },
              disabled: !isFormFilled,
              variant: 'solid',
              colorScheme: 'primary',
              isLoading:isLoading
            },
            {
              text: t.signIn,
              handleClick: () => {
                Router.push('/')
              },
              variant: 'outline',
              colorScheme: 'primary',
              disabled:isLoading
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
              type: 'password',
              name: 'password',
              value: formData.password,
              handleChange: handleInputChange,
              label: t.enterPassword,
              error: formErrors.password
            },
            {
              type: 'number',
              name: 'mobileNumber',
              value: formData.mobileNumber,
              handleChange: handleInputChange,
              label: t.enterMobileNumber,
              error: formErrors.mobileNumber
            }
          ]
        }}
      />
    </Box>
  )
}

export default SignUp
import React, { useEffect, useState } from 'react'
import Logo from '../../public/images/SNP-Login-logo.svg'
import AlternateLogo from '../../public/images/SNP-Login-logo.svg'
import { useLanguage } from '@hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import { FormErrors, signInValidateForm } from '@utils/form-utils'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@services/Users'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { BecknAuth } from '@beckn-ui/becknified-components'

import { FaGoogle } from 'react-icons/fa'

import Router from 'next/router'
import { Box, useToast, Text, useBreakpoint } from '@chakra-ui/react'

//dsnp imports
import { parentURLs } from '@lib/config'
import { setLocalStorage } from '@utils/localstorage'
import { signPayloadWithExtension, payloadHandle } from '@utils/signTransaction'
import { dsnpCreate, dsnpRegister, getBlockNumber } from '@utils/auth'
import { fetchHandles, fetchChallenge, dsnpLogin } from './Signin.utils'
import { feedbackActions } from '@store/ui-feedback-slice'

const SignIn = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md', 'lg']
  const currentLogo = mobileBreakpoints.includes(breakpoint) ? Logo : AlternateLogo
  const [login, { isLoading, isError, data, error }] = useLoginMutation()

  //dsnp state
  const [challenge, setChallenge] = useState('')
  const [handles, setHandles] = useState([])
  const [expiration, setExpiration] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [providerInfo, setProviderInfo] = useState({})
  const dispatch = useDispatch()
  // const toast = useToast()

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
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const handlePolkaLogin = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }
    let isIframe = false

    try {
      if (selectedAddress && formData.email) {
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
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: t.toastError, display: true, type: 'error', description: 'No polka address found' }
          })
        )
        throw Error('No polka address found')
      }
      await handleSignIn()
      if (!isIframe) Router.push('/')
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const isFormFilled = (): boolean => {
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProviderInfo(JSON.parse(localStorage.getItem('provider') as string))
      const accounts = JSON.parse(localStorage.getItem('polkaAddresses') as string)
      console.log('Dank', accounts)
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
      if (event.data.type && event.data.type === 'signTransaction') {
        const { signedChallenge } = event.data.data
        dsnpLogin(signedChallenge, handles[0]?.publicKey, challenge.challenge).then(loginData => {
          setLocalStorage('dsnpAuth', loginData)
          Router.push('/')
        })
      } else if (event.data.type && event.data.type === 'signCiTransaction') {
        const { handleSignature, addProviderSignature, handle, signingAccount } = event.data.data
        dsnpRegister(expiration, handle, signingAccount, addProviderSignature, handleSignature).then(createData => {
          setLocalStorage('dsnpAuth', createData)
          Router.push('/')
        })
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handles, challenge, expiration])

  const handleSignIn = async () => {
    const signInData = {
      identifier: formData.email,
      password: formData.password
    }

    try {
      await login(signInData).unwrap()
      // Cookies.set('authToken', state.jwt)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <BecknAuth
      schema={{
        logo: {
          src: currentLogo,
          alt: 'Kuza logo'
        },
        buttons: [
          {
            text: t.signIn,
            handleClick: async () => {
              await handlePolkaLogin()
              // await handleSignIn()
            },
            disabled: !isFormFilled(),
            variant: 'solid',
            colorScheme: 'primary',
            isLoading: isLoading
          },
          {
            text: t.signUp,
            handleClick: () => {
              Router.push('/signUp')
            },
            variant: 'outline',
            colorScheme: 'primary',
            disabled: isLoading
          }
        ],
        inputs: [
          {
            type: 'text',
            name: 'email',
            value: formData.email,
            handleChange: handleInputChange,
            label: t.email,
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
  )
}

export default SignIn

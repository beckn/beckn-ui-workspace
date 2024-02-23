import React, { useState, useEffect } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import OpenCommerce from '@public/images/openCommerce.svg'
import Styles from './SignIn.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { SignInPropsModel } from './SignIn.types'
import style from '../detailsCard/ShippingForm.module.css'
import { FormErrors, signInValidateForm } from '../../utilities/detailsForm-utils'
import Button from '../button/Button'
import { fetchHandles, fetchChallenge, dsnpLogin } from './signin.utils'
import { signPayloadWithExtension, payloadHandle } from '../../utilities/signTransaction'
import { dsnpCreate, dsnpRegister, getBlockNumber } from '../../utilities/auth'
import { setLocalStorage } from '../../utilities/localStorage'
import Router from 'next/router'
import { parentURLs } from '@utils/polka'
import { toast } from 'react-toastify'

const SignIn = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<SignInPropsModel>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' })
  const [isFormFilled, setIsFormFilled] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [challenge, setChallenge] = useState('')
  const [handles, setHandles] = useState([])
  const [expiration, setExpiration] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [providerInfo, setProviderInfo] = useState({})

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
        toast.error('No polka address found', {
          theme: 'light'
        })
        throw Error('No polka address found')
      }

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
        if (!isIframe) Router.push('/homePage')
      } else {
        console.error('Sign In failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
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
  }, [handles, challenge, expiration])

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
          <div className={style.did_floating_label_content}>
            <input
              className={style.did_floating_input}
              type="text"
              placeholder=" "
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label className={style.did_floating_label}>{t('formEmail')}</label>
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
            <label className={style.did_floating_label}>{t('password')}</label>
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

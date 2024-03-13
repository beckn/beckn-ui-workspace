import React, { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import OpenCommerce from '../public/images/openCommerce.svg'
import { FormErrors, signUpValidateForm } from '../utilities/detailsForm-utils'
import style from '../components/detailsCard/ShippingForm.module.css'
import Styles from '../components/signIn/SignIn.module.css'
import { Box, Flex, Image, useToast } from '@chakra-ui/react'
import { SignUpPropsModel } from '../components/signIn/SignIn.types'
import Button from '../components/button/Button'
import Router from 'next/router'
import { fetchHandles, fetchChallenge, dsnpLogin } from '../components/signIn/signin.utils'
import { signPayloadWithExtension, payloadHandle } from '../utilities/signTransaction'
import { setLocalStorage } from '../utilities/localStorage'
import { dsnpCreate, dsnpRegister, getBlockNumber } from '../utilities/auth'
import { parentURLs } from '@utils/polka'
import { toast } from 'react-toastify'

const SignUp = () => {
  const { t } = useLanguage()
  const toast = useToast()
  const [formData, setFormData] = useState<SignUpPropsModel>({ name: '', email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', email: '', password: '' })
  const [expiration, setExpiration] = useState(0)
  const [isFormFilled, setIsFormFilled] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [challenge, setChallenge] = useState('')
  const [handles, setHandles] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [providerInfo, setProviderInfo] = useState({})

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
    setIsFormFilled(
      updatedFormData.name.trim() !== '' &&
        updatedFormData.email.trim() !== '' &&
        updatedFormData.password.trim() !== ''
    )
  }

  const handleRegister = async () => {
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
            title: 'Error!.',
            description: 'No polka address found',
            status: 'error',
            duration: 3000,
            isClosable: true
          })
          throw Error('No polka address found')
        }

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

          localStorage.setItem('token', token)
          if (!isIframe) Router.push('/homePage')
        } else {
          const errorData = await response.json()
          toast({
            title: 'Error!.',
            description: errorData.error.message,
            status: 'error',
            duration: 3000,
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

  return (
    <>
      <Box
        className={Styles.main_container}
        mt="40px"
      >
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label className={style.did_floating_label}>{t('formName')}</label>
              {formErrors.name && <div className={style.error}>{formErrors.name}</div>}
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
          buttonText={'Register'}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          handleOnClick={handleRegister}
          isDisabled={!isFormFilled}
        />
      </Box>
    </>
  )
}
export default SignUp

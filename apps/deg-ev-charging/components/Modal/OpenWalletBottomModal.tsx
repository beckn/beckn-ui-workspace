import Image from 'next/image'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import React, { useEffect, useRef, useState } from 'react'
import metaMaskWallet from '@public/images/mm-logo 1.svg'
import openSeaWallet from '@public/images/opensea-logo1.svg'
import openWallet from '@public/images/open-wallet.svg'
import { BottomModal, Input, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useVerifyOtpMutation } from '@services/UserService'
import { buttonStyles, checkboxLabels } from '@components/Modal'
import { AuthRootState, updateUserDetails } from '@store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { getMaskedMobileNumber } from '@utils/general'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import { useGetUserMutation } from '@services/walletService'
import { feedbackActions } from '@beckn-ui/common'
import { setShowInitialAlert } from '@store/user-slice'

interface OpenWalletBottomModalProps {
  modalType: 'wallet' | 'link' | 'otp' | 'alert' | null
  setModalType: (type: 'wallet' | 'link' | 'otp' | 'alert' | null) => void
  onClose?: () => void
}
const numberOfDigits = 6

const OpenWalletBottomModal: React.FC<OpenWalletBottomModalProps> = ({ modalType, setModalType }) => {
  const [OTP, setOTP] = useState(new Array(numberOfDigits).fill(''))
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([])
  const [checkboxes, setCheckboxes] = useState<Record<string, boolean>>(
    checkboxLabels.reduce((acc, label) => ({ ...acc, [label.toLowerCase()]: false }), {} as Record<string, boolean>)
  )
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  useVerifyOtpMutation()
  const [getUser] = useGetUserMutation()

  const [inputValue, setInputValue] = useState(`users/phone/${user?.agent?.agent_profile?.phone_number || ''}`)

  useEffect(() => {
    setCheckboxes({
      identities: user?.deg_wallet?.energy_identities_consent,
      assets: user?.deg_wallet?.energy_assets_consent,
      transactions: user?.deg_wallet?.energy_transactions_consent
    })
  }, [user])

  const handleCheckboxChange = (name: string) => {
    setCheckboxes((prev: Record<string, boolean>) => ({
      ...prev,
      [name.toLowerCase()]: !prev[name.toLowerCase()]
    }))
  }
  useEffect(() => {
    return () => {
      setOTP(new Array(numberOfDigits).fill(''))
    }
  }, [])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newArr = [...OTP]
    newArr[index] = value
    setOTP(newArr)

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleBackspaceAndEnter = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus()
    }
    if (e.key === 'Enter' && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleVerifyOtp = async () => {
    try {
      // await verifyOtp(data).unwrap()
      await handleLinkWallet({
        wallet_id: `/subjects/${inputValue}`,
        energy_identities_consent: false,
        energy_assets_consent: false,
        energy_transactions_consent: false
      })
      setModalType('alert')
      dispatch(
        feedbackActions.setToastData({
          toastData: { message: 'Wallet linked successfully!', display: true, type: 'success', description: '' }
        })
      )
    } catch (error) {
      console.error('OTP verification failed:', error)
    }
  }

  const handleValidateWalletProfileId = async () => {
    try {
      const response = await getUser(inputValue)
      const result = 'data' in response ? response.data : undefined

      if (result && Array.isArray(result) && result.length > 0) {
        dispatch(setShowInitialAlert(false))
        setModalType('otp')
      } else {
        console.error('Invalid profile ID')
        dispatch(
          feedbackActions.setToastData({
            toastData: { message: 'Error!', display: true, type: 'error', description: 'Invalid Profile ID' }
          })
        )
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleLinkWallet = async (payload: {
    wallet_id: string
    energy_identities_consent: boolean
    energy_assets_consent: boolean
    energy_transactions_consent: boolean
  }) => {
    const requestOptions = {
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    setIsLoading(true)

    axios
      .post(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/link`, payload, requestOptions)
      .then(response => {
        const result = response.data
        dispatch(updateUserDetails({ user: { ...user!, deg_wallet: result } }))
        console.log('Wallet linked successfully:', result)
      })
      .catch(error => {
        console.error('Wallet linking failed:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const walletOptions = [
    { text: 'MetaMask Wallet', image: metaMaskWallet, handleClick: () => console.log('meta') },
    { text: 'OpenSea Wallet', image: openSeaWallet, handleClick: () => console.log('opensea') },
    { text: 'Wallet', image: openWallet, handleClick: () => setModalType('link') }
  ]

  return (
    <div>
      {(() => {
        switch (modalType) {
          case 'wallet':
            return (
              <BottomModal
                title="Connect Wallet"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <div className="flex flex-col gap-2">
                  {walletOptions.map((wallet, idx) => (
                    <ShadowCardButton
                      key={idx}
                      text={wallet.text}
                      textStyle="start"
                      postIcon={
                        <Image
                          src={wallet.image}
                          alt={wallet.text}
                          width={24}
                          height={24}
                        />
                      }
                      handleClick={wallet.handleClick}
                      sx={buttonStyles}
                    />
                  ))}
                  <Typography
                    text="I don’t have a wallet"
                    fontSize="14px"
                    fontWeight="500"
                    sx={{ m: '10px', cursor: 'pointer' }}
                    onClick={() => setModalType(null)}
                  />
                </div>
              </BottomModal>
            )

          case 'link':
            return (
              <BottomModal
                title="Link to your Wallet profile"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <div className="mt-2.5">
                  <Input
                    label="Profile ID"
                    handleChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                    disabled={true}
                    type="text"
                    name={'profileId'}
                  />
                  <BecknButton
                    sx={{ bgColor: '#09BD71', color: 'white', mt: '20px' }}
                    handleClick={handleValidateWalletProfileId}
                  >
                    Link
                  </BecknButton>
                </div>
              </BottomModal>
            )

          case 'otp':
            return (
              <BottomModal
                title="OTP Verification"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <Typography
                  text={`Enter the one time password we have just sent to your ${getMaskedMobileNumber(user?.agent?.agent_profile?.phone_number?.toString() || '')}.`}
                  fontSize="12px"
                  fontWeight="400"
                  color="#80807F"
                />
                <div className="mt-6 flex flex-wrap gap-1">
                  {OTP.map((digit, index) => (
                    <input
                      key={index}
                      value={digit}
                      type="number"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={e => handleChange(e.target.value, index)}
                      onKeyUp={e => handleBackspaceAndEnter(e, index)}
                      ref={el => (otpBoxReference.current[index] = el)}
                      className="w-[42px] h-[46px] mx-1.5 border border-[#0000001A] bg-[#D9D9D933] rounded-lg text-center text-xl outline-none"
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-4 mr-2.5">
                  <Typography
                    text="Didn’t receive OTP?"
                    color="#80807F"
                  />
                  <Typography
                    text="Resend OTP"
                    color="#09BD71"
                    sx={{ ml: '5px', cursor: 'pointer' }}
                  />
                </div>
                <BecknButton
                  text="Verify"
                  handleClick={handleVerifyOtp}
                  sx={{ bgColor: '#09BD71', color: 'white', mt: '30px' }}
                />
              </BottomModal>
            )

          case 'alert':
            return (
              <BottomModal
                title="Alert"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <div className="flex flex-col gap-2.5 mb-5">
                  <Typography
                    text="Spark would like to fetch the following information from your wallet:"
                    fontSize="12px"
                    fontWeight="400"
                  />
                  <Typography
                    text="Select at least one to proceed"
                    fontSize="12px"
                    fontWeight="400"
                    color="#B4ABAB"
                  />
                </div>
                <div className="w-full flex flex-col mt-5 mb-10">
                  {checkboxLabels.map((label, index) => (
                    <label
                      key={label}
                      className={`flex items-center gap-3 py-3 cursor-pointer ${
                        index !== checkboxLabels.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checkboxes?.[label.toLowerCase()]}
                        onChange={() => handleCheckboxChange(label)}
                        className="w-6 h-6 rounded border-gray-300 text-[#4398E8] focus:ring-[#4398E8]"
                      />
                      <span className="text-sm text-[var(--ev-text)]">{label}</span>
                    </label>
                  ))}
                </div>
                <BecknButton
                  text="Confirm"
                  disabled={!Object.values(checkboxes).some(Boolean)}
                  handleClick={async () => {
                    if (user?.deg_wallet?.deg_wallet_id) {
                      await handleLinkWallet({
                        wallet_id: user?.deg_wallet?.deg_wallet_id,
                        energy_identities_consent: checkboxes.identities,
                        energy_assets_consent: checkboxes.assets,
                        energy_transactions_consent: checkboxes.transactions
                      })
                      dispatch(setShowInitialAlert(false))
                      setModalType(null)
                    }
                  }}
                />
                <BecknButton
                  text="Skip for now"
                  handleClick={() => {
                    dispatch(setShowInitialAlert(false))
                    setModalType(null)
                  }}
                  variant="outline"
                  color="#D14040"
                  sx={{ border: '1px' }}
                />
              </BottomModal>
            )

          default:
            return null
        }
      })()}
    </div>
  )
}

export default OpenWalletBottomModal

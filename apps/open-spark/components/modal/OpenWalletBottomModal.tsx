import { Box, VStack, Image, Flex, Checkbox } from '@chakra-ui/react'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import React, { useRef, useState } from 'react'
import metaMaskWallet from '@public/images/mm-logo 1.svg'
import openSeaWallet from '@public/images/opensea-logo1.svg'
import openWallet from '@public/images/open-wallet.svg'
import { BottomModal, Input, Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useVerifyOtpMutation } from '@services/UserService'
import { buttonStyles, checkboxLabels } from '@components/constant'

interface OpenWalletBottomModalProps {
  modalType: 'wallet' | 'link' | 'otp' | 'alert' | null
  setModalType: (type: 'wallet' | 'link' | 'otp' | 'alert' | null) => void
  onClose?: () => void
}

const OpenWalletBottomModal: React.FC<OpenWalletBottomModalProps> = ({ modalType, setModalType }) => {
  const [inputValue, setInputValue] = useState('')
  const [OTP, setOTP] = useState(new Array(6).fill(''))
  const otpBoxReference = useRef<any>([])
  const [checkboxes, setCheckboxes] = useState(
    checkboxLabels.reduce((acc, label) => ({ ...acc, [label.toLowerCase()]: false }), {})
  )

  const [verifyOtp] = useVerifyOtpMutation()

  const handleCheckboxChange = (name: string) => {
    setCheckboxes(prev => ({
      ...prev,
      [name.toLowerCase()]: !prev[name.toLowerCase()]
    }))
  }

  const handleOTPChange = (value: string, index: number) => {
    let newArr = [...OTP]
    newArr[index] = value
    setOTP(newArr)

    if (value && index < 5) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  const handleVerifyOtp = async () => {
    const data = { otp: Number(OTP.join('')) }

    try {
      await verifyOtp(data).unwrap()
      setModalType('alert')
    } catch (error) {
      console.error('OTP verification failed:', error)
    }
  }

  const walletOptions = [
    { text: 'Meta Mask Wallet', image: metaMaskWallet, handleClick: () => console.log('meta') },
    { text: 'OpenSea Wallet', image: openSeaWallet, handleClick: () => console.log('opensea') },
    { text: 'Open Wallet', image: openWallet, handleClick: () => setModalType('link') }
  ]

  return (
    <Box>
      {(() => {
        switch (modalType) {
          case 'wallet':
            return (
              <BottomModal
                title="Connect Wallet"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <VStack>
                  {walletOptions.map((wallet, idx) => (
                    <ShadowCardButton
                      key={idx}
                      text={wallet.text}
                      textStyle="start"
                      postIcon={
                        <Image
                          src={wallet.image}
                          alt={wallet.text}
                          boxSize="24px"
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
                </VStack>
              </BottomModal>
            )

          case 'link':
            return (
              <BottomModal
                title="Link to your Open wallet profile"
                isOpen={true}
                onClose={() => setModalType(null)}
              >
                <Box mt="10px">
                  <Input
                    label="Profile ID"
                    handleChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                    type="number"
                    name={'profileId'}
                  />
                  <BecknButton
                    children="Link"
                    sx={{ bgColor: '#09BD71', color: 'white', mt: '20px' }}
                    handleClick={() => setModalType('otp')}
                  />
                </Box>
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
                  text="Enter the one-time password we just sent to your registered mobile number."
                  fontSize="12px"
                  fontWeight="400"
                  color="#80807F"
                />
                <Box mt="25px">
                  {OTP.map((digit, index) => (
                    <input
                      key={index}
                      value={digit}
                      maxLength={1}
                      onChange={e => handleOTPChange(e.target.value, index)}
                      ref={el => (otpBoxReference.current[index] = el)}
                      style={{
                        width: '42px',
                        height: '46px',
                        margin: '0 6px',
                        border: '1px solid #0000001A',
                        backgroundColor: '#D9D9D933',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: 'xl',
                        outline: 'none'
                      }}
                    />
                  ))}
                </Box>
                <Flex
                  justifyContent="end"
                  mt="1rem"
                  mr="10px"
                >
                  <Typography text="Didn’t receive OTP?" />
                  <Typography
                    text="Resend OTP"
                    color="#09BD71"
                    sx={{ ml: '5px', cursor: 'pointer', _hover: { textDecoration: 'underline' } }}
                  />
                </Flex>
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
                <Flex
                  flexDir="column"
                  gap="10px"
                  mb="20px"
                >
                  <Typography
                    text="Open Spark would like to fetch the following information from your wallet:"
                    fontSize="12px"
                    fontWeight="400"
                  />
                  <Typography
                    text="Select at least one to proceed"
                    fontSize="12px"
                    fontWeight="400"
                    color="#B4ABAB"
                  />
                </Flex>
                <VStack
                  spacing={0}
                  width="100%"
                  align="stretch"
                  mt={5}
                  mb={'40px'}
                >
                  {checkboxLabels.map((label, index) => (
                    <Box
                      key={label}
                      borderBottom={index !== checkboxLabels.length - 1 ? '1px solid' : 'none'}
                      borderColor="gray.200"
                      py={3}
                    >
                      <Checkbox
                        isChecked={checkboxes[label.toLowerCase()]}
                        onChange={() => handleCheckboxChange(label)}
                        width="100%"
                        spacing={3}
                        sx={{
                          '.chakra-checkbox__control': {
                            width: '24px',
                            height: '24px',
                            borderRadius: '3px',
                            _checked: {
                              bg: '#4398E8',
                              borderColor: '#4398E8'
                            }
                          }
                        }}
                      >
                        {label}
                      </Checkbox>
                    </Box>
                  ))}
                </VStack>
                <BecknButton
                  children="Confirm"
                  disabled={!Object.values(checkboxes).some(Boolean)}
                  handleClick={() => setModalType(null)}
                />
                <BecknButton
                  children="Skip for now"
                  handleClick={() => setModalType(null)}
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
    </Box>
  )
}

export default OpenWalletBottomModal

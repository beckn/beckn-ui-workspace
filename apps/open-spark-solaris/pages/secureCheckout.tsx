import { DetailCard } from '@beckn-ui/becknified-components'
import { feedbackActions } from '@beckn-ui/common'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Flex, Text, Image, Divider, Input, Box } from '@chakra-ui/react'
import Visa from '@public/images/stripe_icon.svg'
import { AuthRootState } from '@store/auth-slice'
import Router from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SecureCheckout = () => {
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [otp, setOtp] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const dispatch = useDispatch()

  const maskedPhone = user?.agent?.agent_profile?.phone_number
    ? String(user?.agent?.agent_profile?.phone_number).slice(0, 2) +
      'XXXX' +
      String(user?.agent?.agent_profile?.phone_number).slice(-4)
    : '98XXXX554'

  const handleVerify = () => {
    if (otp.length === 6) {
      setIsVerified(true) // Enable "Proceed" after verification
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: 'OTP verified successfully, Click on Proceed to continue'
          }
        })
      )
    }
  }

  return (
    <>
      <DetailCard>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Text
            fontSize="14px"
            fontWeight="700"
            color="#006FCC"
          >
            American Express
          </Text> */}
          <Image
            src={Visa}
            width="auto"
            height="30px"
          />
        </Flex>
        <Divider
          mt="10px"
          mb="20px"
        />
        <Text
          fontSize="12px"
          color="#80807F"
          mb="10px"
        >
          We have sent a verification code by text message to {maskedPhone}.
        </Text>
        <Text
          mb="5px"
          fontSize="12px"
        >
          Verification Code
        </Text>
        <Input
          border="1px solid #000000"
          value={otp}
          type="number"
          onChange={e => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          onKeyDown={e => {
            if (e.key === '-' || e.key === 'e') {
              e.preventDefault()
            }
            if (e.key === 'ArrowDown' && parseInt(otp) <= 1) {
              e.preventDefault()
            }
          }}
        />
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          mt="5px"
          mb="30px"
        >
          <Text
            fontSize="12px"
            mr="5px"
          >
            Didn't receive OTP?
          </Text>
          <Text
            fontSize="12px"
            color="#4398E8"
            cursor="pointer"
          >
            Resend
          </Text>
        </Flex>
        <BecknButton
          text="Verify"
          handleClick={handleVerify}
          disabled={otp.length !== 6}
        />
      </DetailCard>
      <Box
        position="absolute"
        bottom="calc(0px + 10px)"
        w="calc(100% - 40px)"
      >
        <BecknButton
          text="Proceed"
          handleClick={() => Router.push('/retailOrderConfirmation')}
          disabled={!isVerified}
        />
      </Box>
    </>
  )
}

export default SecureCheckout

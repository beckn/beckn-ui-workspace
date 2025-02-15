import { DetailCard } from '@beckn-ui/becknified-components'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Flex, Text, Image, Divider, Input, Box } from '@chakra-ui/react'
import Visa from '@public/images/Bitmap.svg'
import Router from 'next/router'
import React from 'react'

const secureCheckout = () => {
  return (
    <>
      <DetailCard>
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Text
            fontSize={'14px'}
            fontWeight="700"
            color={'#B02A30'}
          >
            ICICI Bank
          </Text>
          <Image src={Visa} />
        </Flex>
        <Divider
          mt="10px"
          mb="20px"
        />
        <Text
          fontSize={'12px'}
          color="#80807F"
          mb="10px"
        >
          we have sent a verification code by text message to +91 98XXXX554.
        </Text>
        <Text
          mb="5px"
          fontSize={'12px'}
        >
          Verification Code
        </Text>
        <Input border={'1px solid #000000'} />
        <Flex
          alignItems={'center'}
          justifyContent="flex-end"
          mt="5px"
          mb="30px"
        >
          <Text fontSize={'12px'}>Didn’t receive OTP? </Text>
          <Text
            fontSize={'12px'}
            color="#4398E8"
          >
            Resend
          </Text>
        </Flex>
        <BecknButton
          text="Verify"
          handleClick={() => {}}
        />
      </DetailCard>
      <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
      >
        <BecknButton
          text="Proceed"
          handleClick={() => {
            Router.push('/retailOrderConfirmation')
          }}
        />
      </Box>
    </>
  )
}

export default secureCheckout

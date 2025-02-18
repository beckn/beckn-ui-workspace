import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '@public/images/orderConfirmmark.svg'
import { useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { Box, Flex } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { getPayloadForConfirm } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  // const [confirm, { isLoading, data }] = useConfirmMutation()

  // const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  // const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)
  // const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  // const bearerToken = Cookies.get('authToken')
  // const axiosConfig = {
  //   headers: {
  //     Authorization: `Bearer ${bearerToken}`,
  //     'Content-Type': 'application/json' // You can set the content type as needed
  //   }
  // }

  // useEffect(() => {
  //   if (initResponse && initResponse.length > 0) {
  //     const payLoad = getPayloadForConfirm(initResponse)
  //     confirm(payLoad)
  //   }
  // }, [])

  // if (isLoading || !confirmResponse) {
  //   return (
  //     <Box
  //       display={'grid'}
  //       height={'calc(100vh - 300px)'}
  //       alignContent={'center'}
  //     >
  //       <LoaderWithMessage
  //         loadingText={t.pleaseWait}
  //         loadingSubText={t.confirmLoaderSubtext}
  //       />
  //     </Box>
  //   )
  // }

  return (
    <Flex
      flexDir="column"
      justifyContent={'space-between'}
      height="calc(100vh - 100px)"
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="-2rem auto"
      backgroundColor="white"
      justifySelf={'center'}
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <Box>
        <ConfirmationPage
          className="kuza-order-confornation"
          schema={{
            iconSrc: orderConfirmmark,
            successOrderMessage: 'Deposit Successful',
            gratefulMessage: '',
            buttons: []
          }}
        />
      </Box>
      <BecknButton
        text="Go Back Home"
        handleClick={() => {
          router.push('/')
        }}
        variant="outline"
        dataTest={testIds.orderConfirmation_goBackToHome}
        colorScheme="primary"
      />
    </Flex>
  )
}

export default OrderConfirmation

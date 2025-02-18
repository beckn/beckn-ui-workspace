import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '@public/images/orderConfirmmark.svg'
import { useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { getPayloadForConfirm } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'

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
    <Box mt={'-2rem'}>
      <ConfirmationPage
        className="kuza-order-confornation"
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: 'Deposit Successful',
          gratefulMessage: '',
          buttons: [
            {
              text: 'View My Funds',
              handleClick: () => {
                router.push('/myFunds')
              },
              disabled: false,
              variant: 'solid',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_viewOrderButton
            },
            {
              text: 'Go Back Home',
              handleClick: () => {
                router.push('/')
              },
              disabled: false,
              variant: 'outline',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_goBackToHome
            }
          ]
        }}
      />
    </Box>
  )
}

export default OrderConfirmation

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/booking_confirm.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box, Image } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
// import { getPayloadForOrderHistoryPost } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import { ORDER_CATEGORY_ID } from '../lib/config'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/payload'
import { getCountryCode } from '@utils/general'
import { cartActions } from '@beckn-ui/common'

const OrderConfirmation = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const { t } = useLanguage()

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const router = useRouter()
  const [confirm, { isLoading }] = useConfirmMutation()
  const dispatch = useDispatch()

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout?.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout?.confirmResponse)

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payload = getPayloadForConfirm(initResponse, { location: getCountryCode() })
      confirm(payload)
    }
  }, [initResponse])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      localStorage.setItem('confirmResponse', JSON.stringify(confirmResponse))
      const ordersPayload = getPayloadForOrderHistoryPost(confirmResponse, ORDER_CATEGORY_ID)
      ordersPayload.data.forEach(payload => {
        axios
          .post(`${strapiUrl}/unified-beckn-energy/order-history/create`, payload, axiosConfig)
          .then(res => {
            setIsOrderConfirmed(true)
            dispatch(cartActions.clearCart())
            return res
          })
          .catch(err => console.error(err))
      })
    }
  }, [confirmResponse])

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
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
    >
      <ConfirmationPage
        className="order-confornation"
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: 'Congratulations! your booking is successful!',
          gratefulMessage: '',

          buttons: [
            {
              text: 'Unlock Chargering Port',
              handleClick: () => {
                if (confirmResponse && confirmResponse.length > 0) {
                  const selectedOrders = confirmResponse.map(response => {
                    const orderId = response.message.orderId
                    const bppId = response.context.bpp_id
                    const bppUri = response.context.bpp_uri

                    return { orderId, bppId, bppUri }
                  })

                  // Dispatch each order separately
                  selectedOrders.forEach(orderDetails => {
                    dispatch(orderActions.addSelectedOrder({ orderDetails }))

                    // Save each order in localStorage
                    localStorage.setItem('selectedOrder', JSON.stringify(orderDetails))
                  })

                  dispatch(checkoutActions.clearState())
                }

                router.push('/monitorCharging')
              },
              rightIcon: (
                <Image
                  src="/images/unlock_icon.svg"
                  alt="unlock_icon"
                  width={'20px'}
                  height={'20px'}
                />
              ),
              isLoading: isLoading,
              disabled: !isOrderConfirmed,
              variant: 'solid',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_viewOrderButton
            }
          ]
        }}
      />
    </Box>
  )
}

export default OrderConfirmation

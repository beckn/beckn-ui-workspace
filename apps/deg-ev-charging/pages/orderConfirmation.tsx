import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/booking_confirm.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box, Image } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { CheckoutBeckn20RootState, checkoutBeckn20Actions } from '@beckn-ui/common'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { useConfirmMutation } from '@beckn-ui/common/src/services/beckn-2.0/confirm'
import { testIds } from '@shared/dataTestIds'
import { ORDER_CATEGORY_ID, ROLE, ROUTE_TYPE } from '../lib/config'
import {
  getPayloadForOrderHistoryPost,
  buildConfirmRequest20,
  normalizeConfirmResponse20ToLegacy
} from '@lib/beckn-2.0'
import type { InitResponse } from '@beckn-ui/common/lib/types/beckn-2.0/init'
import { extractAuthAndHeader, toBase64 } from '@utils/general'
import { cartActions } from '@store/cart-slice'
import { clearSource, ConfirmResponseModel, feedbackActions, QuantityDetails } from '@beckn-ui/common'
import { AuthRootState } from '@store/auth-slice'
import { generateAuthHeader, generateKeyPairFromString } from '@store/cryptoUtilService'
import { useAddDocumentMutation, useGetVerificationMethodsMutation } from '@services/walletService'

const OrderConfirmation = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const { t } = useLanguage()

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const router = useRouter()
  const [confirm, { isLoading }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()

  const { user } = useSelector((state: AuthRootState) => state.auth)
  const initResponseRaw = useSelector((state: CheckoutBeckn20RootState) => state.checkoutBeckn20?.initResponseRaw)
  const confirmResponse = useSelector((state: CheckoutBeckn20RootState) => state.checkoutBeckn20?.confirmResponse)

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  const extractItemsWithProvider = (orders: ConfirmResponseModel[] | string): string => {
    if (!orders || (Array.isArray(orders) && orders.length === 0)) return ''

    if (typeof orders === 'string') {
      return orders.length > 50 ? orders.slice(0, 47) + '...' : orders
    }

    return orders
      .map(order => {
        const providerName = order.message.provider.name
        const itemNames = order.message.items.map((item: any) => item.name).join(', ')
        let result = `${itemNames} by ${providerName}`

        return result.length > 50 ? result.slice(0, 47) + '...' : result
      })
      .join('; ')
  }

  const attestDocument = async (did: string, transactionType: 'PHYSICAL_ASSETS' | 'TRANSACTION') => {
    try {
      const requestOptions = {
        method: 'POST',
        withCredentials: true
      }

      const res = await axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: transactionType,
          document_id: did,
          deg_wallet_id: user?.deg_wallet?.deg_wallet_id!
        },
        requestOptions
      )
    } catch (err) {
      console.error('Error attesting document:', err)
    }
  }

  useEffect(() => {
    if (initResponseRaw && initResponseRaw.length > 0 && (!confirmResponse || confirmResponse.length === 0)) {
      const initResp = initResponseRaw[0] as InitResponse
      const payload = buildConfirmRequest20(initResp)
      confirm(payload)
        .unwrap()
        .then(confirmResp => {
          dispatch(
            checkoutBeckn20Actions.setConfirmResponse({
              data: [normalizeConfirmResponse20ToLegacy(confirmResp) as any]
            })
          )
        })
        .catch(() => {})
    }
  }, [initResponseRaw, confirmResponse, dispatch, confirm])

  const handleOnAddToWallet = async () => {
    if (!confirmResponse) return

    try {
      const subjectKey = user?.deg_wallet?.deg_wallet_id.replace('/subjects/', '')
      const { publicKey, privateKey } = await generateKeyPairFromString(subjectKey!)

      const verificationMethodsRes = await getVerificationMethods(user?.deg_wallet?.deg_wallet_id!).unwrap()
      const { did, challenge } = verificationMethodsRes[0]

      // Process each confirmation response
      for (const response of confirmResponse) {
        const { context, message } = response
        const generatedOrderId = message.orderId
        const totalPrice =
          Number(message.quote.price.value) *
          Number((message.items?.[0]?.quantity as QuantityDetails)?.selected.measure.value)
        const totalItems = message.items.length
        const totalItemsStr = extractItemsWithProvider([response]) // Process per index
        const orderPlacedAt = Math.floor(new Date(context.timestamp).getTime() / 1000)

        const docDetails = JSON.stringify(response)

        const authHeaderRes = await generateAuthHeader({
          subjectId: user?.deg_wallet?.deg_wallet_id!,
          verification_did: did,
          privateKey,
          publicKey,
          payload: {
            name: `transactions/type/ev_charging/energy/id/${generatedOrderId}/amount/${totalPrice}/item_str/${totalItemsStr}/${orderPlacedAt}`,
            stream: toBase64(docDetails)
          }
        })

        const { authorization, payload } = extractAuthAndHeader(authHeaderRes)
        if (authorization && payload) {
          const addDocPayload = {
            subjectId: user?.deg_wallet?.deg_wallet_id!,
            payload,
            authorization
          }

          const res: any = await addDocument(addDocPayload).unwrap()
          console.log(res)
          await attestDocument(res?.[0]?.did, 'TRANSACTION')

          // Show success message for each index processed
          // dispatch(
          //   feedbackActions.setToastData({
          //     toastData: {
          //       message: 'Success',
          //       display: true,
          //       type: 'success',
          //       description: `Order ${generatedOrderId} added successfully!`
          //     }
          //   })
          // )
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Error',
                display: true,
                type: 'error',
                description: `Failed to add order ${generatedOrderId}.`
              }
            })
          )
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Error',
            display: true,
            type: 'error',
            description: 'Something went wrong!'
          }
        })
      )
    }
  }

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      if (user?.deg_wallet && user?.deg_wallet.energy_transactions_consent) {
        handleOnAddToWallet()
      }

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
              text: 'View order details',
              handleClick: () => {
                if (confirmResponse && confirmResponse.length > 0) {
                  const first = confirmResponse[0]
                  const orderDetails = {
                    orderId: first.message.orderId,
                    bppId: first.context.bpp_id,
                    bppUri: first.context.bpp_uri
                  }
                  dispatch(orderActions.addSelectedOrder({ orderDetails }))
                  localStorage.setItem('selectedOrder', JSON.stringify(orderDetails))
                }
                router.push('/orderDetails')
              },
              variant: 'outline',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_viewOrderButton
            },
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
                  dispatch(checkoutBeckn20Actions.clearState())
                  dispatch(clearSource())
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

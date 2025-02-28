import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { LoaderWithMessage, utilGenerateEllipsedText } from '@beckn-ui/molecules'
import { ConfirmResponseModel, ICartRootState } from '@beckn-ui/common/lib/types'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
// import { getPayloadForOrderHistoryPost } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { testIds } from '@shared/dataTestIds'
import {
  FINANCE_ORDER_CATEGORY_ID,
  RENTAL_ORDER_CATEGORY_ID,
  RETAIL_ORDER_CATEGORY_ID,
  ROLE,
  ROUTE_TYPE
} from '../lib/config'
import { cartActions } from '@beckn-ui/common'
import { RootState } from '@store/index'
import { OrderHistoryData } from '@lib/types/orderHistory'
import { useAddDocumentMutation, useGetVerificationMethodsMutation } from '@services/walletService'
import { generateAuthHeader, generateKeyPairFromString } from '@services/cryptoUtilService'
import { AuthRootState } from '@store/auth-slice'
import { extractAuthAndHeader, generateRandomCode, toBase64, toSnakeCase } from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'
import { getRentalPayloadForConfirm } from '@utils/confirm-utils'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/payload'

const retailOrderConfirmation = () => {
  const { t } = useLanguage()
  const type = useSelector((state: RootState) => state.navigation.type)

  const router = useRouter()
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])
  const [confirm, { isLoading, data }] = useConfirmMutation()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [addDocument, { isLoading: addDocLoading }] = useAddDocumentMutation()
  const [getVerificationMethods, { isLoading: verificationMethodsLoading }] = useGetVerificationMethodsMutation()
  const [orderId, setOrderId] = useState<string>()

  const [timestamp, setTimestamp] = useState<Record<string, any>>({
    fromTime: localStorage.getItem('fromTimestamp'),
    toTime: localStorage.getItem('toTimestamp')
  })
  const [toTimestamp, setToTimestamp] = useState<string>()

  // useEffect(() => {
  //   const fromTimestamp = localStorage.getItem('fromTimestamp')
  //   const toTimestamp = localStorage.getItem('toTimestamp')
  //   if (fromTimestamp && toTimestamp) {
  //     setFromTimestamp(fromTimestamp)
  //     setToTimestamp(toTimestamp)
  //   }
  // }, [])

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const getOrderCategoryId = (type: any) => {
    if (type === 'RENT_AND_HIRE') {
      return RENTAL_ORDER_CATEGORY_ID
    } else if (type === 'MY_STORE') {
      return RETAIL_ORDER_CATEGORY_ID
    } else {
      return FINANCE_ORDER_CATEGORY_ID
    }
  }

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
        const totalPrice = message.quote.price.value
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
            name: `transactions/type/domain/energy/id/${generatedOrderId}/amount/${totalPrice}/item_str/${totalItemsStr}/${orderPlacedAt}`,
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
      setOrderId(confirmResponse[0].message.orderId.slice(0, 8))
      handleOnAddToWallet()
    }
  }, [confirmResponse])

  const getCartItemsWithQuantity = () => {
    const cartItemQuantity: any = {}
    cartItems.forEach((item: any) => {
      if (cartItemQuantity[item.providerId]) {
        const totalPrice = Number(item.price.value) * item.quantity
        cartItemQuantity[item.providerId][item.id] = {
          id: item.id,
          quantity: item.quantity,
          totalPrice: totalPrice
        }

        cartItemQuantity[item.providerId]['totalPrice'] =
          cartItemQuantity?.[item.providerId]?.['totalPrice'] || 0 + totalPrice
      } else {
        cartItemQuantity[item.providerId] = {}
        cartItemQuantity[item.providerId][item.id] = {
          id: item.id,
          quantity: item.quantity,
          totalPrice: Number(item.price.value) * item.quantity
        }
        cartItemQuantity[item.providerId]['totalPrice'] = Number(item.price.value) * item.quantity
      }
    })
    console.log(cartItemQuantity)
    return cartItemQuantity
  }
  console.log(getCartItemsWithQuantity())
  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payload =
        type === 'RENT_AND_HIRE'
          ? getRentalPayloadForConfirm(initResponse, timestamp.fromTime!, timestamp.toTime!)
          : getPayloadForConfirm(initResponse, getCartItemsWithQuantity()) // fixed temporary once Rahul fixes the changes regarding dynamic price calculation on BE revert the chnges and do the fixes accord.
      confirm(payload)
    }
  }, [initResponse, timestamp])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const ordersPayload = getPayloadForOrderHistoryPost(
        confirmResponse,
        getOrderCategoryId(type),
        getCartItemsWithQuantity()
      ) // fixed temporary once Rahul fixes the changes regarding dynamic price calculation on BE revert the chnges and do the fixes accord.
      ordersPayload.data.forEach(payload => {
        axios
          .post(`${strapiUrl}/unified-beckn-energy/order-history/create`, payload, axiosConfig)
          .then(res => {
            return res
          })
          .catch(err => console.error(err))
      })
    }
  }, [confirmResponse])

  if (isLoading || !confirmResponse) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.confirmLoaderSubtext}
        />
      </Box>
    )
  }

  return (
    <Box mt={'-2rem'}>
      <ConfirmationPage
        className="kuza-order-confornation"
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: 'Order Placed!',
          gratefulMessage: 'The order has been placed successfully.',

          buttons: [
            {
              text: type === 'RENT_AND_HIRE' ? 'View My Rentals' : 'View Order Details',
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

                if (type === 'RENT_AND_HIRE') {
                  router.push('/myRental')
                } else {
                  router.push('/orderHistory')
                }
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
                dispatch(checkoutActions.clearState())
                dispatch(cartActions.clearCart())
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

export default retailOrderConfirmation

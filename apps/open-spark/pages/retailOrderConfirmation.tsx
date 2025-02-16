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
import { ConfirmResponseModel } from '@beckn-ui/common/lib/types'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@beckn-ui/common/src/utils'
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
import { extractAuthAndHeader, toBase64, toSnakeCase } from '@utils/general'
import { feedbackActions } from '@beckn-ui/common'

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

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)
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

  const extractItemsWithProvider = (orders: ConfirmResponseModel[]): string => {
    if (!orders || orders.length === 0) return ''

    return orders
      .map(order => {
        const providerName = order.message.provider.name
        const itemNames = order.message.items.map((item: any) => item.name).join(', ')
        let result = `${itemNames} by ${providerName}`

        return result.length > 50 ? result.slice(0, 47) + '...' : result
      })
      .join('; ')
  }

  const attestDocument = () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      }

      const res = axios.post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/attest`,
        {
          wallet_doc_type: 'TRANSACTION',
          document_id:
            '/subjects/users/phone/8899008890/documents/assets/physical/type/battery_test/source/wallet/sample-invoice.pdf'
        },
        requestOptions
      )
    } catch (err) {
      console.error('Error attesting document:', err)
    }
  }

  const handleOnAddToWallet = async () => {
    const orderConfirmationData = confirmResponse
    if (orderConfirmationData) {
      try {
        const subjectKey = user?.deg_wallet?.deg_wallet_id.replace('/subjects/', '')
        const { publicKey, privateKey } = await generateKeyPairFromString(subjectKey!)

        const data: any = orderConfirmationData

        const docDetails = JSON.stringify(data)

        const verificationMethodsRes = await getVerificationMethods(user?.deg_wallet?.deg_wallet_id!).unwrap()
        const { did, challenge } = verificationMethodsRes[0]

        const generatedOrderId = confirmResponse[0].message.orderId
        const totalPrice = confirmResponse[0].message.quote.price.value
        const totalItems = confirmResponse[0].message.items.length
        const totalItemsStr = extractItemsWithProvider(confirmResponse)

        const authHeaderRes = await generateAuthHeader({
          subjectId: user?.deg_wallet?.deg_wallet_id!,
          verification_did: did,
          privateKey,
          publicKey,
          payload: {
            name: `transactions/type/domain/energy/id/${generatedOrderId}/amount/${totalPrice}/total_items/${totalItems}/item_str/${totalItemsStr}`,
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

          const res = await addDocument(addDocPayload).unwrap()
          console.log(res)
          // await attestDocument()

          // dispatch(
          //   feedbackActions.setToastData({
          //     toastData: { message: 'Success', display: true, type: 'success', description: 'Added Successfully!' }
          //   })
          // )
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: { message: 'Error', display: true, type: 'error', description: 'Something went wrong!' }
            })
          )
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }
  }

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      setOrderId(confirmResponse[0].message.orderId.slice(0, 8))
      handleOnAddToWallet()
    }
  }, [confirmResponse])

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad)
    }
  }, [])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const ordersPayload = getPayloadForOrderHistoryPost(confirmResponse, getOrderCategoryId(type))
      axios
        .post(`${strapiUrl}/unified-beckn-energy/order-history/create`, ordersPayload, axiosConfig)
        .then(res => {
          return res
        })
        .catch(err => console.error(err))
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
                const orderId = confirmResponse[0].message.orderId
                const bppId = confirmResponse[0].context.bpp_id
                const bppUri = confirmResponse[0].context.bpp_uri

                dispatch(orderActions.addSelectedOrder({ orderDetails: { orderId, bppId, bppUri } }))
                const orderObjectForStatusCall = {
                  bppId: bppId,
                  bppUri: bppUri,
                  orderId: orderId
                }
                localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
                dispatch(checkoutActions.clearState())
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

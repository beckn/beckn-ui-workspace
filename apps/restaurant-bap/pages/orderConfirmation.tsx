import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import { Box, Container, Text, VStack, Button, Icon } from '@chakra-ui/react'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@beckn-ui/common/src/utils'
import { useConfirmMutation } from '@beckn-ui/common/src/services/confirm'
import { ORDER_CATEGORY_ID } from '../lib/config'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [confirm, { isLoading }] = useConfirmMutation()
  const dispatch = useDispatch()
  const [orderId, setOrderId] = useState<string>()

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const confirmResponse = useSelector((state: CheckoutRootState) => state.checkout.confirmResponse)

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      const orderIds: string[] = []
      confirmResponse.forEach(response => {
        orderIds.push(response.message.orderId.slice(0, 8))
      })
      setOrderId(orderIds.join(', '))
    }
  }, [confirmResponse])

  useEffect(() => {
    if (initResponse && initResponse.length > 0) {
      const payLoad = getPayloadForConfirm(initResponse)
      confirm(payLoad)
        .then(() => {
          dispatch(cartActions.clearCart())
        })
        .catch((error: unknown) => {
          console.error('Order confirmation error:', error)
          const errorMessage =
            (error as { data?: { error?: { message?: string } } })?.data?.error?.message ||
            (error as { message?: string })?.message ||
            'Failed to confirm order. Please try again.'

          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Order Confirmation Failed',
                display: true,
                type: 'error',
                description: errorMessage
              }
            })
          )

          // Redirect back to checkout on error
          setTimeout(() => {
            router.push('/checkout')
          }, 2000)
        })
    }
  }, [initResponse, confirm, dispatch, router])

  useEffect(() => {
    if (confirmResponse && confirmResponse.length > 0) {
      confirmResponse.forEach(async response => {
        const ordersPayload = getPayloadForOrderHistoryPost(response, ORDER_CATEGORY_ID)
        await axios
          .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
          .then(res => res)
          .catch(err => console.error(err))
      })
    }
  }, [confirmResponse])

  const handleViewOrder = () => {
    if (confirmResponse && confirmResponse.length > 0) {
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
      router.push('/orderDetails')
    }
  }

  const handleGoHome = () => {
    dispatch(checkoutActions.clearState())
    router.push('/')
  }

  if (isLoading || !confirmResponse) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait || 'Please wait'}
          loadingSubText="Confirming your order..."
        />
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '40px', md: '60px' }}
    >
      <Container
        maxW="600px"
        px="24px"
      >
        <VStack
          spacing="32px"
          bg="white"
          borderRadius="24px"
          p={{ base: '32px', md: '48px' }}
          boxShadow="0 4px 20px rgba(0,0,0,0.1)"
          textAlign="center"
        >
          {/* Success Icon */}
          <Box
            w="100px"
            h="100px"
            borderRadius="full"
            bg="linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 8px 24px rgba(76, 175, 80, 0.4)"
          >
            <Icon
              as={FiCheckCircle}
              w="50px"
              h="50px"
              color="white"
            />
          </Box>

          {/* Success Message */}
          <VStack spacing="12px">
            <Text
              fontSize={{ base: '28px', md: '36px' }}
              fontWeight="800"
              color="gray.800"
            >
              Order Placed! 🎉
            </Text>
            <Text
              fontSize={{ base: '16px', md: '18px' }}
              color="gray.600"
              maxW="400px"
            >
              Your order has been successfully placed. Thank you for ordering with QuickBites!
            </Text>
          </VStack>

          {/* Order ID */}
          {orderId && (
            <Box
              bg="orange.50"
              borderRadius="16px"
              p="20px"
              w="100%"
              border="2px dashed"
              borderColor="orange.200"
            >
              <Text
                fontSize="14px"
                color="gray.600"
                mb="4px"
              >
                Order ID
              </Text>
              <Text
                fontSize="24px"
                fontWeight="700"
                color="#FF6B35"
                letterSpacing="2px"
              >
                #{orderId.toUpperCase()}
              </Text>
            </Box>
          )}

          {/* Delivery Info */}
          <Box
            bg="gray.50"
            borderRadius="12px"
            p="16px"
            w="100%"
          >
            <Text
              fontSize="14px"
              color="gray.600"
            >
              Estimated delivery time
            </Text>
            <Text
              fontSize="20px"
              fontWeight="700"
              color="gray.800"
            >
              30-45 minutes
            </Text>
          </Box>

          {/* Action Buttons */}
          <VStack
            spacing="12px"
            w="100%"
          >
            <Button
              w="100%"
              bg="#FF6B35"
              color="white"
              size="lg"
              borderRadius="12px"
              py="20px"
              fontSize="18px"
              fontWeight="700"
              leftIcon={<FiPackage />}
              onClick={handleViewOrder}
              _hover={{
                bg: '#E55A2B',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
              }}
            >
              View Order Details
            </Button>

            <Button
              w="100%"
              variant="solid"
              color={'#FF6B35'}
              size="lg"
              borderRadius="12px"
              py="20px"
              fontSize="18px"
              fontWeight="700"
              leftIcon={<FiHome />}
              onClick={handleGoHome}
              _hover={{
                bg: 'orange.50',
                transform: 'translateY(-2px)'
              }}
            >
              Go Back Home
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default OrderConfirmation

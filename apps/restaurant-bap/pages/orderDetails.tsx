import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import { OrderDetails as BecknOrderDetails } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useLanguage } from '@hooks/useLanguage'
import { OrderRootState } from '@beckn-ui/common'

const OrderDetails = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const selectedOrder = useSelector((state: OrderRootState) => state.orders.selectedOrder)

  if (!selectedOrder) {
    return (
      <Box
        p="40px"
        textAlign="center"
      >
        No order selected
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py="24px"
    >
      <Container maxW="1200px">
        <BecknOrderDetails
          schema={{
            orderStatus: {
              status: 'CONFIRMED',
              statusText: 'Order Confirmed'
            },
            orderInfo: {
              orderId: selectedOrder.orderId,
              orderDate: new Date().toLocaleDateString(),
              totalAmount: '0',
              currency: 'INR'
            },
            items: [],
            shippingDetails: {
              name: '',
              address: '',
              phone: ''
            },
            buttons: [
              {
                text: 'Back to Orders',
                handleClick: () => router.push('/orderHistory'),
                variant: 'outline'
              }
            ]
          }}
        />
      </Container>
    </Box>
  )
}

export default OrderDetails

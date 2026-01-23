import React from 'react'
import { Box, Container, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLanguage } from '@hooks/useLanguage'
import { OrderHistory as BecknOrderHistory } from '@beckn-ui/becknified-components'

const OrderHistory = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py="24px"
    >
      <Container maxW="1200px">
        <Text
          fontSize="28px"
          fontWeight="700"
          mb="24px"
          color="gray.800"
        >
          Order History
        </Text>
        <BecknOrderHistory
          schema={{
            orders: [],
            emptyState: {
              image: '/images/emptyOrder.svg',
              heading: 'No Orders Yet',
              subHeading: 'Your order history will appear here',
              buttonText: 'Start Ordering',
              buttonHandler: () => router.push('/')
            },
            orderClickHandler: (orderId: string) => {
              router.push(`/orderDetails?id=${orderId}`)
            }
          }}
        />
      </Container>
    </Box>
  )
}

export default OrderHistory

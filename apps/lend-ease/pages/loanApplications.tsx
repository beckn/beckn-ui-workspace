import React, { useEffect, useState } from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'

interface OrderItem {
  id: number
  name: string
  short_desc: string
  code: string
  long_desc: string
}

interface OrderDetails {
  id: number
  status: string
  order_transaction_id: string
  items: OrderItem[]
}

interface Order {
  id: number
  state_code: string
  state_value: string
  quantity: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  order_id: OrderDetails
}

const LoanApplications = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${strapiUrl}/beckn-energy-finance/orders`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {isLoading ? (
        <Box
          textAlign="center"
          py={4}
        >
          <Spinner
            size="md"
            color="blue.500"
          />
        </Box>
      ) : orders.length === 0 ? (
        <Box
          textAlign="center"
          py={4}
        >
          <Text
            fontSize="14px"
            color="gray.500"
          >
            No loan applications found
          </Text>
        </Box>
      ) : (
        <Box className="hideScroll">
          {orders.map(order => (
            <DetailsCard key={order.id}>
              <Flex
                mb="5px"
                justifyContent={'space-between'}
                alignItems="center"
              >
                <Text
                  fontSize={'12px'}
                  fontWeight="500"
                >
                  {order.order_id.items[0].short_desc}
                </Text>
                <Text
                  padding={'2px 4px'}
                  fontSize={'10px'}
                  color="#fff"
                  bg={order.state_code === 'LOAN_DISBURSED' ? '#51B651' : '#F6AD55'}
                  borderRadius="4px"
                >
                  {order.state_value}
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                  minWidth={'fit-content'}
                >
                  Applicants Name:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                >
                  {order.order_id.order_transaction_id}
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                  minWidth={'fit-content'}
                >
                  Loan Amount:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                >
                  {order.order_id.order_transaction_id}
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                  minWidth={'fit-content'}
                >
                  Loan Tenure:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                >
                  {order.order_id.order_transaction_id}
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                  minWidth={'fit-content'}
                >
                  Rate of Interest:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                >
                  {order.order_id.order_transaction_id}
                </Text>
              </Flex>

              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                >
                  Placed at:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                >
                  {new Date(order.createdAt).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </Text>
              </Flex>
            </DetailsCard>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default LoanApplications

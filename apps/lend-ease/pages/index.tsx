import { Box, Flex, Image, Text, Spinner } from '@chakra-ui/react'
import Carousel from '@components/carasoul/Carousel'
import profileIcon from '@public/images/bajaj-icon.svg'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { buttonStyles, images } from '@components/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setNavigationType } from '@store/navigation-slice'
import Cookies from 'js-cookie'
import { AuthRootState } from '@store/auth-slice'
import { DegWalletDetails } from '@beckn-ui/common'
import { UserRootState } from '@store/user-slice'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import axios from 'axios'

interface OrderItem {
  sc_retail_product: any
  id: number
  name: string
  short_desc: string
  code: string
  long_desc: string
}

interface OrderDetails {
  total_amount: ReactNode
  id: number
  status: string
  order_transaction_id: string
  items: OrderItem[]
}

interface Order {
  items: any
  customer_id: any
  id: number
  state_code: string
  state_value: string
  quantity: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  order_id: OrderDetails
}

const HomePage = () => {
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [isLoading, setIsLoading] = useState(false)
  const [walletDetails, setWalletDetails] = useState<DegWalletDetails>()
  const [modalType, setModalType] = useState<'wallet' | 'link' | 'otp' | 'alert' | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)

  const handleModalOpen = (type: 'wallet' | 'link' | 'otp' | 'alert') => setModalType(type)
  const handleModalClose = () => setModalType(null)
  const dispatch = useDispatch()

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await axios.get(`${strapiUrl}/beckn-energy-finance/orders`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      console.log('Dank', response.data.orders)
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }

    if (
      shouldShowInitialAlert &&
      user?.deg_wallet &&
      (!user?.deg_wallet.energy_assets_consent ||
        !user?.deg_wallet.energy_identities_consent ||
        !user?.deg_wallet.energy_transactions_consent)
    ) {
      setModalType('alert')
    }

    fetchOrders()
  }, [user, shouldShowInitialAlert])

  return (
    <Box
      backgroundColor="white"
      ml={'-20px'}
      mr={'-20px'}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mt={'8px'}
        pl={'20px'}
        pr={'20px'}
        h="60px"
        boxShadow="0px 4px 20px 0px #00000014"
      >
        <Box>
          <Image
            src={profileIcon}
            alt="profileIcon"
            onClick={() => {}}
          />
        </Box>
        <Text
          padding={'8px 10px'}
          borderRadius="6px"
          backgroundColor="#1E3A5F"
          color={'#fff'}
          onClick={() => router.push('/loans')}
        >
          Manage Loan Catalog
        </Text>
      </Flex>
      <Box
        className="hideScroll"
        maxH={'calc(100vh - 100px)'}
        overflowY="scroll"
      >
        <Box
          padding={'10px'}
          mr={'10px'}
          ml="10px"
          mt="10px"
        >
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
            mt="20px"
            mb="20px"
          >
            <Text
              fontSize={'17px'}
              fontWeight="600"
            >
              Loan Applications
            </Text>
            <Text
              cursor={'pointer'}
              fontSize={'14px'}
              fontWeight="600"
              color={'#0069B4'}
              onClick={() => router.push('/loanApplications')}
            >
              See all
            </Text>
          </Flex>
          <Box className={'hideScroll'}>
            {ordersLoading ? (
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
              orders.slice(0, 5).map(order => (
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
                      {order.customer_id.first_name}
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
                      Rs. {order?.order_id.total_amount}
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
                      {order?.order_id.items[0].name} months
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
                      {order?.order_id.items[0].sc_retail_product.max_price} %
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
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage

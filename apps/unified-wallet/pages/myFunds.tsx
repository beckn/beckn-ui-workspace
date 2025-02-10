import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Image, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import DeviceList from '@components/deviceList/DeviceList'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useState } from 'react'
import ArrowOut from '@public/images/arrow_outward.svg'
import ArrowDown from '@public/images/arrow_downward.svg'
import EmptyTransactionsIcon from '@public/images/empty_transactions.svg'
import { formatDate } from '@beckn-ui/common'
import Pagination from '@components/pagination/pagination'
import EmptyCurrentTrade from '@components/currentTrade/EmptyScreenTemplate'
import { useRouter } from 'next/router'
import SelectDate from '@components/dateRangePicker/SelectDate'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'

interface TransactionMeta {
  transactionType: 'ADD_FUND' | 'WITHDRAW_FUND' | 'SELLORDER' | 'BUYORDER'
  name: string
  date: string
  amount: number
}

const TransactionMap = {
  ADD_FUND: 'Deposit',
  WITHDRAW_FUND: 'Withdraw',
  SELLORDER: 'Sell Order',
  BUYORDER: 'Buy Order'
}

enum TransactionType {
  ADD_FUND = 'ADD_FUND',
  WITHDRAW_FUND = 'WITHDRAW_FUND',
  SELLORDER = 'SELLORDER',
  BUYORDER = 'BUYORDER'
}

const MyFunds = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')
  const today = formatDate(new Date(), 'dd/MM/yy')

  const [balance, setBalance] = useState<number>(0)
  const [filterIndex, setFilterIndex] = useState<number>(0)
  const [items, setItems] = useState<TransactionMeta[]>([])
  const [currentPage, setCurrentPage] = useState(1) // useState(meta.start / meta.limit + 1)
  const [totalPages, setTotalPages] = useState(10) // useState(Math.ceil(meta.total / meta.limit) || 1)
  const [customStartDate, setCustomStartDate] = useState<string>(today)
  const [customEndDate, setCustomEndDate] = useState<string>(today)
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false)

  const router = useRouter()

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/balance`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data.data
      setBalance(result.balance)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchTransactions = async (
    params?: { page: number; startDate: string; endDate: string },
    callback?: Function
  ) => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/wallet/transaction`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true,
        params
      })
      const result = response.data.map((transaction: any) => {
        return {
          transactionType: transaction.transaction_type,
          name: transaction.transaction_type,
          date: formatDate(new Date(transaction.createdAt), 'dd/MM/yyyy'),
          amount: transaction.transaction_amount
        }
      })
      setItems(result)
      callback?.()
    } catch (error) {
      console.error('Error fetching transactions data:', error)
    }
  }

  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, [])

  const handleOnFilterChange = (index: number) => {
    switch (index) {
      case 0:
        fetchTransactions(undefined, () => setFilterIndex(index))
        break
      case 1:
        fetchTransactions(
          {
            page: currentPage,
            startDate: formatDate(new Date().setDate(new Date().getDate() - 6), 'yyyy-MM-dd'),
            endDate: formatDate(new Date(), 'yyyy-MM-dd')
          },
          () => setFilterIndex(index)
        )
        break
      case 2:
        handleCustomDateModalOpen()
        break
      default:
        fetchTransactions()
    }
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
      }
    },
    [totalPages]
  )

  const handleCustomDateModalOpen = () => setIsCustomDateModalOpen(true)
  const handleCustomDateModalClose = () => setIsCustomDateModalOpen(false)

  const handleDateChange = (start: string, end: string) => {
    setCustomStartDate(start)
    setCustomEndDate(end)
    fetchTransactions(
      {
        page: currentPage,
        startDate: parseAndFormatDate(start),
        endDate: parseAndFormatDate(end)
      },
      () => setFilterIndex(2)
    )
    handleCustomDateModalClose()
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 0px) auto auto auto"
      backgroundColor="white"
      placeItems={'center'}
    >
      <Flex
        width={'335px'}
        height="162px"
        backgroundColor={'#4498E8'}
        borderRadius="12px"
        p="1rem"
        flexDir={'column'}
        justifyContent="space-around"
        boxShadow="0px 20px 25px 0px #0000001A"
      >
        <Typography
          text="Current Balance"
          fontSize="15px"
          color="#ffffff"
        />
        <Typography
          text={`₹ ${balance}`}
          fontSize="24px"
          color="#ffffff"
        />
        <Flex gap="1rem">
          <BecknButton
            text="Withdraw"
            handleClick={() => router.push('/withdraw')}
            variant="outline"
            sx={{
              color: '#000000',
              borderColor: '#ffffff',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '1rem 0',
              borderRadius: '20px',
              height: '1.5rem',
              marginBottom: '0px'
            }}
            leftIcon={
              <Image
                src={ArrowOut}
                alt="withdraw-icon"
              />
            }
          />
          <BecknButton
            text="Deposit"
            handleClick={() => router.push('/paymentMode')}
            variant="outline"
            sx={{
              color: '#000000',
              borderColor: '#ffffff',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '1rem 0',
              borderRadius: '20px',
              height: '1.5rem',
              marginBottom: '0px'
            }}
            leftIcon={
              <Image
                src={ArrowDown}
                alt="deposit-icon"
              />
            }
          />
        </Flex>
      </Flex>
      <Flex
        flexDirection={'column'}
        width={'100%'}
        p="1rem"
        gap="1rem"
      >
        <Flex
          flexDirection={'row'}
          justifyContent={'space-between'}
          width={'100%'}
        >
          <Typography
            text="Transactions"
            fontWeight="500"
            fontSize="15px !important"
          />
          <Typography
            text="View all"
            color="#4498E8"
          />
        </Flex>
        {filterIndex > 0 || items.length > 0 ? (
          <>
            <Flex
              flexDirection={'row'}
              justifyContent="space-between"
            >
              {['Latest', 'last 7 Days', 'Custom Date'].map((name, index) => (
                <Typography
                  text={name}
                  sx={{
                    backgroundColor: filterIndex === index ? '#4498E8' : '#ffffff',
                    borderRadius: '20px',
                    padding: '1.8% 6%',
                    color: filterIndex === index ? '#ffffff' : '#000000',
                    border: `1px solid ${filterIndex === index ? 'transparent' : '#000000'}`
                  }}
                  onClick={() => handleOnFilterChange(index)}
                />
              ))}
            </Flex>

            <Box
              height={{ base: 'calc(100vh - 29rem)', md: 'calc(100vh - 30rem)' }}
              overflowY="scroll"
              overflowX="scroll"
              className="hideScroll"
            >
              <Table variant="simple">
                <Tbody>
                  {items.map((item, index: number) => (
                    <Tr
                      key={index}
                      cursor="pointer"
                      _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                    >
                      <Td
                        borderBottom={'1px dotted transparent !important'}
                        padding="6px 0px"
                      >
                        <Flex
                          flexDirection={'row'}
                          gap="0.5rem"
                        >
                          {item.transactionType === TransactionType.WITHDRAW_FUND && (
                            <Box
                              width={'36px'}
                              height={'36px'}
                              alignContent="center"
                              justifyItems="center"
                              borderRadius="20px"
                              boxShadow="14px 6px 24px 2px #0000001A"
                            >
                              <Image src={ArrowOut} />
                            </Box>
                          )}
                          {item.transactionType === TransactionType.ADD_FUND && (
                            <Box
                              width={'36px'}
                              height={'36px'}
                              alignContent="center"
                              justifyItems="center"
                              borderRadius="20px"
                              boxShadow="14px 6px 24px 2px #0000001A"
                            >
                              <Image src={ArrowDown} />
                            </Box>
                          )}
                          <Flex flexDir={'column'}>
                            <Typography
                              text={TransactionMap[item.transactionType]}
                              style={{
                                fontWeight: '400',
                                fontSize: '14px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal'
                              }}
                            />
                            <Typography
                              text={formatDate(item.date, 'yyyy-MM-dd')}
                              style={{
                                fontSize: '12px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                opacity: '40%'
                              }}
                            />
                          </Flex>
                        </Flex>
                      </Td>
                      <Td
                        borderBottom={'1px dotted transparent !important'}
                        padding="6px 0px"
                      >
                        <Typography
                          text={`${item.transactionType === TransactionType.ADD_FUND ? '+' : '-'}₹ ${item.amount}`}
                          style={{
                            fontWeight: '500',
                            fontSize: '16px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            textAlign: 'end'
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            {items.length > 6 && (
              <Box
                width={'100%'}
                bottom="0"
                margin="1rem 0"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </Box>
            )}
          </>
        ) : (
          <Box marginTop={'6rem'}>
            <EmptyCurrentTrade
              text={'There’s no transactions till now!'}
              src={EmptyTransactionsIcon}
            />
          </Box>
        )}
      </Flex>
      <SelectDate
        isOpen={isCustomDateModalOpen}
        onClose={handleCustomDateModalClose}
        onDateSelect={handleDateChange}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </Box>
  )
}

export default MyFunds

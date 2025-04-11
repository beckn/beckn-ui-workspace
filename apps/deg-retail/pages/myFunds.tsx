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
import EmptyCurrentTrade from '@components/currentTrade/EmptyCurrentTrade'
import { useRouter } from 'next/router'
import SelectDate from '@components/dateRangePicker/SelectDate'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import BalanceCard from '@components/wallet/BalanceCard'
import TransactionTable from '@components/wallet/TransactionTable'

export interface TransactionMeta {
  transactionType: 'ADD_FUND' | 'WITHDRAW_FUND' | 'SELLORDER' | 'BUYORDER'
  name: string
  date: string
  amount: number
}

export const TransactionMap = {
  ADD_FUND: 'Deposit',
  WITHDRAW_FUND: 'Withdraw',
  SELLORDER: 'Sell Order',
  BUYORDER: 'Buy Order'
}

export enum TransactionType {
  ADD_FUND = 'ADD_FUND',
  WITHDRAW_FUND = 'WITHDRAW_FUND',
  SELLORDER = 'SELLORDER',
  BUYORDER = 'BUYORDER'
}

const buttonStyle = {
  color: '#000000',
  borderColor: '#ffffff',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '1rem 0',
  borderRadius: '20px',
  height: '1.5rem',
  marginBottom: '0px'
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
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <BalanceCard
        backgroundColor="#4498E8"
        currentBalanceText="Current Balance"
        balanceAmount={`₹ ${balance}`}
        withdrawText="Withdraw"
        depositText="Deposit"
        onWithdraw={() => router.push('/withdraw')}
        onDeposit={() => router.push('/paymentMode')}
        buttonSx={buttonStyle}
        withdrawIcon={ArrowOut}
        depositIcon={ArrowDown}
      />
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
            <TransactionTable
              items={items}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              TransactionMap={TransactionMap}
              ArrowOut={ArrowOut}
              ArrowDown={ArrowDown}
            />
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

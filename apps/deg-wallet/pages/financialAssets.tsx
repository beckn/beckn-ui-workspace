import { Box, useTheme } from '@chakra-ui/react'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import AssetTransactionTemplate, {
  TransactionMeta
} from '@components/AssetTransactionTemplate/AssetTransactionTemplate'

const FinancialAssets = () => {
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
  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

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
      <AssetTransactionTemplate
        assetType="fund"
        assetValue={`₹ ${balance}`}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        filterIndex={filterIndex}
        isCustomDateModalOpen={isCustomDateModalOpen}
        handleCustomDateModalClose={handleCustomDateModalClose}
        handleDateChange={handleDateChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        items={items}
        totalPages={totalPages}
        handleOnFilterChange={handleOnFilterChange}
      />
    </Box>
  )
}

export default FinancialAssets

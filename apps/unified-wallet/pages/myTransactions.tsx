import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'
import { Box, Flex, Image } from '@chakra-ui/react'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import React, { useEffect, useState } from 'react'
import EmptyTransactionsIcon from '@public/images/empty_transactions.svg'
import { testIds } from '@shared/dataTestIds'
import CustomFilterIconComponent from '@beckn-ui/common/src/components/cutomFilterIcon/customFilterIcon'
import { BottomModal, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import Filter from '@components/filter'
import CardRenderer from '@components/card/CardRenderer'
import { formatDate } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import { useGetDocumentsMutation } from '@services/walletService'
import { parseDIDData } from '@utils/did'
import { currencyFormat, filterByKeyword } from '@utils/general'
import { useRouter } from 'next/router'
import RetailIcon from '@public/images/retail_icon.svg'
import OpenSparkIcon from '@public/images/open_spark_icon.svg'
import { Transaction } from '@lib/types/becknDid'

interface TransactionItem {
  id: string | number
  orderId: string
  amount: string | number
  date: string
  name: string
  category: string
  color?: string
  data: Transaction
}

const MyTransactions = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [items, setItems] = useState<TransactionItem[]>([])
  const [filteredItems, setFilteredItems] = useState(items)

  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { user, privateKey, publicKey } = useSelector((state: AuthRootState) => state.auth)
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()

  const categoryColors: Record<string, any> = {
    Retail: { color: '#D58F0E', icon: RetailIcon },
    Energy: { color: '#51B651', icon: OpenSparkIcon },
    Healthcare: { color: '#D86969', icon: '' },
    default: { color: '#4498E8', icon: '' }
  }
  console.log(items)
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.did!).unwrap()
      const list: TransactionItem[] = parseDIDData(result)
        ['transactions'].map((item, index) => {
          if (formatDate((Number(item.placedAt) * 1000)!, 'do MMM yyyy, h:mma') === 'Invalid date') return
          return {
            id: index,
            orderId: item.id,
            name: item.name,
            amount: item.amount,
            date: formatDate((Number(item.placedAt) * 1000)!, 'do MMM yyyy, h:mma'),
            category: item.category,
            color: categoryColors[item.category] || categoryColors.default,
            data: item
          }
        })
        .filter(val => val)
        .sort((a, b) => Number(b.data.placedAt) - Number(a.data.placedAt))
      setItems(list)
      setFilteredItems(list)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (searchKeyword && searchKeyword.trim() !== '') {
      const filteredByCatList = filterByKeyword(items, searchKeyword, 'category')
      const filteredByOrderIdList = filterByKeyword(items, searchKeyword, 'orderId')
      setFilteredItems([...filteredByCatList, ...filteredByOrderIdList])
    } else {
      setFilteredItems(items)
    }
  }, [searchKeyword, items])

  const handleOpenModal = () => setIsFilterOpen(true)
  const handleCloseModal = () => setIsFilterOpen(false)

  const handleResetFilter = () => {
    setFilteredItems(items)
  }

  const handleApplyFilter = (sortBy: string) => {
    if (sortBy === '') {
      setFilteredItems(items)
    } else {
      const sortedItemsCopy = [...items]

      const result = sortedItemsCopy.filter(item => item.category.toLocaleLowerCase() === sortBy.toLocaleLowerCase())

      setFilteredItems(result)
    }
    setIsFilterOpen(false)
  }
  const router = useRouter()
  const handleOnOrderClick = (orderData: TransactionItem) => {
    // const encodedProduct = window.btoa(encodeURIComponent(JSON.stringify(orderData as TransactionItem)))
    localStorage.setItem('orderData', JSON.stringify(orderData))
    router.push({
      pathname: '/orderDetails'
      // query: {
      //   data: encodedProduct
      // }
    })
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 0px) auto auto auto"
      backgroundColor="white"
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <SearchBar
          searchString={searchKeyword}
          placeholder={'Search Transactions'}
          handleChange={(text: string) => setSearchKeyword(text)}
        />
        <Box
          onClick={handleOpenModal}
          cursor="pointer"
          data-test={testIds.searchpage_filterButton}
          marginLeft={'1rem'}
        >
          <CustomFilterIconComponent />
        </Box>
      </Box>
      <Flex
        justifyContent="center"
        flexDir={'column'}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            return (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => {
                  handleOnOrderClick(item)
                }}
              >
                <CardRenderer
                  styles={{ padding: '0.5rem 0.5rem' }}
                  childComponent={() => (
                    <Flex
                      key={item.id}
                      flexDir="column"
                      gap="6px"
                    >
                      <Flex
                        flexDir={'row'}
                        justifyContent="space-between"
                      >
                        <Box width={'15rem'}>
                          <Typography
                            text={item.name}
                            fontSize="12px"
                            fontWeight="500"
                          />
                        </Box>
                        <Box
                          color={'#ffffff'}
                          backgroundColor={categoryColors[item.category]?.color || categoryColors.default.color}
                          fontSize="10px"
                          padding="2px 6px"
                          borderRadius="4px"
                          textTransform="capitalize"
                          whiteSpace={'nowrap'}
                          height="20px"
                        >
                          {item.category}
                        </Box>
                      </Flex>
                      {categoryColors[item.category]?.icon && (
                        <Image
                          src={categoryColors[item.category]?.icon}
                          width="58px"
                          height={'16px'}
                        />
                      )}
                      <Flex
                        flexDir={'row'}
                        justifyContent={'space-between'}
                      >
                        <Typography
                          text={`Placed at ${item.date}`}
                          fontSize="10px"
                          fontWeight="300"
                        />
                        <Typography
                          text={`₹ ${currencyFormat(Number(item.amount))}`}
                          fontWeight="500"
                          fontSize="10px"
                        />
                      </Flex>
                    </Flex>
                  )}
                />
              </Box>
            )
          })
        ) : isLoading ? (
          <Box
            display={'grid'}
            height={'calc(100vh - 300px)'}
            alignContent={'center'}
          >
            <LoaderWithMessage
              loadingSubText=""
              loadingText={''}
            />
          </Box>
        ) : (
          <EmptyScreenTemplate
            text={'You have no transactions yet!'}
            src={EmptyTransactionsIcon}
          />
        )}
      </Flex>
      <BottomModal
        isOpen={isFilterOpen!}
        onClose={handleCloseModal!}
      >
        <Filter
          handleApplyFilter={handleApplyFilter!}
          handleResetFilter={handleResetFilter!}
          handleCancelFilter={handleCloseModal}
        />
      </BottomModal>
    </Box>
  )
}

export default MyTransactions

import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'
import { Box, Flex } from '@chakra-ui/react'
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
import { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import { parseDIDData } from '@utils/did'
import { filterByKeyword } from '@utils/general'

interface TransactionItem {
  id: string | number
  orderId: string
  amount: string | number
  noOfItems: number | string
  date: string
  category: string
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

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const result = await getDocuments(user?.did!).unwrap()
      const list: TransactionItem[] = parseDIDData(result)['transactions'].map((item, index) => {
        return {
          id: index,
          orderId: item.id,
          amount: item.amount,
          noOfItems: item.totalItems,
          date: new Date().toString(),
          category: item.category
        }
      })
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
    const sortedItemsCopy = [...items]

    const result = sortedItemsCopy.filter(item => item.category.toLocaleLowerCase() === sortBy.toLocaleLowerCase())

    setFilteredItems(result)
    setIsFilterOpen(false)
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 0px) auto auto auto"
      backgroundColor="white"
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
          filteredItems.map(item => {
            return (
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
                      <Typography
                        text={`Placed at ${formatDate(item.date, 'do MMM yyyy, h.mma')}`}
                        fontSize="12px"
                      />
                      <Box
                        color={'#ffffff'}
                        backgroundColor={'#4498E8'}
                        fontSize="10px"
                        padding="2px 6px"
                        borderRadius="4px"
                        textTransform="capitalize"
                      >
                        {item.category}
                      </Box>
                    </Flex>
                    <Flex
                      flexDir={'row'}
                      gap="2px"
                    >
                      <Typography
                        text={`Order ID:`}
                        fontSize="12px"
                      />
                      <Typography
                        text={item.orderId}
                        fontWeight="600"
                        fontSize="12px"
                      />
                    </Flex>
                    <Typography
                      text={`₹ ${item.amount}`}
                      fontWeight="500"
                      fontSize="12px"
                    />
                    <Typography
                      text={`${item.noOfItems} item(s)`}
                      fontSize="12px"
                    />
                  </Flex>
                )}
              />
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
            text={'There’s no transactions till now!'}
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

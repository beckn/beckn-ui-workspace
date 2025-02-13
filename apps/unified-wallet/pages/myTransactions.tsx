import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'
import { Box, Flex } from '@chakra-ui/react'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import React, { ReactElement, useEffect, useState } from 'react'
import EmptyTransactionsIcon from '@public/images/empty_transactions.svg'
import { testIds } from '@shared/dataTestIds'
import CustomFilterIconComponent from '@beckn-ui/common/src/components/cutomFilterIcon/customFilterIcon'
import { BottomModal, Typography } from '@beckn-ui/molecules'
import Filter from '@components/filter'
import CardRenderer from '@components/card/CardRenderer'
import { formatDate } from '@beckn-ui/common'

interface TransactionItem {
  id: string
  orderId: string
  amount: string
  noOfItems: number | string
  date: string
  category: string
}

const MyTransactions = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [items, setItems] = useState<TransactionItem[]>([
    {
      id: '1',
      orderId: '12345',
      amount: '100',
      noOfItems: 2,
      date: '2022-01-01',
      category: 'retail'
    }
  ])
  const [originalItems, setOriginalItems] = useState<[]>([])

  useEffect(() => {
    console.log(searchKeyword)
    // fetchPairedData()
  }, [searchKeyword])

  const handleOpenModal = () => setIsFilterOpen(true)
  const handleCloseModal = () => setIsFilterOpen(false)

  const handleResetFilter = () => {
    setItems(originalItems)
  }

  const handleApplyFilter = (sortBy: string) => {
    console.log(sortBy)
    const sortedItemsCopy = [...originalItems]

    // if (sortBy === 'LowtoHigh') {
    //   sortedItemsCopy.sort((a, b) => parseFloat(a.item.price.value) - parseFloat(b.item.price.value))
    // } else if (sortBy === 'HightoLow') {
    //   sortedItemsCopy.sort((a, b) => parseFloat(b.item.price.value) - parseFloat(a.item.price.value))
    // } else if (sortBy === 'RatingLowtoHigh') {
    //   sortedItemsCopy.sort((a, b) => parseFloat(a.item.rating!) - parseFloat(b.item.rating!))
    // } else if (sortBy === 'RatingHightoLow') {
    //   sortedItemsCopy.sort((a, b) => parseFloat(b.item.rating!) - parseFloat(a.item.rating!))
    // }

    setItems(sortedItemsCopy)
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
      <Flex justifyContent="center">
        {items.length > 0 ? (
          <CardRenderer
            styles={{ width: '100%', height: '100%', padding: '0.5rem 0.5rem' }}
            childComponent={() => {
              return (
                <>
                  {items.map(item => {
                    return (
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
                    )
                  })}
                </>
              )
            }}
          />
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

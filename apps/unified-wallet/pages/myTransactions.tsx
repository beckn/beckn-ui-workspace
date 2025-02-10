import SearchBar from '@beckn-ui/common/src/components/searchBar/searchBar'
import { Box, Flex } from '@chakra-ui/react'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import React, { useEffect, useState } from 'react'
import EmptyTransactionsIcon from '@public/images/empty_transactions.svg'
import { testIds } from '@shared/dataTestIds'
import CustomFilterIconComponent from '@beckn-ui/common/src/components/cutomFilterIcon/customFilterIcon'
import { BottomModal } from '@beckn-ui/molecules'
import Filter from '@components/filter'

const MyTransactions = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [items, setItems] = useState([])
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
        {items.length > 0 ? null : (
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

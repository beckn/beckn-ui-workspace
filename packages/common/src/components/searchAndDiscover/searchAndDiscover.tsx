import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Product, ProductCard } from '@beckn-ui/becknified-components'
import { BottomModal, LoaderWithMessage } from '@beckn-ui/molecules'
import { useBreakpoint } from '@chakra-ui/react'
import Filter from '../filter'
import SearchBar from '../searchBar'
import CustomFilterIconComponent from '../cutomFilterIcon'
import { setLocalStorage } from '../../utils'
import { SearchAndDiscoverProps } from './searchAndDiscover.types'
import { GeneralTestIds, SearchPageTestIds } from '@shared/dataTestIds'

const SearchAndDiscover: React.FC<SearchAndDiscoverProps> = ({
  items,
  searchProps,
  filterProps,
  loaderProps,
  catalogProps,
  noProduct
}) => {
  const { searchKeyword, setSearchKeyword, fetchDataOnSearch } = searchProps
  const { isFilterOpen, handleApplyFilter, handleResetFilter, handleFilterOpen, handleFilterClose } = filterProps || {}
  const { viewDetailsClickHandler } = catalogProps

  const breakpoint = useBreakpoint()

  const mobileBreakpoints = ['base', 'sm']
  const isMediumScreen = breakpoint === 'md'
  const isSmallScreen = mobileBreakpoints.includes(breakpoint)

  const renderCatalog = () => {
    return items.map((catalogItem, idx) => {
      const { item } = catalogItem
      const product: Product = {
        id: item.id,
        images: item.images?.map(image => image?.url)!,
        name: item.name,
        price: item.price.value,
        rating: item.rating,
        source: 'Sold By',
        sourceText: items[0].providerName
      }

      const handleProductClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        viewDetailsClickHandler(catalogItem, product)
      }

      return (
        <ProductCard
          key={idx}
          productClickHandler={handleProductClick}
          product={product}
          currency={item.price.currency}
        />
      )
    })
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 95px)"
      overflowY="scroll"
    >
      <Box display="flex">
        {filterProps && !isSmallScreen && !isMediumScreen && (
          <Filter
            handleApplyFilter={handleApplyFilter!}
            handleResetFilter={handleResetFilter!}
            handleCancelFilter={handleFilterClose}
          />
        )}
        <Box
          w="100%"
          ml={['unset', 'unset', 'unset', '36px']}
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <SearchBar
              searchString={searchKeyword}
              handleChange={(text: string) => {
                setSearchKeyword(text)
                localStorage.removeItem('optionTags')
                setLocalStorage('optionTags', { name: text })
                window.dispatchEvent(new Event('storage-optiontags'))
                fetchDataOnSearch()
              }}
            />
            {filterProps && (isSmallScreen || isMediumScreen) && (
              <Box
                onClick={handleFilterOpen}
                cursor="pointer"
                data-test={SearchPageTestIds.filterButton}
                marginLeft={'1rem'}
              >
                <CustomFilterIconComponent />
              </Box>
            )}
          </Box>
          {filterProps && isSmallScreen && (
            <BottomModal
              isOpen={isFilterOpen!}
              onClose={handleFilterClose!}
            >
              <Filter
                handleApplyFilter={handleApplyFilter!}
                handleResetFilter={handleResetFilter!}
                handleCancelFilter={handleFilterClose}
              />
            </BottomModal>
          )}
          {filterProps && isMediumScreen && isFilterOpen && (
            <Box
              position="absolute"
              zIndex="9"
              backgroundColor="#fff"
              left="28%"
            >
              <Filter
                handleApplyFilter={handleApplyFilter!}
                handleResetFilter={handleResetFilter!}
              />
            </Box>
          )}
          <Box>
            {loaderProps.isLoading ? (
              <Box
                display="grid"
                height="calc(100vh - 300px)"
                alignContent="center"
              >
                <LoaderWithMessage {...loaderProps} />
              </Box>
            ) : (
              <>
                {items.length ? (
                  <Flex
                    flexWrap="wrap"
                    w={['100%', '100%', '51%', '100%']}
                    margin="0 auto"
                  >
                    {renderCatalog()}
                  </Flex>
                ) : (
                  <Box
                    pt={8}
                    opacity={0.5}
                    textAlign="center"
                    data-test={GeneralTestIds.noDataAvailable}
                  >
                    {noProduct('No Product')}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SearchAndDiscover

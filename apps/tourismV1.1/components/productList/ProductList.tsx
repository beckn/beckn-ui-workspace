import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import Card from '../UI/card/Card'
import { useDispatch, useSelector } from 'react-redux'
import { SortedProductsListActions } from '../../store/sortedProductList-slice'
import { IProductListRootState } from '../../lib/types/productList'
import { ParsedScholarshipData } from './ProductList.utils'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import Sort from './Sort'
import { ProductCard } from '@beckn-ui/becknified-components'
import { discoveryActions } from '@store/discovery-slice'

interface Props {
  productList: ParsedScholarshipData[]
  searchKeyword: string
}
const ProductList: React.FC<Props> = ({ productList, searchKeyword }) => {
  const { t } = useLanguage()

  const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>('All')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      SortedProductsListActions.sortProductsList({
        productsList: productList,
        sortBasedOn: selectedRadioBtn
      })
    )
  }, [dispatch, productList, selectedRadioBtn])

  const sortedProductList = useSelector((state: IProductListRootState) => state.sortedProductsList.productsList)

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRadioBtn(e.currentTarget.id)
  }

  return (
    <Box
      w="full"
      maxW="2100px"
      mx="auto"
    >
      <Sort
        selectedBtn={selectedRadioBtn}
        onChangeSelectedBtn={onChangeHandler}
      />

      {sortedProductList && sortedProductList.length ? (
        <Flex
          display={{ base: 'grid', md: 'flex' }}
          flexWrap={{ md: 'wrap' }}
          flexDirection={{ base: 'column', md: 'row' }}
          gridGap={{ base: 4, md: 2 }}
          overflowY="scroll"
          mt={10}
          maxH="calc(100vh - 150px)"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none'
          }}
        >
          {/* {sortedProductList.map(product => {
            return (
              <ProductCard
                key={idx}
                productClickHandler={e => {
                  e.preventDefault()
                  dispatch(discoveryActions.addSingleProduct({ product: singleItem }))
                  router.push({
                    pathname: '/product',
                    query: {
                      id: item.id,
                      search: searchKeyword
                    }
                  })
                  localStorage.setItem('selectCardHeaderText', product.name)
                }}
                product={product}
                currency={item.price.currency}
              />
            )
          })} */}
        </Flex>
      ) : (
        <Text>{t.noProduct}</Text>
      )}
    </Box>
  )
}

export default ProductList

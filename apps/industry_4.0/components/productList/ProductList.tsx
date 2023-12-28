import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import Card from '../UI/card/Card'
import { useDispatch, useSelector } from 'react-redux'
import { SortedProductsListActions } from '../../store/sortedProductList-slice'
import { IProductListRootState } from '../../lib/types/productList'
import { ParsedScholarshipData } from './ProductList.utils'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'

interface Props {
  productList: ParsedScholarshipData[]
}
const ProductList: React.FC<Props> = ({ productList }) => {
  const { t } = useLanguage()

  const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>('all')
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

  return (
    <Box
      w="full"
      maxW="2100px"
      mx="auto"
    >
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
          {sortedProductList.map(product => {
            return (
              <Card
                key={product.id}
                product={product}
              />
            )
          })}
        </Flex>
      ) : (
        <Text>{t.noProduct}</Text>
      )}
    </Box>
  )
}

export default ProductList

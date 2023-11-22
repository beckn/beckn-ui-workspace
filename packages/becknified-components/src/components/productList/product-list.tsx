import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Sort from '../sort'
import ProductCard from '../product-card'
import { ProductListProps } from './product-list.types'
import { sortByCheapest, sortByExpensive } from './product-list.utils'
import { ParsedItem } from '../../pages/search-results/search-results.types'
import { Typography } from '@beckn-ui/molecules'

const ProductList: React.FC<ProductListProps> = props => {
  const { productList, productClickHandler, CustomInfoComponentForProductCard } = props
  const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>('all')
  const [sortedProductList, setSortedProductList] = useState<ParsedItem[]>(productList)

  useEffect(() => {
    const clonedproductList = structuredClone(productList)
    if (selectedRadioBtn === 'expensive') {
      return setSortedProductList(clonedproductList.sort(sortByExpensive))
    }

    if (selectedRadioBtn === 'cheapest') {
      return setSortedProductList(clonedproductList.sort(sortByCheapest))
    }

    if (selectedRadioBtn === 'all') {
      return setSortedProductList(clonedproductList)
    }
  }, [selectedRadioBtn])

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRadioBtn(e.currentTarget.id)
  }

  return (
    <Box width={'100%'}>
      {sortedProductList && sortedProductList.length ? (
        <Box>
          <Sort
            selectedBtn={selectedRadioBtn}
            onChangeSelectedBtn={onChangeHandler}
          />
          <Box
            display={'grid'}
            gridGap={'1rem'}
            paddingTop={'70px'}
          >
            {sortedProductList.map(product => {
              return (
                <ProductCard
                  ComponentRenderer={CustomInfoComponentForProductCard}
                  productClickHandler={productClickHandler}
                  key={product.id}
                  product={product}
                />
              )
            })}
          </Box>
        </Box>
      ) : (
        <Box textAlign={'center'}>
          <Typography
            color="#757575"
            text="No Data found"
          />
        </Box>
      )}
    </Box>
  )
}

export default ProductList

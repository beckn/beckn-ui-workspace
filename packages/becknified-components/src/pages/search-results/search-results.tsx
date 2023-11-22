import React from 'react'
import { SearchResultsProps } from './search-results.types'
import { Box } from '@chakra-ui/react'
import ProductList from '../../components/productList'

const SearchResults: React.FC<SearchResultsProps> = props => {
  const { productList, productClickHandler, CustomInfoComponentForProductCard } = props

  return (
    <>
      <ProductList
        CustomInfoComponentForProductCard={CustomInfoComponentForProductCard}
        productClickHandler={productClickHandler}
        productList={productList}
      />
    </>
  )
}

export default SearchResults

import React from 'react'
import { SearchResultsProps } from './search-results.types'
import ProductList from '../../components/productList'

const SearchResults: React.FC<SearchResultsProps> = ({ schema }) => {
  const { productList, productCard } = schema

  return (
    <>
      <ProductList
        CustomInfoComponentForProductCard={productCard.productCardRenderer}
        productClickHandler={productCard.productClickHandler}
        productInfoDataSource={productCard.productInfoDataSource}
        productList={productList}
      />
    </>
  )
}

export default SearchResults

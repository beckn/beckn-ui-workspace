import React from 'react'
import { SearchResultsProps } from './search-results.types'
import ProductList from '../../components/product-list'
import { Loader } from '@beckn-ui/molecules'

const SearchResults: React.FC<SearchResultsProps> = ({ schema, isLoading = false }) => {
  const { productList, productCard, loader } = schema

  if (isLoading) return <Loader {...loader} />

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

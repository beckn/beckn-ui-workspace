import React, { useEffect, useState } from 'react'
import Sort from '../sort'
import ProductCard from '../ProductCard'
import { ProductListProps } from './ProductList.types'
import { ParsedItem } from '../../pages/searchResults/searchResults.types'
import { sortByCheapest, sortByExpensive } from './ProductList.utils'
import { Box } from '@chakra-ui/react'
import Styles from './product-list.module.css'

const ProductList: React.FC<ProductListProps> = props => {
  const { productList, ...restProps } = props
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
    <Box className={Styles.product_list_layout_container}>
      {sortedProductList && sortedProductList.length ? (
        <div className="sort-list-container">
          <Sort selectedBtn={selectedRadioBtn} onChangeSelectedBtn={onChangeHandler} />
          <Box className={Styles.product_card_list_container}>
            {sortedProductList.map(product => {
              return <ProductCard key={product.id} product={product} {...restProps} />
            })}
          </Box>
        </div>
      ) : (
        <p className={Styles.no_category_text}>
          There are no products in this category yet! New products will be added soon
        </p>
      )}
    </Box>
  )
}

export default ProductList

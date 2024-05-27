import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import Sort from './Sort'
import { Box } from '@chakra-ui/react'
import { ParsedItemModel } from '../../types/search.types'
import { ProductCard } from '@beckn-ui/becknified-components'
import ProductCardRenderer from '../productCard/product-card-renderer'
import { Typography } from '@beckn-ui/molecules'

interface ProductListPropsModel {
  productList: ParsedItemModel[]
}

export const sortByExpensive = (product1: ParsedItemModel, product2: ParsedItemModel): number => {
  return parseFloat(product2.item.price.value) - parseFloat(product1.item.price.value)
}

export const sortByCheapest = (product1: ParsedItemModel, product2: ParsedItemModel): number => {
  return parseFloat(product1.item.price.value) - parseFloat(product2.item.price.value)
}

const ProductList: React.FC<ProductListPropsModel> = ({ productList }) => {
  const { t } = useLanguage()
  const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>('all')
  const [sortedProductList, setSortedProductList] = useState<ParsedItemModel[]>([])

  useEffect(() => {
    setSortedProductList(productList)
  }, [productList])

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
    <>
      <Box
        mt={'50px'}
        className="hideScroll"
        maxH={'calc(100vh - 168px)'}
        overflowY="scroll"
      >
        <Sort
          onChangeSelectedBtn={onChangeHandler}
          selectedBtn={selectedRadioBtn}
        />
        <Box marginTop={'107px'}>
          {sortedProductList.length ? (
            sortedProductList.map((item, idx) => (
              <ProductCard
                key={idx}
                ComponentRenderer={ProductCardRenderer}
                dataSource={item}
              />
            ))
          ) : (
            <Typography
              text={t.noProduct}
              variant="subTitleRegular"
            />
          )}
        </Box>
      </Box>
    </>
  )
}

export default ProductList

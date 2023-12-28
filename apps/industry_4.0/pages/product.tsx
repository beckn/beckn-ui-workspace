import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductDetails from '../components/productDetails'
import { ParsedItemModel } from '../types/search.types'
import { fromBinary } from '../utilities/common-utils'

const Product = () => {
  const [product, setProduct] = useState<ParsedItemModel | null>(null)

  useEffect(() => {
    if (localStorage && localStorage.getItem('selectedItem')) {
      const parsedItem = JSON.parse(localStorage.getItem('selectedItem') as string)
      setProduct(parsedItem)
    }
  }, [])

  if (!product) {
    return <></>
  }

  return <ProductDetails product={product} />
}

export default Product

import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductDetails from '../components/productDetails'
import { ParsedItemModel } from '../types/search.types'
import { fromBinary } from '../utilities/common-utils'

const Product = () => {
  const [product, setProduct] = useState<ParsedItemModel | null>(null)
  const { productDetails } = Router.query

  useEffect(() => {
    if (productDetails) {
      setProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [productDetails])

  if (!product) {
    return <></>
  }

  return <ProductDetails product={product} />
}

export default Product

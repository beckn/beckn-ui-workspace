import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductDetails from '../components/productDetails'
import Confirmation from '../components/review/confirmation'
import { RetailItem } from '../lib/types/products'
import { fromBinary } from '../utilities/common-utils'

const Product = () => {
  const [product, setProduct] = useState<RetailItem | null>(null)
  const { productDetails, reviewSubmitted } = useRouter().query

  useEffect(() => {
    if (productDetails) {
      setProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [productDetails])

  if (product && !reviewSubmitted) {
    return <ProductDetails product={product} />
  } else if (product && reviewSubmitted) {
    return <Confirmation reviewSubmitted={Boolean(reviewSubmitted)} />
  } else return <></>
}

export default Product

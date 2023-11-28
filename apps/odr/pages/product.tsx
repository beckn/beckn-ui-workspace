import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductDetails from '../components/productDetails'
import { ParsedScholarshipData } from '../components/productList/ProductList.utils'
import { fromBinary } from '../utilities/common-utils'

const Product = () => {
  const [product, setProduct] = useState<ParsedScholarshipData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const { productDetails } = router.query

    if (productDetails) {
      setProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [router.isReady])

  if (!product) {
    return <></>
  }

  return <ProductDetails product={product} />
}

export default Product

import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import MedicineProductDetails from '../components/productDetails/MedicineProductDetails'
import { RetailItem } from '../lib/types/products'
import { fromBinary } from '../utilities/common-utils'

const MedicineProduct = () => {
  const [product, setProduct] = useState<RetailItem | null>(null)

  useEffect(() => {
    const { productDetails } = Router.query
    if (productDetails) {
      setProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [])

  if (!product) {
    return <></>
  }

  return <MedicineProductDetails product={product} />
}

export default MedicineProduct

import React from 'react'

import { DiscoveryRootState } from '@store/discovery-slice'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import ProductDetails from '@components/productDetails'

const Product = () => {
  const selectedProduct = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)

  if (!selectedProduct) {
    return <></>
  }
  return <ProductDetails product={selectedProduct} />
}

export default Product

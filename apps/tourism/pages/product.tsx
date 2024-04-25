import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { RetailItem } from '@lib/products'
import { fromBinary } from '@utils/common-utils'

const Product = () => {
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

  return (
    <ProductDetailPage
      schema={{
        productSummary: {
          imageSrc: product.descriptor.images[0],
          name: product.descriptor.name,
          desc: product.descriptor.long_desc
        },
        productDescription: {
          description: product.descriptor.long_desc
        },
        buttons: [{ text: 'Add to cart' }]
      }}
    />
  )
}

export default Product

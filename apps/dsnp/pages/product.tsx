import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProductDetails from '../components/productDetails'
import Confirmation from '../components/review/confirmation'
import { RetailItem } from '../lib/types/products'
import { fromBinary } from '../utilities/common-utils'
import Head from 'next/head'
import ProductPreview from '@components/productPreview'

const Product = () => {
  const [product, setProduct] = useState<RetailItem | null>(null)
  const { productDetails, reviewSubmitted, productName, productImage, productDesc } = useRouter().query

  useEffect(() => {
    if (productDetails) {
      setProduct(JSON.parse(fromBinary(window.atob(productDetails as string))))
    }
  }, [productDetails])

  if (product && !reviewSubmitted) {
    return (
      <div>
        <Head>
          <title>{product.descriptor.name}</title>
          <meta property="og:title" content={product.descriptor.name} />
          <meta property="og:description" content={product.descriptor.short_desc} />
          <meta property="og:image" content={product.descriptor.images[0]} />
        </Head>

        <ProductDetails product={product} />
      </div>
    )
  } else if (!product && reviewSubmitted && productName) {
    return (
      <Confirmation
        reviewSubmitted={Boolean(reviewSubmitted)}
        productImage={productImage as string}
        productName={productName as string}
      />
    )
  } else if (productDesc)
    return (
      <ProductPreview
        productImage={productImage as string}
        productName={productName as string}
        productDesc={productDesc as string}
      />
    )
  else return <></>
}

export default Product

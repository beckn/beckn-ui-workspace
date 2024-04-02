import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { RetailItem } from '@lib/products'
import { LocalStorage, ICartProduct, ICart, LocalStorageCart, LocalStorageCartItem } from '@lib/types'
import { cartActions } from '@store/cart-slice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setLocalStorage, getLocalStorage, addLocalStorage } from '@utils/localstorage'
import { fromBinary } from '@utils/common-utils'
import { DiscoveryRootState } from '@store/discovery-slice'

const Product = () => {
  const selectedProduct = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()

  if (!selectedProduct) {
    return <></>
  }

  return (
    <ProductDetailPage
      schema={{
        productSummary: {
          imageSrc: selectedProduct.item.images[0].url,
          name: selectedProduct.item.name,
          desc: selectedProduct.item.long_desc
        },
        productDescription: {
          description: selectedProduct.item.long_desc
        },
        buttons: [
          {
            text: 'Add to cart',
            handleClick: () => {
              dispatch(
                cartActions.addItemToCart({
                  product: selectedProduct,
                  quantity: 1
                })
              )
              toast.success('Product added to cart')
            }
          }
        ]
      }}
    />
  )
}

export default Product

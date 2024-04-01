import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { RetailItem } from '@lib/products'
import { LocalStorage, ICartProduct, ICart, LocalStorageCart, LocalStorageCartItem } from '@lib/types'
import { cartActions } from '@store/cart-slice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setLocalStorage, getLocalStorage, addLocalStorage } from '@utils/localstorage'
import { fromBinary } from '@utils/common-utils'

const Product = () => {
  const [product, setProduct] = useState<RetailItem | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const productDetails = getLocalStorage(LocalStorage.Product).encodedProduct
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
          imageSrc: product.images[0].url,
          name: product.name,
          desc: product.long_desc
        },
        productDescription: {
          description: product.long_desc
        },
        buttons: [
          {
            text: 'Add to cart',
            handleClick: () => {
              dispatch(
                cartActions.addItemToCart({
                  product: product,
                  quantity: 1
                })
              )
              // const cartItems:LocalStorageCart = getLocalStorage(LocalStorage.Cart)
              // if(cartItems && cartItems.length > 0){
              //   const newItems = cartItems.map((singleItem)=>{
              //     if(singleItem.product.id === product.id){
              //       return {
              //         product:product,
              //         quantity:singleItem.quantity + 1
              //       }
              //     }
              //     else return {
              //       product:product,
              //       quantity:1
              //     }
              //   })
              //   setLocalStorage(LocalStorage.Cart,newItems)
              // }
              // else{
              // addLocalStorage(LocalStorage.Cart,{product:product,quantity:1})
              // }
              toast.success('Product added to cart')
            }
          }
        ]
      }}
    />
  )
}

export default Product

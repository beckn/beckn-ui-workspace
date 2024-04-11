import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'

import { cartActions } from '@store/cart-slice'
import { useDispatch, useSelector } from 'react-redux'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'

import { useRouter } from 'next/router'
import { DiscoveryRootState } from '@store/discovery-slice'
import { useTheme } from '@chakra-ui/react'
import { CustomThemeType } from '@beckn-ui/molecules'

const Product = () => {
  const selectedProduct = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const [totalPrice, setTotalPrice] = useState(selectedProduct.item.price.value)
  console.log(selectedProduct)

  const increment = () => {
    const newCounter = counter + 1
    const newTotalPrice = newCounter * selectedProduct.item.price.value
    setCounter(newCounter)
    setTotalPrice(newTotalPrice)
  }

  const decrement = () => {
    if (counter > 1) {
      const newCounter = counter - 1
      const newTotalPrice = newCounter * selectedProduct.item.price.value
      setCounter(newCounter)
      setTotalPrice(newTotalPrice)
    }
  }
  const router = useRouter()

  if (!selectedProduct) {
    return <></>
  }
  return (
    <>
      <ProductDetailPage
        schema={{
          productSummary: {
            imageSrc: selectedProduct.item.images[0].url,
            name: selectedProduct.item.name,
            secondaryDescription: selectedProduct.item.long_desc,
            starRating: {
              rating: selectedProduct.item.rating,
              size: 20,
              setRating: () => {},
              starCount: 5
            },
            productCta: {
              currency: selectedProduct.item.price.currency,
              totalPrice: selectedProduct.item.price.value,
              handleIncrement: increment,
              handleDecrement: decrement,
              counterTitle: 'No Of Traveller',
              counter: counter,
              cta: {
                text: 'Book Now',
                color: 'white',
                handleClick: () => {
                  dispatch(
                    cartActions.addItemToCart({
                      product: selectedProduct,
                      quantity: counter
                    })
                  )
                  router.push('/checkout')
                }
              }
            }
          }
        }}
      />
    </>
  )
}

export default Product

import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'

import { cartActions } from '@store/cart-slice'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/router'
import { DiscoveryRootState } from '@store/discovery-slice'
import { Box, useTheme } from '@chakra-ui/react'
import { CustomThemeType } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'

const Product = () => {
  const selectedProduct = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const [totalPrice, setTotalPrice] = useState(selectedProduct.item.price.value)
  const { t } = useLanguage()

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
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
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
              counterTitle: `${t.numberOfTraveller}`,
              counter: counter,
              cta: {
                text: `${t.bookNow}`,
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
    </Box>
  )
}

export default Product

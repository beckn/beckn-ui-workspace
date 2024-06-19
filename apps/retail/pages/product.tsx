import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { cartActions } from '@store/cart-slice'
import { useDispatch, useSelector } from 'react-redux'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { DiscoveryRootState } from '@store/discovery-slice'
import { Box, useTheme } from '@chakra-ui/react'
import { CustomThemeType } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'
import { ParsedItemModel } from '@lib/types'
import { feedbackActions } from '@store/ui-feedback-slice'

const Product = () => {
  const { t } = useLanguage()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const [totalPrice, setTotalPrice] = useState<number>(Number(selectedProduct.item.price.value))

  const increment = () => {
    const newCounter = counter + 1
    const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
    setCounter(newCounter)
    setTotalPrice(newTotalPrice)
  }

  const decrement = () => {
    if (counter > 1) {
      const newCounter = counter - 1
      const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
      setCounter(newCounter)
      setTotalPrice(newTotalPrice)
    }
  }

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
              rating: selectedProduct.item.rating!,
              size: 20,
              setRating: () => {},
              starCount: 5
            },
            productCta: {
              currency: selectedProduct.item.price.currency,
              totalPrice: selectedProduct.item.price.value,
              handleIncrement: increment,
              handleDecrement: decrement,
              counter: counter,
              cta: {
                text: t.addToCart,
                color: 'black',
                handleClick: () => {
                  dispatch(
                    cartActions.addItemToCart({
                      product: selectedProduct,
                      quantity: counter
                    })
                  )
                  dispatch(
                    feedbackActions.setToastData({
                      toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
                    })
                  )
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

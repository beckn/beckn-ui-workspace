import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { ProductDetailPage, ProductPrice } from '@beckn-ui/becknified-components'
import { RetailItem } from '@lib/products'
import { ProductCard } from '@beckn-ui/becknified-components'
import { LocalStorage, ICartProduct, ICart, LocalStorageCart, LocalStorageCartItem } from '@lib/types'
import { cartActions } from '@store/cart-slice'
import { useDispatch, useSelector } from 'react-redux'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import { toast } from 'react-toastify'
import { setLocalStorage, getLocalStorage, addLocalStorage } from '@utils/localstorage'
import { fromBinary } from '@utils/common-utils'
import { useRouter } from 'next/router'
import { DiscoveryRootState } from '@store/discovery-slice'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { Button, CustomThemeType, Input, Typography } from '@beckn-ui/molecules'
import { useLanguage } from '@hooks/useLanguage'

const Product = () => {
  const theme = useTheme<CustomThemeType>()
  const selectedProduct = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const productList = useSelector((state: DiscoveryRootState) => state.discovery.productList)
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const { t } = useLanguage()
  const [totalPrice, setTotalPrice] = useState(selectedProduct.item.price.value)

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
              counter: counter,
              cta: {
                text: t.addToCart,
                color: '#fff',
                handleClick: () => {
                  dispatch(
                    cartActions.addItemToCart({
                      product: selectedProduct,
                      quantity: counter
                    })
                  )
                  toast.success(t.productAddedToCart)
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

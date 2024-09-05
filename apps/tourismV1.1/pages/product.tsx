import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { DiscoveryRootState, ParsedItemModel } from '@beckn-ui/common/lib/types'
import { useRouter } from 'next/router'
import { cartActions } from '@store/cart-slice'
import { testIds } from '@shared/dataTestIds'

const Product = () => {
  const router = useRouter()
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
            imageSrc: selectedProduct.item.images?.[0].url!,
            name: selectedProduct.item.name,
            secondaryDescription: selectedProduct.item.long_desc,
            dataTestTitle: testIds.item_title,
            dataTestDescription: testIds.item_description,
            starRating: {
              rating: selectedProduct.item.rating!,
              size: 20,
              setRating: () => {},
              starCount: 5,
              dataTest: testIds.item_rating
            },
            productCta: {
              currency: selectedProduct.item.price.currency,
              totalPrice: selectedProduct.item.price.value,
              handleIncrement: increment,
              handleDecrement: decrement,
              counterTitle: `${t.numberOfTraveller}`,
              counter: counter,
              cta: {
                dataTest: testIds.productpage_addTocartButton,
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

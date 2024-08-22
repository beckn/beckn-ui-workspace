import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { cartActions, DiscoveryRootState, feedbackActions, ParsedItemModel } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'

const Product = () => {
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)

  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1)
  const { t } = useLanguage()
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
            imageSrc: selectedProduct.item.images[0].url!,
            name: selectedProduct.item.name,
            secondaryDescription: selectedProduct.item.long_desc,
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
              counter: counter,
              cta: {
                dataTest: testIds.productpage_addTocartButton,
                text: t.addToCart,
                color: '#fff',
                handleClick: () => {
                  dispatch(
                    cartActions.addItemToCart({
                      product: selectedProduct,
                      quantity: counter
                    })
                  )

                  dispatch(
                    feedbackActions.setToastData({
                      toastData: {
                        message: t.success,
                        display: true,
                        type: 'success',
                        description: t.productAddedToCart
                      }
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

import React, { useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { DiscoveryRootState, ParsedItemModel } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'
import { RootState } from '@store/index'
import { useRouter } from 'next/router'

const Product = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  console.log(selectedProduct)
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
  const type = useSelector((state: RootState) => state.navigation.type)
  const productCta =
    type === 'RENT_AND_HIRE'
      ? {
          title: 'Rental Price',
          noCounter: true,
          currency: selectedProduct.item.price.currency,
          totalPrice: selectedProduct.item.price.value,
          rateLabel: '/ hr',
          cta: {
            dataTest: testIds.productpage_addTocartButton,
            text: 'Proceed',
            color: '#fff',
            handleClick: () => {
              dispatch(
                cartActions.addRentalItem({
                  product: selectedProduct,
                  quantity: counter
                })
              )
              router.push('/confirmRent')
            }
          }
        }
      : {
          currency: selectedProduct.item.price.currency,
          totalPrice: selectedProduct.item.price.value,
          handleIncrement: increment,
          handleDecrement: decrement,
          counter: counter,
          cta: {
            dataTest: testIds.productpage_addTocartButton,
            text: 'Add to Cart',
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
                    message: 'Success',
                    display: true,
                    type: 'success',
                    description: t.addedToCart
                  }
                })
              )
            }
          }
        }

  return (
    <Box
      className="hideScroll myStore-product-details product-text"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <ProductDetailPage
        schema={{
          productSummary: {
            imageSrc: selectedProduct.item.images?.[0].url!,
            name: selectedProduct.item.name,
            domain: selectedProduct.domain,
            providerName: selectedProduct.providerName,
            secondaryDescription: selectedProduct.item.long_desc,
            dataTestTitle: testIds.item_title,
            dataTestDescription: testIds.item_description,
            starRating: {
              rating: selectedProduct.item.rating!,
              size: 20,
              setRating: () => {},
              starCount: 5,
              dataTest: testIds.item_rating,
              useDefaultColor: true
            },
            productCta
          }
        }}
      />
    </Box>
  )
}

export default Product

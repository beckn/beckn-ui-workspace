import React, { useEffect, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { Box } from '@chakra-ui/react'
import { ParsedItemModel } from '../../types/search.types'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../store/cart-slice'
import { feedbackActions } from '../../store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'

interface Props {
  product: ParsedItemModel
}
const ProductDetails: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const [counter, setCounter] = useState(1)

  useEffect(() => {
    return () => {
      setCounter(1)
    }
  }, [product])

  const dispatch = useDispatch()

  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: counter
      })
    )
    dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Success', display: true, type: 'success', description: t.productAddedToCartMsg }
      })
    )
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
            imageSrc: product.item.images[0].url,
            name: product.item.name,
            secondaryDescription: product.item.long_desc,
            starRating: {
              rating: product.item.rating,
              size: 20,
              setRating: () => {},
              starCount: 5
            },
            productCta: {
              noCounter: true,
              currency: product.item.price.currency,
              totalPrice: product.item.price.value,

              cta: {
                dataTest: testIds.productpage_addTocartButton,
                text: 'Add to Cart',
                color: 'White',
                handleClick: () => {
                  addToCartHandler()
                }
              }
            }
          }
        }}
      />
    </Box>
  )
}

export default ProductDetails

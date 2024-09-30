import React, { useState } from 'react'
import { ProductDetailPage, ProductPrice } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Input } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { DiscoveryRootState, ParsedItemModel } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'
import { Button, Typography } from '@beckn-ui/molecules'
import { useRouter } from 'next/router'

const Product = () => {
  const { t } = useLanguage()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const router = useRouter()
  const [counter, setCounter] = useState(1)
  // const [totalPrice, setTotalPrice] = useState<number>(Number(selectedProduct.item.price.value))

  // const increment = () => {
  //   const newCounter = counter + 1
  //   const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
  //   setCounter(newCounter)
  //   setTotalPrice(newTotalPrice)
  // }

  // const decrement = () => {
  //   if (counter > 1) {
  //     const newCounter = counter - 1
  //     const newTotalPrice = newCounter * Number(selectedProduct.item.price.value)
  //     setCounter(newCounter)
  //     setTotalPrice(newTotalPrice)
  //   }
  // }

  const handleOnInput = (e: any) => {
    setCounter(Number(e.target.value))
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
            }
          }
        }}
      />
      <Flex
        alignItems={'center'}
        gap="2"
        mb={'10px'}
      >
        <Typography
          text="Price:"
          fontSize="16px"
          fontWeight="500"
        />
        <ProductPrice
          fontStyle={{
            fontSize: '16px',
            fontWeight: '500'
          }}
          currencyType={selectedProduct.item.price.currency}
          price={parseFloat(selectedProduct.item.price.value)}
          rateLabel={selectedProduct.item.price.rateLabel}
        />
      </Flex>
      <Flex
        alignItems={'center'}
        marginBottom={'1rem'}
        gap="10px"
      >
        <Typography
          text="Energy units(kWh):"
          fontSize="16px"
          fontWeight="500"
          style={{
            textWrap: 'nowrap'
          }}
        />
        <Input
          name="quantity-input"
          onChange={handleOnInput}
          type="number"
          value={counter.toString()}
          _focusVisible={{
            borderColor: 'inherit',
            boxShadow: 'transparent'
          }}
        />
      </Flex>
      <Button
        dataTest={testIds.productpage_addTocartButton}
        text={t.order}
        color={'#ffffff'}
        handleClick={() => {
          dispatch(
            cartActions.addItemToCart({
              product: selectedProduct,
              quantity: counter
            })
          )
          router.push('/cart')
          // dispatch(
          //   feedbackActions.setToastData({
          //     toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
          //   })
          // )
        }}
      />
    </Box>
  )
}

export default Product

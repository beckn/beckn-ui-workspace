import React from 'react'

import { useLanguage } from '../../hooks/useLanguage'

import { RetailItem } from '../../lib/types/products'
import ProductPrice from '../UI/ProductPrice'
import Button from '../button/Button'
import { Flex, Text } from '@chakra-ui/react'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../store/cart-slice'

interface Props {
  product: RetailItem
}
const LabCallToAction: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch()

  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: 1
      })
    )
    Router.push('/bookLabAppointment')
  }

  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg border_radius_all">
      <div className="w-full  items-center ">
        <Text fontSize={'12px'} fontWeight={600} className="pb-1">
          {t.priceText}
        </Text>
        <ProductPrice price={parseFloat(product.price.value)} isLargeSize={false} />
      </div>

      <br />
      <Button
        buttonText={
          <Flex justifyContent={'center'} alignItems={'center'}>
            {t.bookAppointmentText}
          </Flex>
        }
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={addToCartHandler}
      />
    </div>
  )
}

export default LabCallToAction

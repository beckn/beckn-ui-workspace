import React from 'react'
import { RetailItem } from '../../lib/types/products'
import Button from '../button/Button'
import { useRouter } from 'next/router'
import { cartActions } from '../../store/cart-slice'
import { useDispatch } from 'react-redux'

interface Props {
  product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  function addToCartHandler() {
    dispatch(
      cartActions.addItemToCart({
        product: product,
        quantity: 0
      })
    )
    router.push('/checkoutPage')
  }

  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 sm:p-4 xl:p-6">
      <Button
        buttonText={'Proceed'}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={addToCartHandler}
      />
    </div>
  )
}

export default CallToAction

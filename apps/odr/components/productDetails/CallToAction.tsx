import React from 'react'
import { RetailItem } from '../../lib/types/products'
import Button from '../button/Button'
import { useRouter } from 'next/router'

interface Props {
  product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
  const router = useRouter()
  function addToCartHandler() {
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

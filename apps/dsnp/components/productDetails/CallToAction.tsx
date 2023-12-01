import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../store/cart-slice'
import { RetailItem } from '../../lib/types/products'
import ProductPrice from '../UI/ProductPrice'
import { toast } from 'react-toastify'
import Button from '../button/Button'

interface Props {
  product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
  const [counter, setCounter] = useState(1)
  const { t } = useLanguage()
  const { theme } = useTheme()

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
    toast.success(t('productAddedToCartMsg'), {
      theme: theme === 'dark' ? 'dark' : 'light'
    })
  }

  return (
    <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 max-w-[350px] mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg border_radius_all bg-[#fcfbfe]">
      <div className="flex  w-full items-center gap-x-3.5">
        <p className="text-lg ">{t('total')}</p>
        <ProductPrice
          price={parseFloat(product.price.value)}
          isLargeSize={true}
        />
      </div>
      <br />
      <Button
        buttonText={t('byNow')}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={addToCartHandler}
      />
    </div>
  )
}

export default CallToAction

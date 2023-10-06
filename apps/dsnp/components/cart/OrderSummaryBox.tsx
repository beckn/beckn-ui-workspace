import React from 'react'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import { ICartRootState } from '../../lib/types/cart'
import ProductPrice from '../UI/ProductPrice'
import Button from '../button/Button'
import { Divider } from '@chakra-ui/react'
import EmptyCart from './EmptyCart'

interface OrderSummaryBoxPropsModel {
  onOrderClick: () => void
}

const OrderSummaryBox: React.FC<OrderSummaryBoxPropsModel> = props => {
  const { t, locale } = useLanguage()
  const totalAmount = useSelector((state: ICartRootState) => state.cart.totalAmount)

  const totalQuantity = useSelector((state: ICartRootState) => state.cart.totalQuantity)

  return (
    <>
      {totalQuantity > 0 ? (
        <>
          <div
            className="flex-grow sticky bottom-2 left-0 right-0 md:top-36 shadow-lg bg-[#fcfbfe] border-2 rounded-lg py-4 xl:py-12 px-4 xl:px-8 xl:mx-8  w-[89vw] md:w-auto  md:min-w-[300px] md:max-w-[400px]"
            style={{
              marginTop: '15px',
              marginBottom: '25px',
              zIndex: '9'
            }}
          >
            <h3 className="text-base font-bold sm:text-lg md:text-xl">{t('orderSummary')}</h3>
            <div className="flex flex-col my-1 sm:my-2" style={{ fontSize: '15px' }}>
              <div className="flex items-center justify-between my-2 md:my-4">
                <p className="text-base font-normal">{t('totalQuantity')}</p>
                <p className="font-bold rtl:ml-1 ltr:mr-1">{totalQuantity}</p>
              </div>
              <div className="flex flex-wrap items-baseline justify-between flex-grow my-2 md:my-4">
                <p className="text-base font-normal">{t('subtotal')}</p>
                <ProductPrice price={totalAmount} />
              </div>
            </div>
          </div>
          <Button
            buttonText={t('order')}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            isDisabled={false}
            handleOnClick={() => props.onOrderClick()}
          />
        </>
      ) : (
        <EmptyCart />
      )}
    </>
  )
}

export default OrderSummaryBox

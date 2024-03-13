import React from 'react'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import { ICartRootState } from '../../lib/types/cart'
import ProductPrice from '../UI/ProductPrice'
import EmptyCart from './EmptyCart'

interface OrderSummaryBoxPropsModel {
    onOrderClick: () => void
}

const OrderSummaryBox: React.FC<OrderSummaryBoxPropsModel> = (props) => {
    const { t, locale } = useLanguage()
    const totalAmount = useSelector(
        (state: ICartRootState) => state.cart.totalAmount
    )

    const totalQuantity = useSelector(
        (state: ICartRootState) => state.cart.totalQuantity
    )

    const currency = useSelector((state: ICartRootState) => state.cart.currency)

    return (
        <>
            {totalQuantity > 0 ? (
                <div
                    className="flex-grow sticky bottom-2 left-0 right-0 md:top-36 shadow-lg bg-[#fcfbfe] border-2 rounded-lg py-4 xl:py-12 px-4 xl:px-8 -mx-[1rem] md:mx-4 xl:mx-8  w-[98vw] md:w-auto  md:min-w-[300px] md:max-w-[400px]"
                    style={{ marginTop: '15px', zIndex: '9' }}
                >
                    <h3
                        className=" sm:text-lg md:text-xl"
                        style={{ fontSize: '17px' }}
                    >
                        {t.orderSummary}
                    </h3>
                    <div
                        className="flex flex-col my-3 sm:my-2"
                        style={{ fontSize: '15px' }}
                    >
                        <div className="flex items-center justify-between my-3">
                            <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">
                                {t.totalQuantity}
                            </p>
                            <p className="font-bold rtl:ml-1 ltr:mr-1">
                                {totalQuantity}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-baseline justify-between flex-grow md:my-4">
                            <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">
                                {t.totalAmount}
                            </p>
                            <ProductPrice
                                currency={currency}
                                price={totalAmount}
                            />
                        </div>
                    </div>
                    <a
                        style={{ marginTop: '15px', cursor: 'pointer' }}
                        onClick={() => props.onOrderClick()}
                        className="block py-3 text-center shadow-lg bg-palette-primary md:mt-8 border_radius_all text-palette-side"
                    >
                        {t.proceedToCheckout}
                    </a>
                </div>
            ) : (
                <EmptyCart />
            )}
        </>
    )
}

export default OrderSummaryBox

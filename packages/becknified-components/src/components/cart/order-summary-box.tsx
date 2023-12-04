import React from 'react'
import ProductPrice from '../product-price'
import { OrderSummaryProps } from './cart.types'

const OrderSummaryBox: React.FC<OrderSummaryProps> = ({ handleOrderClick, totalAmount, totalQuantity }) => {
  return (
    <>
      {totalQuantity > 0 ? (
        <div
          className="flex-grow sticky bottom-2 left-0 right-0 md:top-36 shadow-lg bg-[#fcfbfe] border-2 rounded-lg py-4 xl:py-12 px-4 xl:px-8 -mx-[1rem] md:mx-4 xl:mx-8  w-[98vw] md:w-auto  md:min-w-[300px] md:max-w-[400px]"
          style={{
            marginTop: '15px',
            zIndex: '9'
          }}
        >
          <h3
            className=" sm:text-lg md:text-xl"
            style={{
              fontSize: '17px'
            }}
          >
            Order Summary
          </h3>
          <div
            className="flex flex-col my-1 sm:my-2"
            style={{
              fontSize: '15px'
            }}
          >
            <div className="flex items-center justify-between md:my-4">
              <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">Total quantity</p>
              <p className="rtl:ml-1 ltr:mr-1 font-bold">{totalQuantity}</p>
            </div>
            <div className="flex flex-wrap items-baseline justify-between flex-grow md:my-4">
              <p className="text-sm sm:text-base text-palette-mute md:text-palette-base">Total Amount</p>
              <ProductPrice price={totalAmount} />
            </div>
          </div>
          <a
            style={{
              marginTop: '15px'
            }}
            onClick={() => handleOrderClick()}
            className="block bg-palette-primary md:mt-8 py-3 border_radius_all text-palette-side text-center shadow-lg"
          >
            Procees to Checkout
          </a>
        </div>
      ) : (
        <p className="text-palette-mute text-lg mx-auto mt-12">Cart is Empty</p>
      )}
    </>
  )
}

export default OrderSummaryBox

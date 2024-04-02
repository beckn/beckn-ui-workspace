import React, { useRef } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { cartUiActions } from '../../store/cartUI-slice'
import { ICartUiRootState, ICartRootState } from '../../lib/types/cart'
import { useLanguage } from '../../hooks/useLanguage'

const Basket = () => {
  const dispatch = useDispatch()
  const cartItemQuantity = useSelector((state: ICartRootState) => state.cart.totalQuantity)

  function onMouseHoverHandler(toggle: boolean) {
    dispatch(cartUiActions.toggleCartBox(toggle))
  }

  return (
    <div
      className="relative"
      onMouseOver={() => onMouseHoverHandler(true)}
      onMouseOut={() => onMouseHoverHandler(false)}
    >
      <Link
        legacyBehavior
        href="/cart"
      >
        <a className="relative flex items-center ltr:md:pl-6 rtl:md:pr-6 rtl:md:border-r-2 rtl:md:border-r-slate-300 ltr:md:border-l-2 ltr:md:border-l-slate-300 z-50">
          <AiOutlineShoppingCart
            style={{
              fontSize: '1.6rem'
            }}
          />
          <span
            style={{
              backgroundColor: 'rgba(var(--color-primary))'
            }}
            className="absolute -top-3 -right-[0.3rem] rtl:md:right-[1rem]  flex items-center justify-center w-5 h-5 rtl:pt-[0.1rem] rounded-full text-[0.75rem] leading-3 text-white shadow-lg"
          >
            {cartItemQuantity}
          </span>
        </a>
      </Link>
    </div>
  )
}

export default Basket

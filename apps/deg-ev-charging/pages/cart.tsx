import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ICartRootState } from '@beckn-ui/common'
import { currencyMap } from '@lib/config'
import { getCountryCode } from '@utils/general'

const Cart = () => {
  const router = useRouter()
  const { items, totalAmount } = useSelector((state: ICartRootState) => state.cart)

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Cart – EV Charging</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
        </Head>
        <div className="ev-app min-h-full bg-[var(--ev-bg)] flex flex-col items-center justify-center px-4 py-8">
          <p className="text-[var(--ev-text-muted)] text-sm sm:text-base mb-6">Your cart is empty.</p>
          <Link
            href="/"
            className="min-h-[var(--ev-touch-min)] flex items-center justify-center py-3 px-6 rounded-xl font-medium bg-[var(--ev-primary)] text-white hover:opacity-90 active:opacity-90 text-base"
          >
            Find charging stations
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Cart – EV Charging</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <div className="ev-app min-h-full bg-[var(--ev-bg)]">
        <main
          data-ev-main
          className="max-w-2xl mx-auto w-full px-4 py-4 sm:py-8 pb-[calc(var(--ev-bottom-nav-h)+var(--ev-safe-bottom)+1.5rem)]"
        >
          <h1 className="text-lg sm:text-xl font-semibold text-[var(--ev-text)] mb-4 sm:mb-6">Cart</h1>
          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {items.map((item: { id?: string; name?: string; totalPrice?: number; quantity?: number }) => (
              <li
                key={item.id}
                className="bg-[var(--ev-surface)] rounded-xl border border-[var(--ev-border)] p-4 flex justify-between items-center gap-4 min-h-[var(--ev-touch-min)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--ev-text)] text-sm sm:text-base truncate">
                    {item.name || 'Charging station'}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--ev-text-muted)] mt-0.5">Qty: {item.quantity ?? 1}</p>
                </div>
                <p className="font-medium text-[var(--ev-text)] text-sm sm:text-base shrink-0">
                  {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                  {item.totalPrice ?? 0}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-[var(--ev-text)] text-base sm:text-lg">Total</span>
            <span className="text-lg sm:text-xl font-bold text-[var(--ev-primary)]">
              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
              {totalAmount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="w-full min-h-[var(--ev-touch-min)] py-3.5 rounded-xl font-medium bg-[var(--ev-primary)] text-white hover:bg-[var(--ev-primary-hover)] active:opacity-90 transition text-base"
          >
            Proceed to checkout
          </button>
        </main>
      </div>
    </>
  )
}

export default Cart

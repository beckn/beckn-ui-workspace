import { Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import useRequest from '../../hooks/useRequest'
import { ICartRootState } from '../../lib/types/cart'
import { cartActions } from '../../store/cart-slice'
import { getPayloadForSelectRequest } from '../../utilities/cart-utils'

import { ParsedItemModel } from '../../types/search.types'
import { Item } from '../../lib/types/select.types'
import { ProductPrice } from '@beckn-ui/becknified-components'
import { testIds } from '@shared/dataTestIds'

interface Props {
  product: Item
  setIsLoadingForCartCountChange: Function
}
const CartItem: React.FC<Props> = ({ product, setIsLoadingForCartCountChange }) => {
  const quoteRequest = useRequest()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const payLoadForQuoteRequest = getPayloadForSelectRequest(cartItems)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const productQuantity = useSelector(
    (state: ICartRootState) => state.cart.items.find(item => item.item.id === product.id)?.quantity
  )
  const [counter, setCounter] = useState(productQuantity)
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const fetchQuotes = () => {
    setIsLoadingForCartCountChange(true)
    quoteRequest
      .fetchData(`${apiUrl}/select`, 'POST', payLoadForQuoteRequest)
      .then(data => setIsLoadingForCartCountChange(false))
      .catch(e => console.error(e))
  }

  function increment(product: ParsedItemModel) {
    setCounter(prev => ++prev!)
    dispatch(cartActions.addItemToCart({ product: product, quantity: 1 }))
    fetchQuotes()
  }

  function decrement(slug: string) {
    setCounter(prev => --prev!)
    dispatch(cartActions.removeItemFromCart(slug))
    fetchQuotes()
  }

  console.log([product])

  return (
    <>
      <div className="flex items-center flex-wrap sm:my-4 sm:py-4 px-2 border-b-2 mb-4">
        <div
          style={{
            width: '100%'
          }}
          className="lg:w-1/2 sm:min-w-[290px]"
        >
          {/* <Link
          href={`/${product.category[0]}/${product.category[1]}/${product.category[2]}/${product.slug.current}`}
        > */}
          <a
            className="flex flex-wrap sm:flex-nowrap justify-center items-center flex-grow"
            style={{
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '107px',
                height: '107px',
                marginBottom: '5px',
                position: 'relative'
              }}
            >
              <Image
                data-test={testIds.cartpage_itemImage}
                src={product.images[0].url}
                alt={'product-name'}
                className="object-contain"
              />
            </div>
            {counter === 1 ? (
              <div
                data-test={testIds.cartpage_trashButton}
                onClick={() => decrement(product.id)}
                className="p-1"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0'
                }}
              >
                <HiOutlineTrash
                  style={{
                    fontSize: '1.3rem',
                    color: 'black'
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => decrement(product.id)}
                className="p-1"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0'
                }}
                data-test={testIds.cartpage_trashButton}
              >
                <HiMinusSm
                  style={{
                    fontSize: '1rem'
                  }}
                />
              </div>
            )}

            <div
              data-test={testIds.cartpage_itemName}
              className="flex-grow text-sm font-normal mb-2 sm:mb-0 mx-2 w-full text-center pt-1"
              style={{
                direction: 'ltr',
                fontSize: '17px',
                marginTop: '12px'
              }}
            >
              {product.name}
            </div>
          </a>
          {/* </Link> */}
        </div>
        <div className="flex flex-wrap flex-grow md:items-center mb-4 sm:mb-0">
          <div
            className="flex flex-grow items-center justify-center font-normal rtl:mr-1 lrt:ml-1"
            style={{
              fontSize: '15px'
            }}
          >
            <p
              style={{
                marginRight: '10px'
              }}
              data-test={testIds.cartpage_totalAmountText}
            >
              {t.totalAmount}
            </p>

            <ProductPrice
              price={parseFloat(product.price.value) * counter!}
              currencyType={product.price.currency}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartItem

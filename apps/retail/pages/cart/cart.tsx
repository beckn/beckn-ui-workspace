import { useRouter } from 'next/router'

import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import { Cart as BecknCart } from '@beckn-ui/becknified-components'
import { useSelectMutation } from '@services/select'
import axios from 'axios'
import { Loader } from '@beckn-ui/molecules'
import useRequest from '../../hooks/useRequest'
import { getSelectPayload } from './cart.utils'

import { DataPerBpp, CartItemForRequest, ICartRootState, TransactionIdRootState, CartRetailItem } from '@lib/types'
import { DiscoveryRootState } from '@lib/discovery'
import { responseDataActions } from '../../store/responseData-slice'
import { getCartItemsPerBpp, getItemsForCart, getPayloadForQuoteRequest } from '../../utilities/cart-utils'

// const getSelectPayload = (bppId,bppUri,transactionId,items)=>{
//   return {
//     "data": [
//         {
//             "context": {
//                 "transaction_id":"fd5d55f2-f7cf-400c-869b-cb3e048bda10",
//                 "bpp_id": "strapi-bpp-plugin",
//                 "bpp_uri": "https://strapi-bpp-network.becknprotocol.io",
//                 "domain": "retail"
//             },
//             "message": {
//                 "orders": [
//                     {
//                         "items": [
//                             {
//                                 "id": "2",
//                                 "selected": {
//                                     "quantity": {
//                                         "count": 4
//                                     }
//                                 }
//                             }
//                         ],
//                         "provider": {
//                             "id": "2"
//                         },
//                         "fulfillments": [
//                             {
//                                 "id": "f1"
//                             }
//                         ]
//                     }
//                 ]
//             }
//         }
//     ]
// }
// }

const Cart = () => {
  const [itemsForCart, setItemsForCart] = useState<CartRetailItem[]>([])
  const [isLoadingForCartCountChange, setIsLoadingForCartCountChange] = useState<boolean>(false)
  const [fetchQuotes, { isLoading }] = useSelectMutation()

  const quoteRequest = useRequest()
  const router = useRouter()
  const { t } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const cartData = useSelector((state: ICartRootState) => state.cart)
  const transactionId = useSelector((state: DiscoveryRootState) => state.transactionId)
  console.log('Dank', cartData.items)

  useEffect(() => {
    fetchQuotes(getSelectPayload(cartData.items))
  }, [])

  const onOrderClick = () => {
    router.push('/checkoutPage')
  }

  return (
    <div>
      <BecknCart
        isLoading={isLoading}
        schema={{
          cartItems: cartData.items.map(singleItem => ({
            id: singleItem.id,
            quantity: singleItem.quantity,
            name: singleItem.name,
            image: singleItem.images[0].url,
            price: Number(singleItem.price.value),
            symbol: '€',
            handleIncrement: () => {
              console.log('Incremented')
            },
            handleDecrement: () => {
              console.log('Decremented')
            }
          })),
          loader: { text: 'Loading....' },
          orderSummary: {
            totalAmount: {
              price: 25
            },
            totalQuantity: {
              text: '3',
              variant: 'subTitleSemibold'
            },
            pageCTA: {
              text: 'Proceed to checkout',
              handleClick: onOrderClick
            }
          }
        }}
      />
    </div>
  )
}

export default Cart

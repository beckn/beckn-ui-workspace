import { CartItemForRequest, CartRetailItem, DataPerBpp, SelectData, SelectItem, SelectOrder } from '../lib/types/cart'

export const getCartItemsPerBpp = (cart: CartItemForRequest[]) => {
  const itemsPerBpp: { [key: string]: CartItemForRequest[] } = {}

  cart.map((item: CartItemForRequest) => {
    const bppId = item.bpp_id

    if (itemsPerBpp[bppId]) {
      itemsPerBpp[bppId].push(item)
    } else {
      itemsPerBpp[bppId] = [item]
    }
  })

  return itemsPerBpp
}

export const getPayloadForQuoteRequest = (
  cartItemsPerBppPerProvider: DataPerBpp,
  transactionId: { transactionId: string }
) => {
  const payload: any = {
    selectRequestDto: []
  }

  Object.keys(cartItemsPerBppPerProvider).forEach(bppId => {
    const cartItem: any = {
      context: {
        transaction_id: transactionId.transactionId,
        bpp_id: bppId,
        bpp_uri: cartItemsPerBppPerProvider[bppId][0].bpp_uri,
        domain: 'retail'
      },
      message: {
        order: {
          items: [],
          provider: {
            id: cartItemsPerBppPerProvider[bppId][0].providerId
          },
          locations: cartItemsPerBppPerProvider[bppId][0].locations
        }
      }
    }
    cartItemsPerBppPerProvider[bppId].forEach((item: any) => {
      if (item.bpp_id === bppId) {
        const itemObject = {
          quantity: {
            count: item.quantity
          },
          id: item.id
        }
        cartItem.message.order.items.push(itemObject)
      }
    })

    payload.selectRequestDto.push(cartItem)
  })
  return payload
}

// export const getItemsForCart = (quoteData: ResponseModel[]) => {
//   const items: CartRetailItem[] = []

//   quoteData.forEach(data => {
//     const { catalogs } = data.message
//     const { order } = catalogs
//     const { items: orderItems } = order

//     items.push(...orderItems)
//   })

//   return items
// }

export const getSelectPayload = (
  inputData: CartItemForRequest[],
  transactionId: string,
  domain = 'retail'
): { data: SelectData } => {
  const transaction_id = transactionId

  const resultData: SelectData = []

  const bppGroups = inputData.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
    if (!acc[item.bpp_id]) {
      acc[item.bpp_id] = []
    }
    acc[item.bpp_id].push(item)
    return acc
  }, {})

  Object.entries(bppGroups).forEach(([bpp_id, items]) => {
    console.log('Dank', bpp_id)
    const context = {
      transaction_id,
      bpp_id,
      bpp_uri: items[0].bpp_uri,
      domain
    }

    const orders: SelectOrder[] = []

    const providerGroups = items.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
      const providerKey = `${item.providerId}`
      if (!acc[providerKey]) {
        acc[providerKey] = []
      }
      acc[providerKey].push(item)
      return acc
    }, {})

    Object.values(providerGroups).forEach(group => {
      group.forEach(item => {
        const orderIndex = orders.findIndex(order => order.provider.id === item.providerId)
        const newItem: SelectItem = {
          id: item.id,
          selected: {
            quantity: {
              count: item.quantity
            }
          }
        }

        if (orderIndex > -1) {
          orders[orderIndex].items.push(newItem)
        } else {
          orders.push({
            items: [newItem],
            provider: {
              id: item.providerId
            },
            fulfillments:
              item.fulfillments &&
              item.fulfillments.map(fulfillment => ({
                id: fulfillment.id
              }))
          })
        }
      })
    })

    resultData.push({
      context,
      message: { orders }
    })
  })

  return { data: resultData }
}

import { CartItemForRequest, CartRetailItem } from '../lib/types/cart'
import { Item, SelectData } from '../lib/types/select.types'
import { ParsedItemModel } from '../types/search.types'

export const getCartItemsPerBpp = (cart: CartItemForRequest[]) => {
  const itemsPerBpp: Record<string, any> = {}

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

export const getItemsForCart = (quoteData: SelectData[]) => {
  const items: Item[] = []

  quoteData.forEach(data => {
    const { order } = data.message
    const { items: orderItems } = order
    // const { items: orderItems } = order

    items.push(...orderItems)
  })

  return items
}

export const getPayloadForSelectRequest = (cartItems: CartRetailItem[]) => {
  const payload: any = { data: [] }

  // Group cart items by bppId
  const groupedByBppId: Record<string, ParsedItemModel[]> = cartItems.reduce(
    (acc: Record<string, ParsedItemModel[]>, item) => {
      if (!acc[item.bppId]) {
        acc[item.bppId] = []
      }
      acc[item.bppId].push(item)
      return acc
    },
    {}
  )

  Object.entries(groupedByBppId).forEach(([bppId, items]) => {
    const context = {
      transaction_id: items[0].transactionId,
      bpp_id: bppId,
      bpp_uri: items[0].bppUri,
      domain: items[0].domain
    }

    // Group items by providerName within each bppId
    const groupedByProvider: Record<string, ParsedItemModel[]> = items.reduce(
      (acc: Record<string, ParsedItemModel[]>, item) => {
        if (!acc[item.providerName]) {
          acc[item.providerName] = []
        }
        acc[item.providerName].push(item)
        return acc
      },
      {}
    )

    const message = {
      orders: Object.entries(groupedByProvider).map(([providerName, providerItems]) => {
        const provider = { id: providerItems[0].providerId }
        const items = providerItems.map(item => ({
          id: item.item.id,
          fulfillments: item.item.fulfillments,
          tags: [
            {
              descriptor: {
                name: `select-${item.item.id}`
              }
            }
          ]
        }))

        return { provider, items }
      })
    }

    payload.data.push({ context, message })
  })

  return payload
}

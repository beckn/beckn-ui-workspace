import { CartItemForRequest, CartRetailItem, DataPerBpp, SelectData, SelectItem, SelectOrder } from '../lib/types/cart'

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
          quantity: {
            selected: {
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

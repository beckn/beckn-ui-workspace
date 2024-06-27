import {
  CartItemForRequest,
  SelectData,
  SelectItem,
  SelectOrder,
  ParsedItemModel,
  ConfirmResponseModel,
  InitResponseModel
} from '../../lib/types'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { geocodeFromPincode } from './checkout-utils'

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

export const getPayloadForSelectRequest = (selectedProduct: ParsedItemModel) => {
  const {
    bppId,
    bppUri,
    transactionId,
    domain,
    providerId,
    item: { id, fulfillments, tags }
  } = selectedProduct

  const selectPayload = {
    data: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: bppId,
          bpp_uri: bppUri,
          domain: domain
        },
        message: {
          orders: [
            {
              provider: {
                id: providerId
              },
              items: [
                {
                  id
                }
              ],
              fulfillments,
              tags: [
                {
                  descriptor: {
                    name: 'select-1'
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }

  return selectPayload
}

export const getInitPayload = async (
  deliveryAddress: ShippingFormInitialValuesType,
  billingAddress: ShippingFormInitialValuesType,
  cartItems: CartItemForRequest[],
  transaction_id: string,
  domain: string = 'retail:1.1.0',
  fulfillments: { id: string; type: string } = { id: '3', type: 'Standard-shipping' }
) => {
  const cityData = await geocodeFromPincode(deliveryAddress.pinCode!)

  const bppGroups = cartItems.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
    if (!acc[item.bpp_id]) {
      acc[item.bpp_id] = []
    }
    acc[item.bpp_id].push(item)
    return acc
  }, {})

  const data = Object.entries(bppGroups).map(([bpp_id, items]) => {
    return {
      context: {
        transaction_id: transaction_id,
        bpp_id: bpp_id,
        bpp_uri: items[0].bpp_uri,
        domain: domain
      },
      message: {
        orders: transformOrdersByProvider(items, fulfillments)
      }
    }
  })

  function transformOrdersByProvider(items: CartItemForRequest[], fullf: { id: string; type: string }) {
    const providerGroups = items.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
      const providerKey = `${item.bpp_id}_${item.providerId}`
      if (!acc[providerKey]) {
        acc[providerKey] = []
      }
      acc[providerKey].push(item)
      return acc
    }, {})

    return Object.values(providerGroups).map(group => {
      const providerId = group[0].providerId
      const items = group.map(item => ({
        id: item.id,
        quantity: {
          selected: {
            count: item.quantity
          }
        }
      }))

      const fulfillments = [
        {
          id: fullf.id,
          type: fullf.type,
          customer: {
            person: {
              name: deliveryAddress.name
            },
            contact: {
              phone: deliveryAddress.mobileNumber
            }
          },
          stops: [
            {
              location: {
                gps: `${cityData.lat},${cityData.lng}`,
                address: deliveryAddress.address,
                city: {
                  name: cityData?.city
                },
                state: {
                  name: cityData?.state
                },
                country: {
                  code: 'IND'
                },
                area_code: deliveryAddress.pinCode
              },
              contact: {
                phone: deliveryAddress.mobileNumber,
                email: deliveryAddress.email
              }
            }
          ]
        }
      ]

      return {
        provider: {
          id: providerId
        },
        items,
        fulfillments,
        billing: {
          name: billingAddress.name,
          phone: billingAddress.mobileNumber,
          address: billingAddress.address,
          email: billingAddress.email,
          city: {
            name: cityData?.city
          },
          state: {
            name: cityData?.state
          }
        }
      }
    })
  }

  return { data }
}

export const getPayloadForConfirm = (initResponse: InitResponseModel[]) => {
  const {
    context,
    message: {
      order: { billing, fulfillments, items, payments, provider, quote, type }
    }
  } = initResponse[0]
  const { transaction_id, bpp_id, bpp_uri, domain } = context

  const payload = {
    data: [
      {
        context: {
          transaction_id: transaction_id,
          bpp_id: bpp_id,
          bpp_uri: bpp_uri,
          domain: domain
        },
        message: {
          orders: [
            {
              provider: {
                id: provider.id
              },
              items: items,
              fulfillments: fulfillments,
              billing: billing,
              payments: [
                {
                  id: payments[0].id,
                  params: {
                    amount: quote.price.value,
                    currency: quote.price.currency
                  },
                  status: 'PAID',
                  type: 'ON-FULFILLMENT'
                }
              ]
            }
          ]
        }
      }
    ]
  }

  return payload
}

export const getPayloadForOrderStatus = (confirmResponse: ConfirmResponseModel[]) => {
  const {
    context: { transaction_id, bpp_id, bpp_uri, domain },
    message: { orderId }
  } = confirmResponse[0]
  const payLoad = {
    data: [
      {
        context: {
          transaction_id: transaction_id,
          bpp_id: bpp_id,
          bpp_uri: bpp_uri,
          domain: domain
        },
        message: {
          order_id: orderId
        }
      }
    ]
  }

  return payLoad
}

export const getPayloadForOrderHistoryPost = (confirmData: ConfirmResponseModel[]) => {
  const { bpp_id, bpp_uri, transaction_id } = confirmData[0].context
  const {
    orderId,
    provider: { id, name, short_desc },
    items,
    quote,
    payments
  } = confirmData[0].message

  const ordersPayload = {
    context: {
      bpp_id,
      bpp_uri,
      transaction_id
    },
    message: {
      order: {
        id: orderId,
        provider: {
          id,
          descriptor: {
            name,
            short_desc
          }
        },
        items,
        quote,
        payments
      }
    },
    category: {
      set: [6]
    }
  }

  return ordersPayload
}

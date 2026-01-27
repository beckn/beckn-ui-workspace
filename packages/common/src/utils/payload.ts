import {
  CartItemForRequest,
  SelectData,
  SelectItem,
  SelectOrder,
  ParsedItemModel,
  ConfirmResponseModel,
  InitResponseModel,
  SelectResponseModel
} from '../../lib/types'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { geocodeFromPincode } from './checkout-utils'

export const getSelectPayload = (
  inputData: CartItemForRequest[],
  transactionId: string,
  domain = 'retail',
  location?: any
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
      domain,
      ...(location && { location })
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
              id: item.providerId,
              name: item.providerName
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

export const getInitPayload = async (
  deliveryAddress: ShippingFormInitialValuesType,
  billingAddress: ShippingFormInitialValuesType | Record<string, any>,
  cartItems: CartItemForRequest[],
  transaction_id: string,
  domain: string = 'retail:1.1.0',
  selectResponse: SelectResponseModel[] = [],
  location?: any
) => {
  const cityData = { country: '', state: '', city: '' } //await geocodeFromPincode(deliveryAddress.pinCode!)

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
        domain: domain,
        ...(location && { location })
      },
      message: {
        orders: transformOrdersByProvider(items, selectResponse)
      }
    }
  })

  function transformOrdersByProvider(items: CartItemForRequest[], selectResponse: SelectResponseModel[]) {
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
          id: selectResponse?.filter(response => response.message.order.provider.id === providerId)?.[0]?.message?.order
            ?.fulfillments?.[0]?.id,
          type: selectResponse?.filter(response => response.message.order.provider.id === providerId)?.[0]?.message
            ?.order?.fulfillments?.[0]?.type,
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
                gps: `${cityData.lat || '12.970005'},${cityData.lng || '77.572559'}`,
                address: deliveryAddress.address,
                city: {
                  name: cityData?.city || 'Bengaluru'
                },
                state: {
                  name: cityData?.state || 'Karnataka'
                },
                country: {
                  code: 'IND'
                },
                area_code: deliveryAddress.pinCode
              },
              contact: {
                phone: deliveryAddress.mobileNumber,
                email: deliveryAddress.email,
                name: deliveryAddress.name
              }
            }
          ]
        }
      ]

      const billingDetails = billingAddress
        ? {
            name: billingAddress.name,
            phone: billingAddress.mobileNumber,
            address: billingAddress.address,
            email: billingAddress.email,
            city: {
              name: cityData?.city || 'Bengaluru'
            },
            state: {
              name: cityData?.state || 'Karnataka'
            }
          }
        : null

      return {
        provider: {
          id: providerId
        },
        items,
        fulfillments,
        billing: billingDetails
      }
    })
  }

  return { data }
}

export const getPayloadForConfirm = (initResponse: InitResponseModel[], location?: any) => {
  const payload = {
    data: initResponse.map(response => {
      const {
        context,
        message: {
          order: { billing, fulfillments, items, payments, provider, quote }
        }
      } = response
      const { transaction_id, bpp_id, bpp_uri, domain } = context

      return {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain,
          ...(location && location)
        },
        message: {
          orders: [
            {
              provider: {
                id: provider.id
              },
              items,
              fulfillments,
              billing,
              payments:
                payments?.map(payment => ({
                  id: payment.id,
                  params: {
                    amount: quote?.price?.value,
                    currency: quote?.price?.currency
                  },
                  status: 'PAID',
                  type: 'ON-FULFILLMENT'
                })) || []
            }
          ]
        }
      }
    })
  }

  return payload
}

export const getPayloadForOrderStatus = (confirmResponse: ConfirmResponseModel[], location?: any) => {
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
          domain: domain,
          ...(location && { location })
        },
        message: {
          order_id: orderId
        }
      }
    ]
  }

  return payLoad
}

export const getPayloadForOrderHistoryPost = (confirmData: ConfirmResponseModel, categoryId: number) => {
  console.log(categoryId)
  const { bpp_id, bpp_uri, transaction_id } = confirmData.context
  const {
    orderId,
    provider: { id, name, short_desc },
    items,
    quote,
    payments,
    fulfillments
  } = confirmData.message

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
        fulfillments,
        quote: { price: { currency: quote.price.currency, value: Number(quote.price.value) || 0 } },
        payments
      }
    },
    category: categoryId
  }

  return ordersPayload
}

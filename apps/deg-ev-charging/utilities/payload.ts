import { SelectData, SelectItem, SelectOrder } from '@lib/types/beckn/select'
import { InitOrder, InitSingleData } from '@lib/types/beckn/init'
import {
  InitResponseModel,
  ConfirmResponseModel,
  CartItemForRequest,
  geocodeFromPincode,
  QuantityDetails
} from '@beckn-ui/common'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { SelectedCharger } from '@store/chargerSelect-slice'

export const getSelectPayload = (
  inputData: CartItemForRequest[],
  transactionId: string,
  domain = 'retail',
  location?: any,
  selectedCharger?: SelectedCharger
): { data: SelectData } => {
  const transaction_id = transactionId

  const resultData: SelectData = []
  console.log(inputData)
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
              measure: {
                value: item.quantity.toString()
              }
            }
          },
          tags: [
            {
              list: [
                {
                  descriptor: { code: 'port_type', name: selectedCharger?.selectedPort?.type || '' },
                  value: selectedCharger?.selectedPort?.type || '',
                  display: true
                }
              ]
            }
          ]
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
  cartDetails: { cartItems: CartItemForRequest[]; updatedQuantity: string },
  transaction_id: string,
  domain: string = 'retail:1.1.0',
  fulfillments: { id: string; type: string } = { id: '3', type: 'Standard-shipping' },
  location?: any
) => {
  const cityData = await geocodeFromPincode(deliveryAddress.pinCode!)
  console.log(cityData)
  const bppGroups = cartDetails.cartItems.reduce((acc: { [key: string]: CartItemForRequest[] }, item) => {
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
        orders: transformOrdersByProvider(items, fulfillments, cartDetails.updatedQuantity)
      }
    }
  })

  function transformOrdersByProvider(
    items: CartItemForRequest[],
    fullf: { id: string; type: string },
    quantity: string
  ) {
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
            measure: {
              value: quantity.toString() || item.quantity.toString()
            }
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

export const getConfirmPayload = (initResponse: InitResponseModel) => {
  const { context: initContext, message } = initResponse
  const {
    order: { items, provider, fulfillments, billing }
  } = message

  const context = {
    ...initContext,
    action: 'confirm'
  }

  const resultData: InitSingleData[] = []
  const orders: InitOrder[] = []
  const userDetails = {
    name: billing.name,
    phone: billing.phone,
    email: billing.email
  }

  orders.push({
    items: items as any,
    provider: {
      id: provider.id
    },
    fulfillments: fulfillments as any,
    customer: {
      person: {
        name: billing.name
      },
      contact: userDetails
    },
    billing: userDetails
  })

  resultData.push({
    context: {
      ...context
    },
    message: { orders }
  })

  return { data: resultData }
}

export const getCancelPayload = (
  confirmResponse: ConfirmResponseModel,
  cancel_reason: { id: string | number; reason: string }
) => {
  const { context, message } = confirmResponse
  const order_id = confirmResponse?.message?.orderId
  return {
    data: {
      context,
      message: {
        order_id,
        cancellation_reason_id: cancel_reason.id + '',
        descriptor: {
          short_desc: cancel_reason.reason
        }
      }
    }
  }
}

export const getPayloadForConfirm = (initResponse: InitResponseModel[], location?: any) => {
  const payload = {
    data: initResponse.map(({ context, message: { order } }) => ({
      context: {
        transaction_id: context.transaction_id,
        bpp_id: context.bpp_id,
        bpp_uri: context.bpp_uri,
        domain: context.domain,
        ...(location && location)
      },
      message: {
        orders: [
          {
            provider: {
              id: order.provider.id
            },
            items: (order.items as any).map((data: any) => {
              return {
                ...data,
                quantity: {
                  ...data.quantity,
                  selected: {
                    measure: {
                      value: data.quantity.selected.measure.value.toString()
                    }
                  }
                }
              }
            }),
            fulfillments: order.fulfillments,
            billing: order.billing,
            payments: [
              {
                id: order.payments?.[0]?.id,
                params: {
                  amount: order.quote?.price?.value.toString(),
                  currency: order.quote?.price?.currency
                },
                status: 'PAID',
                type: 'ON-FULFILLMENT'
              }
            ]
          }
        ]
      }
    }))
  }

  return payload
}

export const getPayloadForOrderHistoryPost = (confirmData: ConfirmResponseModel[], categoryId: number) => {
  console.log(categoryId)

  const ordersPayload = confirmData.map(({ context, message }) => ({
    context: {
      bpp_id: context.bpp_id,
      bpp_uri: context.bpp_uri,
      transaction_id: context.transaction_id
    },
    message: {
      order: {
        id: message.orderId,
        provider: {
          id: message.provider.id,
          descriptor: {
            name: message.provider.name,
            short_desc: message.provider.short_desc
          }
        },
        items: message.items,
        fulfillments: message.fulfillments,
        quote: {
          price: {
            currency: message.quote.price.currency,
            value:
              parseFloat(message.quote.price.value) *
              parseFloat((message.items?.[0]?.quantity as QuantityDetails)?.selected.measure.value)
          }
        },
        payments: message.payments
      }
    },
    category: categoryId
  }))

  return { data: ordersPayload }
}

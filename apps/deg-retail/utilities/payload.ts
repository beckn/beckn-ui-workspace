import { ConfirmResponseModel, InitResponseModel } from '@beckn-ui/common'

export const getPayloadForConfirm = (initResponse: InitResponseModel[], cartAndEmiDetails: any, location?: any) => {
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
                  selected: { count: cartAndEmiDetails.cartDetails[order.provider.id][data.id].quantity }
                }
              }
            }),
            fulfillments: order.fulfillments,
            billing: order.billing,
            payments: [
              {
                id: order.payments?.[0]?.id,
                params: {
                  amount: `${
                    (order.items as any).reduce((total: number, item: any) => {
                      return (
                        total +
                        Number(item.price.value) * cartAndEmiDetails.cartDetails[order.provider.id][item.id].quantity
                      )
                    }, 0) +
                    Number(cartAndEmiDetails?.emiDetails?.deliveryCharges || 0) +
                    Number(cartAndEmiDetails?.emiDetails?.processingFee || 0)
                  }`,
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

export const getPayloadForOrderHistoryPost = (
  confirmData: ConfirmResponseModel[],
  categoryId: number,
  cartAndEmiDetails: any
) => {
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
            value: Number(message.quote.price.value)
          }
        },
        payments: message.payments
      }
    },
    category: categoryId
  }))

  return { data: ordersPayload }
}

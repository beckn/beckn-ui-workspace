import { ConfirmResponseModel, InitResponseModel } from '@beckn-ui/common'

export const getPayloadForConfirm = (initResponse: InitResponseModel[], cartPriceDetails: any) => {
  const payload = {
    data: initResponse.map(({ context, message: { order } }) => ({
      context: {
        transaction_id: context.transaction_id,
        bpp_id: context.bpp_id,
        bpp_uri: context.bpp_uri,
        domain: context.domain
      },
      message: {
        orders: [
          {
            provider: {
              id: order.provider.id
            },
            items: order.items,
            fulfillments: order.fulfillments,
            billing: order.billing,
            payments: [
              {
                id: order.payments?.[0]?.id,
                params: {
                  amount: `${cartPriceDetails[order.provider.id].totalPrice || order.quote?.price?.value}`,
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
  cartPriceDetails: any
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
            value: Number(cartPriceDetails[message.provider.id].totalPrice || message.quote.price.value) || 0
          }
        },
        payments: message.payments
      }
    },
    category: categoryId
  }))

  return { data: ordersPayload }
}

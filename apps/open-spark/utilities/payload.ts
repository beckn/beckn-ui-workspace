import { ConfirmResponseModel, InitResponseModel } from '@beckn-ui/common'

export const getPayloadForConfirm = (initResponse: InitResponseModel[], cartPriceDetails: any) => {
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
                  id: payments?.[0]?.id,
                  params: {
                    amount: `${cartPriceDetails.totalCartPrice || quote?.price?.value}`,
                    currency: quote?.price?.currency
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

export const getPayloadForOrderHistoryPost = (
  confirmData: ConfirmResponseModel[],
  categoryId: number,
  cartPriceDetails: any
) => {
  console.log(categoryId)
  const { bpp_id, bpp_uri, transaction_id } = confirmData[0].context
  const {
    orderId,
    provider: { id, name, short_desc },
    items,
    quote,
    payments,
    fulfillments
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
        fulfillments,
        quote: {
          price: {
            currency: quote.price.currency,
            value: Number(cartPriceDetails.totalCartPrice || quote.price.value) || 0
          }
        },
        payments
      }
    },
    category: categoryId
  }

  return ordersPayload
}

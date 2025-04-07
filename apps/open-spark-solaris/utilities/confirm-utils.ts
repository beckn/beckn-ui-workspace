import { ConfirmResponseModel, InitResponseModel } from '@beckn-ui/common'

export const getRentalPayloadForConfirm = (
  initResponse: InitResponseModel[],
  fromTimestamp: string,
  toTimestamp: string
) => {
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
              fulfillments: [
                {
                  id: '6',
                  type: 'RENTAL_START',
                  state: {
                    description: fromTimestamp,
                    descriptor: {
                      code: 'timestamp',
                      name: fromTimestamp
                    }
                  }
                },
                {
                  id: '7',
                  type: 'RENTAL_END',
                  state: {
                    description: toTimestamp,
                    descriptor: {
                      code: 'timestamp',
                      name: toTimestamp
                    }
                  }
                }
              ],
              billing: billing,
              payments: [
                {
                  id: payments?.[0]?.id,
                  params: {
                    amount: quote?.price?.value,
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
  console.log(payload)

  return payload
}

export const getRentalPayloadForOrderHistoryPost = (
  confirmData: ConfirmResponseModel[],
  categoryId: number,
  fromTimestamp: string,
  toTimestamp: string
) => {
  console.log(categoryId)
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
        fulfillments: [
          {
            id: '6',
            type: 'RENTAL_START',
            state: {
              description: fromTimestamp,
              descriptor: {
                code: 'timestamp',
                name: fromTimestamp
              }
            }
          },
          {
            id: '7',
            type: 'RENTAL_END',
            state: {
              description: toTimestamp,
              descriptor: {
                code: 'timestamp',
                name: toTimestamp
              }
            }
          }
        ],
        quote: { price: { currency: quote.price.currency, value: Number(quote.price.value) || 0 } },
        payments
      }
    },
    category: categoryId
  }

  return ordersPayload
}

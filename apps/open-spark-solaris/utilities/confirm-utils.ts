import { ConfirmResponseModel, InitResponseModel } from '@beckn-ui/common'

export const getRentalPayloadForConfirm = (
  initResponse: InitResponseModel[],
  fromTimestamp: string,
  toTimestamp: string,
  calculatedDuration: any,
  location?: any
) => {
  const payload = {
    data: initResponse.map(
      ({
        context: { transaction_id, bpp_id, bpp_uri, domain },
        message: {
          order: { billing, fulfillments, items, payments, provider, quote, type }
        }
      }) => ({
        context: {
          transaction_id: transaction_id,
          bpp_id: bpp_id,
          bpp_uri: bpp_uri,
          domain: domain,
          ...(location && location)
        },
        message: {
          orders: [
            {
              provider: {
                id: provider.id
              },
              items: (items as any).map((data: any) => {
                return {
                  ...data,
                  quantity: {
                    ...data.quantity,
                    selected: { count: calculatedDuration }
                  }
                }
              }),
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
                    amount: (
                      Number(quote?.breakup[0].price?.value || 0) * Number(calculatedDuration) +
                      Number(quote?.breakup[1].price?.value || 0) * Number(calculatedDuration)
                    ).toFixed(2),

                    currency: quote?.price?.currency
                  },
                  status: 'PAID',
                  type: 'ON-FULFILLMENT'
                }
              ]
            }
          ]
        }
      })
    )
  }
  console.log(payload)

  return payload
}

export const getRentalPayloadForOrderHistoryPost = (
  confirmData: ConfirmResponseModel[],
  categoryId: number,
  fromTimestamp: string,
  toTimestamp: string,
  calculatedDuration: any
) => {
  // console.log(categoryId)
  // const { bpp_id, bpp_uri, transaction_id } = confirmData[0].context
  // const {
  //   orderId,
  //   provider: { id, name, short_desc },
  //   items,
  //   quote,
  //   payments
  // } = confirmData[0].message

  // const amountValue = (Number(quote?.price?.value) * calculatedDuration).toFixed(2)
  const ordersPayload = confirmData.map(
    ({
      context: { bpp_id, bpp_uri, transaction_id },
      message: {
        orderId,
        provider: { id, name, short_desc },
        items,
        quote,
        payments
      }
    }) => ({
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
          items: (items as any).map((data: any) => {
            return {
              ...data,
              quantity: {
                ...data.quantity,
                selected: { count: calculatedDuration }
              }
            }
          }),
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
          quote: {
            price: {
              currency: quote.price.currency,
              value: quote?.breakup.map(item =>
                (Number(quote?.price?.value || 0) * Number(calculatedDuration)).toFixed(2)
              )
            }
          },
          payments
        }
      },
      category: categoryId
    })
  )

  return ordersPayload
}

import { ParsedItemModel } from '../types/search.types'
import { InitResponseModel } from '../types/init.types'

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

export const getPayloadForInitRequest = (selectData: ParsedItemModel, shippingDetails: any) => {
  const { providerId, bppId, bppUri, domain, transactionId, item } = selectData
  const { fulfillments } = item
  const { name, address, email, mobileNumber, pinCode } = shippingDetails

  const initPayload = {
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
              items: [item],
              fulfillments: fulfillments,
              billing: {
                name,
                address: address,
                state: {
                  name: 'Jurong East'
                },
                city: {
                  name: 'Jurong East'
                },
                email: email,
                phone: mobileNumber
              }
            }
          ]
        }
      }
    ]
  }

  return initPayload
}

export const getPaymentBreakDown = (initData: InitResponseModel[]) => {
  const quote = initData[0].message.order.quote
  const breakUp = quote.breakup
  const totalPricewithCurrent = `${quote.price.currency} ${quote.price.value}`

  const breakUpMap: Record<string, string> = {}

  breakUp.forEach(item => {
    const {
      title,
      price: { currency, value }
    } = item

    breakUpMap[title] = `${currency} ${value} `
  })

  return { breakUpMap, totalPricewithCurrent }
}

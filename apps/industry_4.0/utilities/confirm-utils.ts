import { ConfirmResponseModel } from '../types/confirm.types'
import { InitResponseModel } from '../types/init.types'
export const getPayloadForTrackRequest = (
  confirmOrderMetaDataPerBpp: any,
  transactionId: { transactionId: string }
) => {
  const payload: any = {
    trackRequestDto: []
  }

  Object.keys(confirmOrderMetaDataPerBpp).forEach(bppId => {
    const statusItem: any = {
      context: {
        transaction_id: transactionId.transactionId,
        bpp_id: bppId,
        bpp_uri: confirmOrderMetaDataPerBpp[bppId].bpp_uri,
        domain: 'retail'
      },

      message: {
        order_id: confirmOrderMetaDataPerBpp[bppId].id
      }
    }

    payload.trackRequestDto.push(statusItem)
  })

  return payload
}

export const getOrderPlacementTimeline = (timeStamp: string) => {
  const localDateAndTime = new Date(timeStamp)
  const localTime = localDateAndTime.toLocaleTimeString()
  const localDate = localDateAndTime.toDateString()
  const localDateWithoutDay = localDate.split(' ').slice(1).join(' ')

  return `${localDateWithoutDay}, ${localTime}`
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
              items: [items],
              fulfillments: fulfillments,
              billing: billing,
              payments: payments
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
    items
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
        items
      }
    },
    category: {
      set: [5]
    }
  }

  return ordersPayload
}

export function convertTimestampToDdMmYyyyHhMmPM(timestamp: string) {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  let hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const ampm = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour === 0) {
    hour = 12
  }

  const formattedTimestamp = `${day}/${month}/${year}, ${hour}:${minute} ${ampm}`

  return formattedTimestamp
}

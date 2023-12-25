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

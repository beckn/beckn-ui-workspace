import { InitResponseModel } from '../lib/types/init.types'
import { ResponseModel } from '../lib/types/responseModel'

export const getConfirmMetaDataForBpp = (initRes: ResponseModel[]) => {
  const itemsPerBpp = {}
  initRes.forEach(res => {
    const bppId = res.context.bpp_id
    const bpp_uri = res.context.bpp_uri

    itemsPerBpp[bppId] = {
      ...res.message.responses[0].message.order,
      bpp_uri
    }
  })

  return itemsPerBpp
}

export const getPayloadForConfirmRequest = (initResponse: InitResponseModel) => {
  let payload: any = {
    data: []
  }

  initResponse.data.forEach(response => {
    const { bpp_id, bpp_uri, transaction_id, domain } = response.context
    const { order } = response.message
    const { billing, fulfillments, items, provider, quote } = order
    const { price } = quote
    const { currency, value } = price

    const context = {
      transaction_id: transaction_id,
      bpp_id: bpp_id,
      bpp_uri: bpp_uri,
      domain: domain
    }

    const message = {
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
              collected_by: 'BPP',
              params: {
                amount: value,
                currency: currency,
                bank_account_number: '',
                bank_code: '',
                bank_account_name: ''
              },
              status: 'PAID',
              type: 'PRE-ORDER',
              transaction_id: transaction_id
            }
          ]
        }
      ]
    }

    payload.data.push({
      context,
      message
    })
  })

  return payload
}

export const getPayloadForStatusRequest = (
  confirmOrderMetaDataPerBpp: any,
  transactionId: { transactionId: string }
) => {
  const payload: any = {
    statusRequestDto: []
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

    payload.statusRequestDto.push(statusItem)
  })

  return payload
}

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

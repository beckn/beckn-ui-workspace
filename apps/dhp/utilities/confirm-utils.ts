import { ResponseModel } from '../lib/types/responseModel'

export const getInitMetaDataPerBpp = (initRes: ResponseModel[]) => {
  const itemsPerBpp = {}
  initRes.forEach(res => {
    const bppId = res.context.bpp_id
    const bpp_uri = res.context.bpp_uri

    itemsPerBpp[bppId] = {
      ...res.message.catalogs.responses[0].message.order,
      bpp_uri
    }
  })

  return itemsPerBpp
}

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

export const getPayloadForConfirmRequest = (
  initMetaDataPerBpp: any,
  transactionId: { transactionId: string },
  userId: string
) => {
  const payload: any = {
    confirmRequestDto: [],
    userId: userId
  }

  Object.keys(initMetaDataPerBpp).forEach(bppId => {
    const confirmItem: any = {
      context: {
        transaction_id: transactionId.transactionId,
        bpp_id: bppId,
        bpp_uri: initMetaDataPerBpp[bppId].bpp_uri,
        domain: 'retail'
      },

      message: {
        order: {
          provider: {
            id: initMetaDataPerBpp[bppId].provider.id
          },
          addOns: [],
          offers: [],
          billing: initMetaDataPerBpp[bppId].billing,
          fulfillment: {
            type: initMetaDataPerBpp[bppId].fulfillment.type,
            end: {
              location: {
                gps: initMetaDataPerBpp[bppId].fulfillment.end.location.gps,
                address: initMetaDataPerBpp[bppId].billing.address
              },
              contact: {
                phone: initMetaDataPerBpp[bppId].billing.phone,
                email: 'testemail1@mailinator.com'
              }
            },
            customer: {
              person: {
                name: initMetaDataPerBpp[bppId].billing.name
              }
            },
            id: initMetaDataPerBpp[bppId].fulfillment.id
          },
          payment: initMetaDataPerBpp[bppId].payment,
          items: []
        }
      }
    }

    initMetaDataPerBpp[bppId].items.forEach((item: any) => {
      const itemObject = {
        quantity: item.quantity,
        id: item.id
      }
      confirmItem.message.order.items.push(itemObject)
    })

    payload.confirmRequestDto.push(confirmItem)
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

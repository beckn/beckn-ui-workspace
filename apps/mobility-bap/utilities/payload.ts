import { RideDetailsModel } from '@store/discovery-slice'
import { SelectData, SelectItem, SelectOrder, SelectSingleData } from '@lib/types/beckn/select'
import { InitItem, InitOrder, InitSingleData } from '@lib/types/beckn/init'
import { Contact, InitResponseModel, ConfirmResponseModel } from '@beckn-ui/common'

export const getSelectPayload = (
  inputData: RideDetailsModel,
  transactionId: string,
  domain = 'mobility'
): { data: SelectData } => {
  const transaction_id = transactionId
  const bpp_id = inputData.provider.bppId
  const bpp_uri = inputData.provider.bppUri
  const pickup = inputData.pickup
  const dropoff = inputData.dropoff

  const item = inputData.provider

  const resultData: SelectSingleData[] = []

  const context = {
    transaction_id,
    bpp_id,
    bpp_uri,
    domain
  }

  const orders: SelectOrder[] = []

  const selectedItem: SelectItem = {
    id: item.cabDetails[0].id
  }

  orders.push({
    items: [selectedItem],
    provider: {
      id: item.providerId
    },
    fulfillments: [
      {
        type: 'start',
        stops: [
          {
            type: 'start',
            location: {
              gps: `${pickup.geoLocation.latitude},${pickup.geoLocation.longitude}`
            }
          },
          {
            type: 'end',
            location: {
              gps: `${dropoff.geoLocation.latitude},${dropoff.geoLocation.longitude}`
            }
          }
        ]
      }
    ]
  })

  resultData.push({
    context,
    message: { orders }
  })

  return { data: resultData }
}

export const getInitPayload = async (
  userDetails: Contact,
  itemData: RideDetailsModel,
  transactionId: string,
  domain: string = 'mobility:1.1.0'
) => {
  const transaction_id = transactionId
  const bpp_id = itemData.provider.bppId
  const bpp_uri = itemData.provider.bppUri
  const pickup = itemData.pickup
  const dropoff = itemData.dropoff

  const item = itemData.provider

  const resultData: InitSingleData[] = []

  const context = {
    transaction_id,
    bpp_id,
    bpp_uri,
    domain
  }

  const orders: InitOrder[] = []

  const selectedItem: InitItem = {
    id: item.cabDetails[0].id
  }

  orders.push({
    items: [selectedItem],
    provider: {
      id: item.providerId
    },
    fulfillments: [
      {
        type: 'start',
        stops: [
          {
            type: 'start',
            location: {
              gps: `${pickup.geoLocation.latitude},${pickup.geoLocation.longitude}`
            }
          },
          {
            type: 'end',
            location: {
              gps: `${dropoff.geoLocation.latitude},${dropoff.geoLocation.longitude}`
            }
          }
        ]
      }
    ],
    customer: {
      person: {
        name: userDetails.name
      },
      contact: userDetails
    },
    billing: userDetails
  })

  resultData.push({
    context,
    message: { orders }
  })

  return { data: resultData }
}

export const getConfirmPayload = (initResponse: InitResponseModel) => {
  const { context, message } = initResponse
  const {
    order: { items, provider, fulfillments, billing }
  } = message

  const resultData: InitSingleData[] = []
  const orders: InitOrder[] = []
  const userDetails = {
    name: billing.name,
    phone: billing.phone,
    email: billing.email
  }

  orders.push({
    items: items as any,
    provider: {
      id: provider.id
    },
    fulfillments: fulfillments as any,
    customer: {
      person: {
        name: billing.name
      },
      contact: userDetails
    },
    billing: userDetails
  })

  resultData.push({
    context,
    message: { orders }
  })

  return { data: resultData }
}

export const getCancelPayload = (
  confirmResponse: ConfirmResponseModel,
  cancel_reason: { id: string | number; reason: string }
) => {
  const { context, message } = confirmResponse
  const order_id = confirmResponse?.message?.orderId
  return {
    data: {
      context,
      message: {
        order_id,
        cancellation_reason_id: cancel_reason.id + '',
        descriptor: {
          short_desc: cancel_reason.reason
        }
      }
    }
  }
}

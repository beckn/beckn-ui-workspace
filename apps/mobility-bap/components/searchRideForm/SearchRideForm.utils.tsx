import { RideDetailsModel } from 'store/discovery-slice'
import { SelectData, SelectItem, SelectOrder, SelectSingleData } from './SearchRideForm.types'

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
        start: {
          location: {
            gps: `${pickup.geoLatLong.lat},${pickup.geoLatLong.long}`
          }
        },
        end: {
          location: {
            gps: `${dropoff.geoLatLong.lat},${dropoff.geoLatLong.long}`
          }
        }
      }
    ]
  })

  resultData.push({
    context,
    message: { orders }
  })

  return { data: resultData }
}

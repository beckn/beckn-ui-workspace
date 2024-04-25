import { StatusResponseModel } from '../lib/types/status.types'

export const getFeedbackPayload = (statusData: StatusResponseModel, ratingForStore: number) => {
  const { domain, bpp_id, bpp_uri, transaction_id } = statusData.data[0].context
  const orderId = statusData.data[0].message.order.id
  const ratingPayload = {
    data: [
      {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain
        },
        message: {
          ratings: [{ id: orderId, rating_category: 'Order', value: ratingForStore.toString() }]
        }
      }
    ]
  }

  return ratingPayload
}

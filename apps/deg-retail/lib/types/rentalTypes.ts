export interface DateInfo {
  day: string
  date: string
  fullDate: string
}

export interface TimeSlot {
  time: string
  disabled: boolean
}

export interface CartItem {
  id: string
  bpp_id: string
  bpp_uri: string
  providerId: string
  fulfillments: Array<{
    id: string
  }>
}

export interface ApiPayload {
  data: Array<{
    context: {
      transaction_id: string
      bpp_id: string
      bpp_uri: string
      domain: string
    }
    message: {
      orders: Array<{
        items: Array<{
          id: string
          fulfillment_ids: string[]
        }>
        provider: {
          id: string
        }
        fulfillments: Array<{
          id: string
          type: string
          state: {
            code: string
            name: string
          }
        }>
      }>
    }
  }>
}

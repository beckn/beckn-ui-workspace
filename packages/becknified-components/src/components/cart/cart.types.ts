export interface RetailItem {
  extended_attributes?: any
  price: {
    listed_value?: string
    currency?: string
    value: string
  }
  matched?: boolean
  id: string
  descriptor: {
    images: string[]
    name: string
    short_desc: string
    long_desc: string
  }
  location_id?: string
  recommended?: boolean
  tags: {
    fulfillment_start_loc?: string
    Category?: string
    Trekking?: string
    Himalayas?: string
    fulfillment_end_time?: string
    Country?: string
    Ladakh?: string
    Treks?: string
    Package?: string
    Leh?: string
    fulfillment_end_loc?: string
    authorName: string
    rating: string
    foodType?: string
  }
}

export interface CartRetailItem extends RetailItem {
  quantity: number
  totalPrice: number
}

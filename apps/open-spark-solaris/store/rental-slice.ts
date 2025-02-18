import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Price {
  value: string
  currency: string
}

export interface BreakupItem {
  title: string
  price: Price
}

export interface Quote {
  price: Price
  breakup: BreakupItem[]
}

export interface FulfillmentState {
  description: string
  descriptor: {
    code: string
    name: string
  }
}

export interface Fulfillment {
  id: string
  type: string
  state: FulfillmentState
}

export interface Image {
  url: string
  size_type: string
}

export interface Provider {
  id: string
  name: string
  short_desc: string
  long_desc: string
  rating: string
  images: Image
  fulfillments: Fulfillment[]
}

export interface QuantityMeasure {
  value: string
  unit: string
}

export interface AvailableQuantity {
  count: number
  measure: QuantityMeasure
}

export interface Item {
  id: string
  code: string
  name: string
  short_desc: string
  long_desc: string
  images: Image[]
  price: Price
  rating: string
  rateable: boolean
  quantity: {
    available: AvailableQuantity
  }
  fulfillments: Fulfillment[]
}

export interface Order {
  quote: Quote
  provider: Provider
  items: Item[]
  fulfillments: Fulfillment[]
}

export interface RentalState {
  orderData: Order | null
  loading: boolean
  error: string | null
}

const initialState: RentalState = {
  orderData: null,
  loading: false,
  error: null
}

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<Order>) => {
      state.orderData = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearOrderData: state => {
      state.orderData = null
    }
  }
})

export const { setOrderData, setLoading, setError, clearOrderData } = rentalSlice.actions

export default rentalSlice.reducer

export interface ChargingDetails {
  consumedUnit: string
  bookingTime: string
  totalCost: number
  stationId: string
  stationName: string
  chargerId: string
  chargerName: string
  power: string
  portType: string
  status: 'Completed' | 'In Progress'
}

export interface PaymentDetails {
  method: string
  transactionId: string
  totalCost: number
  status: 'Paid' | 'Pending'
}

export interface LocationDetails {
  address: string
  latitude: number
  longitude: number
}

export interface OrderDetails {
  chargingDetails: ChargingDetails
  paymentDetails: PaymentDetails
  locationDetails: LocationDetails
}

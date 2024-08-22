import { PickUpDropOffModel } from '@beckn-ui/common'

export const DOMAIN = 'mobility:1.1.0'

export const currencyMap = {
  EUR: '€',
  INR: '₹',
  USD: '$',
  GMD: 'D'
}

export const defaultSourceLocation: {
  smartCity: PickUpDropOffModel
  gambia: PickUpDropOffModel
  paris: PickUpDropOffModel
} = {
  smartCity: {
    address: 'conrad hotel, bengaluru',
    geoLocation: { latitude: 12.975534959637004, longitude: 77.62044655217746 }
  },
  gambia: {
    address: 'Serekunda Market',
    geoLocation: { latitude: 13.439226893152561, longitude: -16.68207924411194 }
  },
  paris: {
    address: '',
    geoLocation: { latitude: 0, longitude: 0 }
  }
}

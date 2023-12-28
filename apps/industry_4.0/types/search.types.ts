import { Coordinate } from '@utils/homePage.utils'

interface Location {
  id: string
  city: {
    code: string
    name: string
  }
  gps: string
}

interface Price {
  value: string
  currency: string
}

interface Tag {
  code: string
  name: string
  display: boolean
  list?: Array<{
    name: string
    value: string
  }>
}

interface Fulfillment {
  id: string
  type: string
  tracking: boolean
  tags: Tag[]
}

interface Image {
  url: string
  size_type: string
}

interface Item {
  long_desc: string
  short_desc: string
  id: string
  name: string
  price: Price
  locations: Location[]
  fulfillments: Fulfillment[]
  images: Image[]
  tags: Tag[]
}

interface LocationProvider {
  id: string
  name: string
  rating: string
  locations: Location[]
  items: Item[]
  images: Image[]
}

interface Message {
  name: string
  providers: LocationProvider[]
}

interface Context {
  domain: string
  action: string
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: {
    country: {
      code: string
    }
  }
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

export interface SearchResponseModel {
  context: Context
  message: Message
}

export interface ParsedItemModel {
  bppId: string
  bppUri: string
  domain: string
  transactionId: string
  providerId: string
  providerName: string
  item: Item
  rating: string
  providerCoordinates: Coordinate
}

export interface AssemblyData {
  type: string
  colour: string
  shape: string
  length: string
  width: string
  quantity?: number
  weight: string
}

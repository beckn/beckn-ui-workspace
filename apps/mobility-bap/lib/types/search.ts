import { CurrencyType } from '@beckn-ui/becknified-components'

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
  currency: CurrencyType
}

interface Tag {
  code: string
  name: string
  display: boolean
  list: Array<{
    code: string
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
  rating: string
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

export interface SearchBarPropsModel {
  searchString: string | string[] | undefined
  handleChange: Function
}

export interface SearchResponseModel {
  context: Context
  message: Message
}

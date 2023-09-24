export interface SearchResultsProps {
  apiUrl: string
  searchPayload: any
  onSuccess: (res: SearchResponse) => void
  onFailure: Function
}

export interface CatalogContext {
  ttl: string
  action: string
  timestamp: string
  message_id: string
  transaction_id: string
  domain: string
  core_version: string
  bap_id: string
  bap_uri: string
  country: string
  city: string
  max_callbacks: number
}

export interface Location {
  id: string
  gps: string
}

export interface Price {
  listed_value: string
  currency: string
  value: string
}

export interface Descriptor {
  name: string
  images: string[]
  short_desc?: string
  long_desc?: string
}

export interface Tags {
  [key: string]: string
}

export interface Item {
  extended_attributes: Record<string, any>
  price: Price
  matched: boolean
  id: string
  descriptor: Descriptor
  location_id: string
  recommended: boolean
  tags: Tags
}

export interface ParsedItem extends Item {
  bpp_id: string
  bpp_uri: string
  providerId: string
  locations: Location[]
  bppName: string
}

export interface Provider {
  extended_attributes: Record<string, any>
  locations: Location[]
  matched: boolean
  id: string
  descriptor: Descriptor
  items: Item[]
}

export interface BppDescriptor {
  name: string
}

export interface Catalog {
  context: CatalogContext
  message: {
    catalog: {
      ['bpp/providers']: Provider[]
      ['bpp/descriptor']: BppDescriptor
      id: string
    }
  }
}

export interface SearchResponse {
  context: CatalogContext
  message: {
    catalogs: Catalog[]
  }
}

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

export interface SearchResultsProps {
  productList: ParsedItem[]
  productClickHandler?: React.MouseEventHandler<HTMLDivElement>
  CustomInfoComponentForProductCard?: React.ComponentType<{ product: ParsedItem }>
}

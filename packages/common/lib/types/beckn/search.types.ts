import { Location, Price, Tag, Provider, Context, Item, Coordinate } from '../common'

interface LocationProvider {
  id: string
  name: string
  rating: string
  locations: Location[]
  items: Item[]
  long_desc?: string
  short_desc?: string
  price?: Price
  images: {
    url: string
    size_type: string
  }[]
}
export interface providerImages {
  url?: string
}

export interface Message {
  name: string
  providers: LocationProvider[]
  images?: providerImages[]
}

export interface SearchResponseModel {
  context: Context
  message: Message
}

export interface ParsedItemModel {
  id: string
  bppId: string
  bppUri: string
  domain?: string
  transactionId: string
  providerId: string
  providerName: string
  providerImg?: Message[]
  item: Item
  rating?: string
  providerCoordinates: Coordinate
  Message?: Message
  domainCategory?: string
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

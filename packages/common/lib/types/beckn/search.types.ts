import { Location, Price, Tag, Provider, Context, Item, Coordinate } from '../common'

interface LocationProvider {
  id: string
  name: string
  rating: string
  locations: Location[]
  items: Item[]
  images: {
    url: string
    size_type: string
  }[]
}

interface Message {
  name: string
  providers: LocationProvider[]
}

export interface SearchResponseModel {
  context: Context
  message: Message
}

export interface ParsedItemModel {
  id: string
  bppId: string
  bppUri: string
  domain: string
  transactionId: string
  providerId: string
  providerName: string
  item: Item
  rating?: string
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

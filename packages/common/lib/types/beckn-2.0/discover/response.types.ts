import { BecknContext } from '../context.types'

export interface DiscoverDescriptor {
  '@type': string
  name: string
  shortDesc: string
  longDesc: string
  image: string[]
}

export interface DiscoverCategory {
  '@type': string
  codeValue: string
  name: string
  description: string
}

export type DiscoverItemCategory = DiscoverCategory

export type DiscoverCatalogDescriptor = DiscoverDescriptor

export interface DiscoverCatalogValidity {
  '@type': string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

export interface DiscoverItem {
  '@context': string
  '@type': string
  id: string
  descriptor: DiscoverDescriptor
  category?: DiscoverItemCategory
  availableAt?: DiscoverAvailableAt[]
  availabilityWindow?: DiscoverAvailabilityWindow[]
  rateable?: boolean
  rating?: DiscoverRating
  isActive?: boolean
  networkId?: string[]
  provider: DiscoverProvider
  itemAttributes: Record<string, unknown>
}

export interface DiscoverAvailableAtGeo {
  type: string
  coordinates?: unknown[]
  geometries?: unknown[]
  bbox?: unknown[]
}

export interface DiscoverAvailableAt {
  '@type': string
  geo: DiscoverAvailableAtGeo
  address?: string | Record<string, unknown>
}

export type DiscoverAvailabilityWindow = DiscoverCatalogValidity

export interface DiscoverRating {
  '@type': string
  ratingValue: number
  ratingCount: number
}

export interface DiscoverProvider {
  id: string
  descriptor: DiscoverDescriptor
  validity?: DiscoverCatalogValidity
  locations?: DiscoverAvailableAt[]
  rateable?: boolean
  rating?: DiscoverRating
  providerAttributes?: Record<string, unknown>
}

export interface DiscoverCatalogItem {
  '@context': string
  '@type': string
  id: string
  descriptor: DiscoverCatalogDescriptor
  providerId: string
  bppId: string
  bppUri: string
  validity?: DiscoverCatalogValidity
  isActive?: boolean
  items: DiscoverItem[]
  offers?: Array<Record<string, unknown>>
}

export interface DiscoverResponseMessage {
  catalogs: DiscoverCatalogItem[]
}

export interface DiscoverResponse {
  context: BecknContext
  message: DiscoverResponseMessage
}

/** Catalog shape as stored in Redux (allows both strict and flexible API responses) */
export type DiscoverCatalogStored = DiscoverCatalogItem & Record<string, unknown>

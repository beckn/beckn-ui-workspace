import { BecknContext } from '../context.types'

export interface DiscoverDescriptor {
  '@type': string
  'schema:name': string
  'beckn:shortDesc': string
  'beckn:longDesc': string
  'schema:image': string[]
}

export interface DiscoverCategory {
  '@type': string
  'schema:codeValue': string
  'schema:name': string
  'schema:description': string
}

export type DiscoverItemCategory = DiscoverCategory

export type DiscoverCatalogDescriptor = DiscoverDescriptor

export interface DiscoverCatalogValidity {
  '@type': string
  'schema:startDate': string
  'schema:endDate': string
  'schema:startTime': string
  'schema:endTime': string
}

export interface DiscoverItem {
  '@context': string
  '@type': string
  'beckn:id': string
  'beckn:descriptor': DiscoverDescriptor
  'beckn:category'?: DiscoverItemCategory
  'beckn:availableAt'?: DiscoverAvailableAt[]
  'beckn:availabilityWindow'?: DiscoverAvailabilityWindow[]
  'beckn:rateable'?: boolean
  'beckn:rating'?: DiscoverRating
  'beckn:isActive'?: boolean
  'beckn:networkId'?: string[]
  'beckn:provider': DiscoverProvider
  'beckn:itemAttributes': Record<string, unknown>
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
  'beckn:ratingValue': number
  'beckn:ratingCount': number
}

export interface DiscoverProvider {
  'beckn:id': string
  'beckn:descriptor': DiscoverDescriptor
  'beckn:validity'?: DiscoverCatalogValidity
  'beckn:locations'?: DiscoverAvailableAt[]
  'beckn:rateable'?: boolean
  'beckn:rating'?: DiscoverRating
  'beckn:providerAttributes'?: Record<string, unknown>
}

export interface DiscoverCatalogItem {
  '@context': string
  '@type': string
  'beckn:id': string
  'beckn:descriptor': DiscoverCatalogDescriptor
  'beckn:providerId': string
  'beckn:bppId': string
  'beckn:bppUri': string
  'beckn:validity'?: DiscoverCatalogValidity
  'beckn:isActive'?: boolean
  'beckn:items': DiscoverItem[]
  'beckn:offers'?: Array<Record<string, unknown>>
}

export interface DiscoverResponseMessage {
  catalogs: DiscoverCatalogItem[]
}

export interface DiscoverResponse {
  context: BecknContext
  message: DiscoverResponseMessage
}

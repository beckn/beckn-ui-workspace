import { BecknRequest } from '../context.types'

export interface DiscoverFilters {
  type: string
  expression: string
}

export interface DiscoverSpatial {
  op: string
  targets: string | string[]
  geometry: {
    type: string
    coordinates: number[]
  }
  distanceMeters?: number
  quantifier?: string
  srid?: string
}

export interface DiscoverMessage {
  text_search?: string
  filters?: DiscoverFilters
  spatial?: DiscoverSpatial[]
  media_search?: Record<string, unknown>
}

export type DiscoverRequest = BecknRequest<DiscoverMessage>

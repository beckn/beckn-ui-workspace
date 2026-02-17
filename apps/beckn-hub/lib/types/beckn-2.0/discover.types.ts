/**
 * Beckn 2.0 discover request/response types.
 * Independent; no imports from other Beckn APIs.
 */
import type { BecknRequest } from './context.types'

export interface DiscoverFilters {
  type: string
  expression: string
}

export interface DiscoverSpatial {
  op: string
  targets: string | string[]
  geometry: { type: string; coordinates: number[] }
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

export interface DiscoverResponse {
  context: Record<string, unknown>
  message: {
    catalogs?: Array<{
      id?: string
      descriptor?: Record<string, unknown>
      providerId?: string
      bppId?: string
      bppUri?: string
      validity?: Record<string, unknown>
      items?: unknown
      offers?: unknown[]
      [key: string]: unknown
    }>
    [key: string]: unknown
  }
}

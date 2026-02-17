/**
 * Discover API payload builder (Beckn 2.0).
 * Independent: only builds discover request; no dependency on select/init/confirm.
 */
import type { DiscoverRequest, DiscoverMessage } from '@lib/types/beckn-2.0/discover.types'
import type { BecknContext } from '@lib/types/beckn-2.0/context.types'

const DEFAULT_VERSION = '2.0.0'

export interface BuildDiscoverPayloadInput {
  /** BAP id (your app id) */
  bapId: string
  /** BAP uri (your app base URL) */
  bapUri: string
  /** Transaction id (unique per session) */
  transactionId: string
  /** Domain, e.g. beckn.one:deg:ev-charging:* */
  domain: string
  /** Optional: text search */
  textSearch?: string
  /** Optional: filters */
  filters?: { type: string; expression: string }[]
  /** Optional: spatial (location) criteria */
  spatial?: Array<{
    op: string
    targets: string | string[]
    geometry: { type: string; coordinates: number[] }
    distanceMeters?: number
  }>
  /** Optional: previous context to copy (e.g. for message_id continuity) */
  previousContext?: Record<string, unknown> | null
}

export function buildDiscoverPayload(input: BuildDiscoverPayloadInput): DiscoverRequest {
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const context: BecknContext = {
    domain: input.domain,
    version: DEFAULT_VERSION,
    bap_id: input.bapId,
    bap_uri: input.bapUri,
    transaction_id: input.transactionId,
    message_id: messageId,
    timestamp: new Date().toISOString(),
    action: 'discover',
    ...(input.previousContext && typeof input.previousContext === 'object'
      ? {
          bpp_id: (input.previousContext.bpp_id as string) ?? undefined,
          bpp_uri: (input.previousContext.bpp_uri as string) ?? undefined,
          location: input.previousContext.location as BecknContext['location']
        }
      : {})
  }

  const message: DiscoverMessage = {}
  if (input.textSearch) message.text_search = input.textSearch
  if (input.filters?.length) message.filters = input.filters
  if (input.spatial?.length) message.spatial = input.spatial

  return { context, message }
}

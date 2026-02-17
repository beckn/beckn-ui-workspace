/**
 * Select API payload builder (Beckn 2.0).
 * Independent: only builds select request from inputs; uses previous context for bpp_id/bpp_uri.
 */
import type { SelectRequest } from '@lib/types/beckn-2.0/select.types'
import type { Order, OrderItem } from '@lib/types/beckn-2.0/common.types'
import type { BecknContext } from '@lib/types/beckn-2.0/context.types'

const DEFAULT_VERSION = '2.0.0'
const DEFAULT_BPP_ID = 'ev-charging.sandbox1.com'
const DEFAULT_BPP_URI = 'http://onix-adapter:8081/bpp/receiver'

export interface BuildSelectPayloadInput {
  /** Previous API response context (e.g. discover response context). Required for chaining. */
  previousContext: Record<string, unknown>
  /** Order items to select */
  items: Array<{ id: string; quantity: number; providerId?: string; orderItemAttributes?: Record<string, unknown> }>
  /** BAP id */
  bapId: string
  /** BAP uri */
  bapUri: string
  /** Transaction id (same as in discover) */
  transactionId: string
  /** Domain */
  domain: string
  /** Optional buyer info */
  buyer?: { id?: string; displayName?: string; telephone?: string; email?: string }
}

export function buildSelectPayload(input: BuildSelectPayloadInput): SelectRequest {
  const ctx = input.previousContext
  const bppId = ctx.bpp_id != null && ctx.bpp_id !== '' ? String(ctx.bpp_id) : DEFAULT_BPP_ID
  const bppUri = ctx.bpp_uri != null && ctx.bpp_uri !== '' ? String(ctx.bpp_uri) : DEFAULT_BPP_URI

  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const context: BecknContext = {
    ...ctx,
    domain: input.domain,
    version: DEFAULT_VERSION,
    bap_id: input.bapId,
    bap_uri: input.bapUri,
    bpp_id: bppId,
    bpp_uri: bppUri,
    transaction_id: input.transactionId,
    message_id: messageId,
    timestamp: new Date().toISOString(),
    action: 'select'
  }

  const orderItems: OrderItem[] = input.items.map((item, idx) => ({
    lineId: String(idx + 1),
    orderedItem: item.id,
    quantity: { unitCode: 'KWH', unitQuantity: item.quantity },
    orderItemAttributes: item.orderItemAttributes ?? {}
  }))

  const order: Order = {
    items: orderItems,
    orderItems,
    provider: input.items[0]?.providerId ? { id: input.items[0].providerId } : undefined
  }

  return { context, message: { order } }
}

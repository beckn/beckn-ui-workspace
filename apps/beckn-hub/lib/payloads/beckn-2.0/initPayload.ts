/**
 * Init API payload builder (Beckn 2.0).
 * Independent: only builds init request from select response + fulfillment/customer info.
 */
import type { InitRequest } from '@lib/types/beckn-2.0/init.types'
import type { Order } from '@lib/types/beckn-2.0/common.types'
import type { BecknContext } from '@lib/types/beckn-2.0/context.types'

const DEFAULT_VERSION = '2.0.0'
const DEFAULT_BPP_ID = 'ev-charging.sandbox1.com'
const DEFAULT_BPP_URI = 'http://onix-adapter:8081/bpp/receiver'

export interface BuildInitPayloadInput {
  /** Select API response (context + message.order) */
  selectResponse: { context: Record<string, unknown>; message: { order: Order } }
  /** Customer/fulfillment details */
  customer: { name?: string; phone?: string; email?: string; address?: string }
  /** Quantity (e.g. KWH) */
  quantity: string
  /** Fulfillment id from select order */
  fulfillmentId?: string
  /** Fulfillment type */
  fulfillmentType?: string
}

function ensureBppInContext(ctx: Record<string, unknown>): void {
  if (ctx.bpp_id == null || ctx.bpp_id === '') ctx.bpp_id = DEFAULT_BPP_ID
  if (ctx.bpp_uri == null || ctx.bpp_uri === '') ctx.bpp_uri = DEFAULT_BPP_URI
}

export function buildInitPayload(input: BuildInitPayloadInput): InitRequest {
  const prevCtx = input.selectResponse.context
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const context: BecknContext = {
    ...prevCtx,
    message_id: messageId,
    timestamp: new Date().toISOString(),
    action: 'init',
    version: DEFAULT_VERSION
  }
  ensureBppInContext(context as unknown as Record<string, unknown>)

  const order = { ...input.selectResponse.message.order } as Order
  const fulfillment = order.fulfillment ?? order.fulfillments?.[0] ?? {}
  if (input.fulfillmentId) (fulfillment as Record<string, unknown>).id = input.fulfillmentId
  if (input.fulfillmentType) (fulfillment as Record<string, unknown>).type = input.fulfillmentType
  ;(fulfillment as Record<string, unknown>).agent = {
    name: input.customer.name,
    phone: input.customer.phone,
    email: input.customer.email,
    address: input.customer.address
  }
  order.fulfillment = fulfillment
  if (order.fulfillments?.length) order.fulfillments[0] = fulfillment

  return { context, message: { order } }
}

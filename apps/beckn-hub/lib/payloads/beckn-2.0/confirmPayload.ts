/**
 * Confirm API payload builder (Beckn 2.0).
 * Independent: only builds confirm request from init response.
 */
import type { ConfirmRequest } from '@lib/types/beckn-2.0/confirm.types'
import type { Order } from '@lib/types/beckn-2.0/common.types'
import type { BecknContext } from '@lib/types/beckn-2.0/context.types'

const DEFAULT_VERSION = '2.0.0'
const DEFAULT_BPP_ID = 'ev-charging.sandbox1.com'
const DEFAULT_BPP_URI = 'http://onix-adapter:8081/bpp/receiver'

export interface BuildConfirmPayloadInput {
  /** Init API response (context + message.order) */
  initResponse: { context: Record<string, unknown>; message: { order: Order } }
}

function ensureBppInContext(ctx: Record<string, unknown>): void {
  if (ctx.bpp_id == null || ctx.bpp_id === '') ctx.bpp_id = DEFAULT_BPP_ID
  if (ctx.bpp_uri == null || ctx.bpp_uri === '') ctx.bpp_uri = DEFAULT_BPP_URI
}

export function buildConfirmPayload(input: BuildConfirmPayloadInput): ConfirmRequest {
  const prevCtx = input.initResponse.context
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const context: BecknContext = {
    ...prevCtx,
    message_id: messageId,
    timestamp: new Date().toISOString(),
    action: 'confirm',
    version: DEFAULT_VERSION
  }
  ensureBppInContext(context as unknown as Record<string, unknown>)

  const order = { ...input.initResponse.message.order }
  return { context, message: { order } }
}

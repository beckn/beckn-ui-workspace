/**
 * Beckn 2.0 select request/response types.
 * Independent; no imports from other Beckn APIs.
 */
import type { BecknRequest } from './context.types'
import type { Order } from './common.types'

export interface SelectMessage {
  order: Order
}

export type SelectRequest = BecknRequest<SelectMessage>

export interface SelectResponse {
  context: Record<string, unknown>
  message: { order: Order; [key: string]: unknown }
}

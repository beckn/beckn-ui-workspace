/**
 * Beckn 2.0 confirm request/response types.
 * Independent; no imports from other Beckn APIs.
 */
import type { BecknRequest } from './context.types'
import type { Order } from './common.types'

export interface ConfirmMessage {
  order: Order
}

export type ConfirmRequest = BecknRequest<ConfirmMessage>

export interface ConfirmResponse {
  context: Record<string, unknown>
  message: { order: Order; [key: string]: unknown }
}

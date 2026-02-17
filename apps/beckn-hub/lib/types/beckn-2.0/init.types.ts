/**
 * Beckn 2.0 init request/response types.
 * Independent; no imports from other Beckn APIs.
 */
import type { BecknRequest } from './context.types'
import type { Order } from './common.types'

export interface InitMessage {
  order: Order
}

export type InitRequest = BecknRequest<InitMessage>

export interface InitResponse {
  context: Record<string, unknown>
  message: { order: Order; [key: string]: unknown }
}

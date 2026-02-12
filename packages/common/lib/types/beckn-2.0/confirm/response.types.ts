import { BecknContext } from '../context.types'
import type { Order } from '../common.types'

export interface ConfirmResponseMessage {
  order: Order
}

export interface ConfirmResponse {
  context: BecknContext
  message: ConfirmResponseMessage
}

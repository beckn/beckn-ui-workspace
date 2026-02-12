import { BecknContext } from '../context.types'
import type { Order } from '../common.types'

export interface SelectResponseMessage {
  order: Order
}

export interface SelectResponse {
  context: BecknContext
  message: SelectResponseMessage
}

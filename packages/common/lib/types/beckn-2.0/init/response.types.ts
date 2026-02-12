import { BecknContext } from '../context.types'
import type { Order } from '../common.types'

export interface InitResponseMessage {
  order: Order
}

export interface InitResponse {
  context: BecknContext
  message: InitResponseMessage
}

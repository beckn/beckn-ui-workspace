import { BecknRequest } from '../context.types'
import type { Order } from '../common.types'

export interface SelectMessage {
  order: Order
}

export type SelectRequest = BecknRequest<SelectMessage>

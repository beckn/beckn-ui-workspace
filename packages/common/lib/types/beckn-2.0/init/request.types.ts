import { BecknRequest } from '../context.types'
import type { Order } from '../common.types'

export interface InitMessage {
  order: Order
}

export type InitRequest = BecknRequest<InitMessage>

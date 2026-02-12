import { BecknRequest } from '../context.types'
import type { Order } from '../common.types'

export interface ConfirmMessage {
  order: Order
}

export type ConfirmRequest = BecknRequest<ConfirmMessage>

import type { ConfirmRequest } from '../../lib/types/beckn-2.0/confirm'
import type { BecknContext } from '../../lib/types/beckn-2.0/context.types'
import type { Order, Payment } from '../../lib/types/beckn-2.0/common.types'
import type { BuildConfirmRequestOptions } from './types'

/**
 * Build Beckn 2.0 Confirm request from init response.
 * Generic: pass init response and optional schema context / payment methods.
 */
export function buildConfirmRequest20(
  initResponse: { context: BecknContext; message: { order: Order } },
  opts: BuildConfirmRequestOptions
): ConfirmRequest {
  const { context, message } = initResponse
  const order = message.order

  const payment: Payment = {
    '@context': opts.schemaContext,
    '@type': 'Payment',
    'beckn:paymentStatus': 'PAID',
    'beckn:acceptedPaymentMethod': opts.acceptedPaymentMethods ?? ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET'],
    'beckn:amount': {
      currency: order['beckn:orderValue']?.currency ?? 'INR',
      value: order['beckn:orderValue']?.value ?? 0
    }
  }

  const confirmOrder: Order = {
    ...order,
    'beckn:payment': payment
  }

  return {
    context: {
      ...context,
      action: 'confirm',
      message_id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString()
    },
    message: { order: confirmOrder }
  }
}

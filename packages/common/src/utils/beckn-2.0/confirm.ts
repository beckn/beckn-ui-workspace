import type { ConfirmRequest } from '../../lib/types/beckn-2.0/confirm'
import type { BecknContext } from '../../lib/types/beckn-2.0/context.types'
import type { Order, Payment } from '../../lib/types/beckn-2.0/common.types'
import type { BuildConfirmRequestOptions } from './types'

/**
 * Build Beckn 2.0 Confirm request from init response.
 * Generic: pass init response and optional schema context / payment methods.
 */
/** Extract accepted payment methods from init response order (payment block or opts fallback) */
function getAcceptedPaymentMethods(
  order: Order,
  optsFallback: BuildConfirmRequestOptions['acceptedPaymentMethods']
): string[] {
  const orderAny = order as Record<string, unknown>
  const payment = orderAny['beckn:payment'] as Record<string, unknown> | undefined
  const fromPayment =
    (payment?.['beckn:acceptedPaymentMethods'] as string[] | undefined) ??
    (payment?.['beckn:acceptedPaymentMethod'] as string[] | undefined)
  if (Array.isArray(fromPayment) && fromPayment.length > 0) return fromPayment
  const fromFirstItem = order['beckn:orderItems']?.[0]?.['beckn:acceptedOffer'] as Record<string, unknown> | undefined
  const fromOffer = fromFirstItem?.['beckn:acceptedPaymentMethod'] as string[] | undefined
  if (Array.isArray(fromOffer) && fromOffer.length > 0) return fromOffer
  return optsFallback ?? ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET']
}

export function buildConfirmRequest20(
  initResponse: { context: BecknContext; message: { order: Order } },
  opts: BuildConfirmRequestOptions
): ConfirmRequest {
  const { context, message } = initResponse
  const order = message.order
  const paymentContext = opts.paymentContext ?? opts.schemaContext
  const methods = getAcceptedPaymentMethods(order, opts.acceptedPaymentMethods)

  const payment: Payment & { 'beckn:acceptedPaymentMethods'?: string[] } = {
    '@context': paymentContext,
    '@type': 'beckn:Payment',
    'beckn:paymentStatus': opts.paymentStatus ?? 'INITIATED',
    'beckn:acceptedPaymentMethods': methods,
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

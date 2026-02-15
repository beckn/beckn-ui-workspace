import type { InitRequest } from '../../lib/types/beckn-2.0/init'
import type { BecknContext } from '../../lib/types/beckn-2.0/context.types'
import type { Order, Fulfillment } from '../../lib/types/beckn-2.0/common.types'
import type { BuildInitRequestOptions } from './types'

/**
 * Build Beckn 2.0 Init request from select response and fulfillment options.
 * Generic: pass select response (context + message.order) and customer/fulfillment options.
 */
export function buildInitRequest20(
  selectResponse: { context: BecknContext; message: { order: Order } },
  opts: BuildInitRequestOptions
): InitRequest {
  const { context, message } = selectResponse
  const order = { ...message.order }

  const fulfillment: Fulfillment = {
    '@context': opts.schemaContext,
    '@type': 'Fulfillment',
    'beckn:id': opts.fulfillmentId ?? order['beckn:fulfillment']?.['beckn:id'] ?? 'f1',
    'beckn:mode': opts.fulfillmentMode ?? 'DELIVERY',
    'beckn:deliveryAttributes': {
      customer: {
        person: { name: opts.customer.name },
        contact: {
          phone: opts.customer.phone ?? '',
          email: opts.customer.email ?? ''
        }
      },
      address: opts.customer.address
    }
  }

  const initOrder: Order = {
    ...order,
    'beckn:fulfillment': fulfillment
  }

  return {
    context: {
      ...context,
      action: 'init',
      message_id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString()
    },
    message: { order: initOrder }
  }
}

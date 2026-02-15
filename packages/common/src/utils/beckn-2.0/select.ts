import type { SelectRequest } from '../../lib/types/beckn-2.0/select'
import type { Order, OrderItem, Buyer } from '../../lib/types/beckn-2.0/common.types'
import { buildContext } from './context'
import type { BuildSelectRequestOptions } from './types'

/**
 * Build Beckn 2.0 Select request.
 * Generic: pass items with id, quantity, providerId, optional orderItemAttributes and schemaContext.
 */
export function buildSelectRequest20(opts: BuildSelectRequestOptions): SelectRequest {
  const { items, transactionId, bppId, bppUri, domain, schemaContext, orderStatus = 'CONFIRMED' } = opts
  if (!items.length) throw new Error('At least one item is required for Select')

  const providerId = items[0].providerId

  const buyer: Buyer = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'beckn:id': opts.buyer?.id ?? 'user-1',
    'beckn:displayName': opts.buyer?.displayName ?? 'User',
    'beckn:telephone': opts.buyer?.telephone ?? '',
    'beckn:email': opts.buyer?.email ?? ''
  }

  const orderItems: OrderItem[] = items.map(item => {
    const orderItem: OrderItem = {
      'beckn:orderedItem': item.id,
      'beckn:quantity': {
        unitQuantity: Number(item.quantity) || 1,
        unitCode: item.unitCode ?? 'C62'
      }
    }
    if (item.orderItemAttributes && Object.keys(item.orderItemAttributes).length > 0) {
      orderItem['beckn:orderItemAttributes'] = {
        '@context': schemaContext,
        '@type': 'OrderItemAttributes',
        ...item.orderItemAttributes
      }
    }
    return orderItem
  })

  const order: Order = {
    '@context': schemaContext,
    '@type': 'Order',
    'beckn:orderStatus': orderStatus,
    'beckn:seller': providerId,
    'beckn:buyer': buyer,
    'beckn:orderItems': orderItems
  }

  return {
    context: buildContext({
      transactionId,
      bppId,
      bppUri,
      action: 'select',
      domain,
      location: opts.location,
      schemaContext: [schemaContext]
    }),
    message: { order }
  }
}

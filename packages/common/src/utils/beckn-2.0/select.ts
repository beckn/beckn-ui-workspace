import type { SelectRequest } from '../../lib/types/beckn-2.0/select'
import type { Order, OrderItem, Buyer } from '../../lib/types/beckn-2.0/common.types'
import { buildContext } from './context'
import type { BuildSelectRequestOptions } from './types'

/**
 * Build Beckn 2.0 Select request.
 * Generic: uses only data passed from app level (domain, orderStatus, buyer, orderContext, orderType, buyerContext, buyerType, buyerRole, item.unitText, etc.).
 */
export function buildSelectRequest20(opts: BuildSelectRequestOptions): SelectRequest {
  const {
    items,
    transactionId,
    bppId,
    bppUri,
    domain,
    schemaContext,
    orderStatus = 'CONFIRMED',
    orderContext,
    orderType = 'Order',
    buyerContext = 'https://schema.org',
    buyerType = 'Person',
    buyerRole
  } = opts
  if (!items.length) throw new Error('At least one item is required for Select')

  const providerId = items[0].providerId

  const buyer: Buyer = {
    '@context': buyerContext,
    '@type': buyerType,
    'beckn:id': opts.buyer?.id ?? 'user-1',
    'beckn:displayName': opts.buyer?.displayName ?? 'User',
    'beckn:telephone': opts.buyer?.telephone ?? '',
    'beckn:email': opts.buyer?.email ?? ''
  }
  if (buyerRole != null) {
    buyer['beckn:role'] = buyerRole
  }

  const orderItems: OrderItem[] = items.map(item => {
    const quantityObj: OrderItem['beckn:quantity'] = {
      unitQuantity: Number(item.quantity) || 1,
      unitCode: item.unitCode ?? 'C62'
    }
    if (item.unitText != null) {
      quantityObj.unitText = item.unitText
    }
    const orderItem: OrderItem = {
      'beckn:orderedItem': item.id,
      'beckn:quantity': quantityObj
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
    '@context': orderContext ?? schemaContext,
    '@type': orderType,
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

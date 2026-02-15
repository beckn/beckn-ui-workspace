import type { BecknContext } from '../../lib/types/beckn-2.0/context.types'
import type { Order, OrderItem } from '../../lib/types/beckn-2.0/common.types'

/**
 * Normalize Beckn 2.0 InitResponse to a 1.x-like shape (message.order.quote, message.order.items with quantity.selected.measure).
 * Use this when your app still uses legacy getPaymentBreakDown or similar that expects quote.breakup and items[].quantity.selected.measure.value.
 */
export function normalizeInitResponse20ToLegacy(initResponse: {
  context: BecknContext
  message: { order: Order }
}): Record<string, unknown> {
  const order = initResponse.message.order
  const orderValue = order['beckn:orderValue']
  const value = Number(orderValue?.value ?? 0)
  const currency = orderValue?.currency ?? 'INR'
  const components = orderValue?.components ?? []
  const breakup = components.map((c: { type?: string; description?: string; value?: number; currency?: string }) => ({
    title: c.description || c.type || 'Item',
    price: { currency: c.currency ?? currency, value: String(c.value ?? 0) },
    item: { id: order['beckn:orderItems']?.[0]?.['beckn:orderedItem'] }
  }))
  const items = (order['beckn:orderItems'] ?? []).map((oi: OrderItem) => ({
    id: oi['beckn:orderedItem'],
    quantity: {
      selected: { measure: { value: String(oi['beckn:quantity']?.unitQuantity ?? 1) } }
    }
  }))
  return {
    context: {
      ...initResponse.context,
      domain: initResponse.context.domain,
      transaction_id: initResponse.context.transaction_id,
      bpp_id: initResponse.context.bpp_id,
      bpp_uri: initResponse.context.bpp_uri
    },
    message: {
      order: {
        quote: { price: { value, currency }, breakup },
        items
      }
    }
  }
}

/**
 * Normalize Beckn 2.0 ConfirmResponse to a 1.x-like shape (message.orderId, message.provider, message.quote, message.items).
 * Use this when your order confirmation or order history expects the legacy confirm message shape.
 */
export function normalizeConfirmResponse20ToLegacy(confirmResponse: {
  context: BecknContext
  message: { order: Order }
}): Record<string, unknown> {
  const order = confirmResponse.message.order
  const orderValue = order['beckn:orderValue']
  const value = Number(orderValue?.value ?? 0)
  const currency = orderValue?.currency ?? 'INR'
  const items = (order['beckn:orderItems'] ?? []).map((oi: OrderItem) => ({
    id: oi['beckn:orderedItem'],
    name: '',
    quantity: { selected: { measure: { value: String(oi['beckn:quantity']?.unitQuantity ?? 1) } } }
  }))
  return {
    context: confirmResponse.context,
    message: {
      orderId: order['beckn:id'] ?? order['beckn:orderNumber'] ?? '',
      provider: { id: order['beckn:seller'], name: '' },
      items,
      quote: { price: { value: String(value), currency } },
      fulfillments: [],
      payments: []
    }
  }
}

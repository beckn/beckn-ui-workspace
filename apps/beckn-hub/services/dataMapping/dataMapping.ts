/**
 * Data mapping service.
 * Independent: maps raw API responses to template-ready / UI-ready shape.
 * No dependency on Beckn API calls or payload builders.
 */

export interface DiscoverCatalogPlain {
  id?: string
  descriptor?: Record<string, unknown>
  providerId?: string
  bppId?: string
  bppUri?: string
  validity?: Record<string, unknown>
  items?: unknown
  offers?: unknown[]
  [key: string]: unknown
}

export interface MappedDiscoverCatalog {
  id: string
  name: string
  shortDesc?: string
  providerId?: string
  bppId?: string
  bppUri?: string
  items: unknown[]
  offers: unknown[]
  [key: string]: unknown
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

/**
 * Map discover response message.catalogs to a consistent shape for templates/UI.
 */
export function mapDiscoverCatalogs(catalogs: DiscoverCatalogPlain[] | undefined): MappedDiscoverCatalog[] {
  const list = toArray(catalogs)
  return list.map(cat => {
    const descriptor = (cat.descriptor ?? {}) as Record<string, unknown>
    return {
      id: (cat.id as string) ?? '',
      name: (descriptor.name as string) ?? (descriptor.shortDesc as string) ?? '',
      shortDesc: (descriptor.shortDesc as string) ?? (descriptor.name as string),
      providerId: cat.providerId as string | undefined,
      bppId: cat.bppId as string | undefined,
      bppUri: cat.bppUri as string | undefined,
      items: toArray(cat.items),
      offers: toArray(cat.offers),
      ...cat
    }
  })
}

/**
 * Map discover API response to template-ready structure.
 */
export function mapDiscoverResponse(response: {
  context?: Record<string, unknown>
  message?: { catalogs?: DiscoverCatalogPlain[]; [key: string]: unknown }
}): {
  context: Record<string, unknown>
  catalogs: MappedDiscoverCatalog[]
} {
  const context = response.context ?? {}
  const catalogs = mapDiscoverCatalogs(response.message?.catalogs)
  return { context, catalogs }
}

/**
 * Map select/init/confirm order to a flat structure for display (e.g. quote, items).
 */
export function mapOrderToDisplay(order: Record<string, unknown>): {
  orderId?: string
  orderNumber?: string
  orderValue?: { value?: number; currency?: string }
  items: unknown[]
  fulfillment?: unknown
  payment?: unknown
} {
  const orderValue = (order.orderValue ?? order.quote?.price) as { value?: number; currency?: string } | undefined
  const items = toArray(order.orderItems ?? order.items)
  return {
    orderId: order.id as string | undefined,
    orderNumber: order.orderNumber as string | undefined,
    orderValue,
    items,
    fulfillment: order.fulfillment ?? order.fulfillments?.[0],
    payment: order.payment ?? order.payments?.[0]
  }
}

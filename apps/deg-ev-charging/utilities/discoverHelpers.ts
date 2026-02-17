import type { DiscoverCatalogStored, DiscoverRequest } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import { DOMAIN } from '@lib/config'
import { v4 as uuidv4 } from 'uuid'

/**
 * Check if discover response has a usable message with catalogs (so we can fetch renderer from catalog @context).
 * Use this to avoid calling fetchRenderer when message is missing or catalogs empty.
 */
export function hasDiscoverMessageWithCatalogs(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  const body = (o.message ? o : (o.data as Record<string, unknown>)) as Record<string, unknown>
  const msg = body?.message as Record<string, unknown> | undefined
  if (!msg || typeof msg !== 'object') return false
  const fromMessage = Array.isArray(msg.catalogs) ? msg.catalogs : []
  const fromRoot = Array.isArray(body?.catalogs) ? body.catalogs : Array.isArray(o.catalogs) ? o.catalogs : []
  const list = fromMessage.length ? fromMessage : fromRoot
  return list.length > 0
}

/** Normalize discover API response to catalogs array (from message.catalogs or root catalogs; supports .data wrapper) */
export function getCatalogsFromResponse(data: unknown): DiscoverCatalogStored[] {
  if (!data || typeof data !== 'object') return []
  const o = data as Record<string, unknown>
  const body = (o.message ? o : (o.data as Record<string, unknown>)) as Record<string, unknown>
  const msg = body?.message as Record<string, unknown> | undefined
  const fromMessage = msg && Array.isArray(msg.catalogs) ? msg.catalogs : []
  const fromRoot = Array.isArray(body?.catalogs) ? body.catalogs : Array.isArray(o.catalogs) ? o.catalogs : []
  const list = fromMessage.length ? fromMessage : fromRoot
  return list as DiscoverCatalogStored[]
}

/** Return only catalogs whose id contains the given substring (e.g. "strapi") */
export function filterCatalogsByIdSubstring(
  catalogs: DiscoverCatalogStored[],
  substring?: string
): DiscoverCatalogStored[] {
  if (!substring) return catalogs
  const lower = substring.toLowerCase()
  return catalogs.filter(c => {
    const id = c['id'] as string | undefined
    return typeof id === 'string' && id.toLowerCase().includes(lower)
  })
}

/** Normalize to array: BE may return items as single object or array */
function toArray<T>(val: T | T[] | undefined | null): T[] {
  if (val == null) return []
  return Array.isArray(val) ? val : [val]
}

/** Get items and offers from a catalog (API uses plain keys; items/offers may be single object or array) */
export function getCatalogItemsAndOffers(catalog: DiscoverCatalogStored): { items: unknown[]; offers: unknown[] } {
  const rawItems = catalog['items']
  const rawOffers = catalog['offers']
  return { items: toArray(rawItems), offers: toArray(rawOffers) }
}

/** Provider display name: item's provider.descriptor.name, else catalog descriptor.name (API uses plain keys only) */
export function getProviderName(catalog: DiscoverCatalogStored, item: unknown): string {
  const rec = item as Record<string, unknown>
  const itemProvider = rec['provider'] as Record<string, unknown> | undefined
  const itemDesc = itemProvider?.descriptor as Record<string, unknown> | undefined
  const name = typeof itemDesc?.['name'] === 'string' && itemDesc['name'].length ? itemDesc['name'] : null
  if (name) return name
  const catalogDesc = catalog['descriptor'] as unknown as Record<string, unknown> | undefined
  const catalogName =
    catalogDesc && typeof catalogDesc['name'] === 'string' && catalogDesc['name'].length ? catalogDesc['name'] : null
  if (catalogName) return catalogName
  return 'Provider'
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Build discover request using common types (BecknContext + DiscoverMessage) */
export function buildDiscoverRequest(textSearch: string): DiscoverRequest {
  const now = new Date().toISOString()
  const messageId = uuidv4().toString()
  const transactionId = uuidv4().toString()
  const bapId = process.env.NEXT_PUBLIC_BAP_ID || 'ev-charging.sandbox1.com'
  const bapUri = process.env.NEXT_PUBLIC_BAP_URI || 'http://onix-adapter:8081/bap/receiver'
  return {
    context: {
      domain: DOMAIN,
      version: '2.0.0',
      action: 'discover',
      bap_id: bapId,
      bap_uri: bapUri,
      transaction_id: transactionId,
      message_id: messageId,
      timestamp: now,
      ttl: 'PT30S'
    },
    message: { text_search: textSearch || '' }
  }
}

/** Extract transaction_id from discover response context (supports .data wrapper) */
export function getTransactionIdFromResponse(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const o = data as Record<string, unknown>
  const body = (o.context ? o : o.data) as Record<string, unknown> | undefined
  const ctx = body?.context as Record<string, unknown> | undefined
  const id = ctx?.transaction_id
  return typeof id === 'string' ? id : undefined
}

/** Find item by id across all catalogs; returns catalog and item or null */
export function findItemInCatalogs(
  catalogs: DiscoverCatalogStored[],
  itemId: string
): { catalog: DiscoverCatalogStored; item: Record<string, unknown> } | null {
  for (const catalog of catalogs) {
    const { items } = getCatalogItemsAndOffers(catalog)
    const item = items.find((it: unknown) => String((it as Record<string, unknown>)['id']) === itemId)
    if (item) return { catalog, item: item as Record<string, unknown> }
  }
  return null
}

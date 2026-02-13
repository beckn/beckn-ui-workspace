import type { DiscoverCatalogStored, DiscoverRequest } from '@beckn-ui/common/lib/types/beckn-2.0/discover'

const EV_CHARGING_SCHEMA_CONTEXT =
  'https://raw.githubusercontent.com/beckn/protocol-specifications-new/refs/heads/main/schema/EvChargingService/v1/context.jsonld'

/** Normalize discover API response to catalogs array (from message.catalogs or root catalogs) */
export function getCatalogsFromResponse(data: unknown): DiscoverCatalogStored[] {
  if (!data || typeof data !== 'object') return []
  const o = data as Record<string, unknown>
  const msg = o.message as Record<string, unknown> | undefined
  const fromMessage = msg && Array.isArray(msg.catalogs) ? msg.catalogs : []
  const fromRoot = Array.isArray(o.catalogs) ? o.catalogs : []
  const list = fromMessage.length ? fromMessage : fromRoot
  return list as DiscoverCatalogStored[]
}

/** Return only catalogs whose beckn:id (or id) contains the given substring (e.g. "strapi") */
export function filterCatalogsByIdSubstring(
  catalogs: DiscoverCatalogStored[],
  substring?: string
): DiscoverCatalogStored[] {
  if (!substring) return catalogs
  const lower = substring.toLowerCase()
  return catalogs.filter(c => {
    const id = (c['beckn:id'] ?? c['id']) as string | undefined
    return typeof id === 'string' && id.toLowerCase().includes(lower)
  })
}

/** Get items and offers from a catalog (beckn:items / beckn:offers) */
export function getCatalogItemsAndOffers(catalog: DiscoverCatalogStored): { items: unknown[]; offers: unknown[] } {
  const items = (catalog['beckn:items'] ?? catalog['items'] ?? []) as unknown[]
  const offers = (catalog['beckn:offers'] ?? catalog['offers'] ?? []) as unknown[]
  return { items, offers }
}

/** Provider display name: item's beckn:provider.descriptor.schema:name, else catalog descriptor */
export function getProviderName(catalog: DiscoverCatalogStored, item: unknown): string {
  const rec = item as Record<string, unknown>
  const itemProvider = rec['beckn:provider'] as Record<string, unknown> | undefined
  const fromItem = itemProvider?.descriptor as Record<string, unknown> | undefined
  const name = fromItem?.['schema:name']
  if (typeof name === 'string' && name.length) return name
  const catalogDesc = catalog['beckn:descriptor'] as unknown as Record<string, unknown> | undefined
  const fromCatalog = catalogDesc?.['schema:name']
  if (typeof fromCatalog === 'string' && fromCatalog.length) return fromCatalog
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
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const transactionId = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const bapId = process.env.NEXT_PUBLIC_BAP_ID || 'ev-charging.sandbox1.com'
  const bapUri = process.env.NEXT_PUBLIC_BAP_URI || 'http://onix-adapter:8081/bap/receiver'
  return {
    context: {
      domain: 'ev-charging',
      location: { id: 'default', gps: '', country: { name: 'India', code: 'IN' } },
      version: '2.0.0',
      action: 'discover',
      bap_id: bapId,
      bap_uri: bapUri,
      bpp_id: '',
      bpp_uri: '',
      transaction_id: transactionId,
      message_id: messageId,
      timestamp: now,
      ttl: 'PT30S',
      schema_context: [EV_CHARGING_SCHEMA_CONTEXT]
    },
    message: { text_search: textSearch || 'DC Fast Charger - CCS2 (60kW)' }
  }
}

/** Extract transaction_id from discover response context */
export function getTransactionIdFromResponse(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const ctx = (data as Record<string, unknown>).context as Record<string, unknown> | undefined
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
    const item = items.find(
      (it: unknown) =>
        String((it as Record<string, unknown>)['beckn:id'] ?? (it as Record<string, unknown>)['id']) === itemId
    )
    if (item) return { catalog, item: item as Record<string, unknown> }
  }
  return null
}

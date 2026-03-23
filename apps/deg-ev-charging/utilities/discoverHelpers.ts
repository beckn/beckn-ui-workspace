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

/** Get price for an item from catalog offers. Match by offer's beckn:items or items containing itemId; return first matching offer price. */
export function getItemPriceFromCatalog(
  catalog: DiscoverCatalogStored,
  itemId: string
): { value: number; currency: string } | null {
  const { offers } = getCatalogItemsAndOffers(catalog)
  const id = String(itemId).trim()
  if (!id) return null
  for (const offer of offers) {
    const o = offer as Record<string, unknown>
    const itemIds = (o['beckn:items'] ?? o['items']) as string[] | unknown[] | undefined
    const arr = Array.isArray(itemIds) ? itemIds.map(x => String(x)) : []
    if (!arr.includes(id)) continue
    const price = (o['beckn:price'] ?? o['price']) as Record<string, unknown> | undefined
    if (!price || typeof price !== 'object') continue
    const value = Number(price['value'])
    const currency = typeof price['currency'] === 'string' ? price['currency'] : 'INR'
    if (!Number.isFinite(value)) continue
    return { value, currency }
  }
  return null
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
export function buildDiscoverRequest(_textSearch: string): DiscoverRequest {
  return buildDiscoverRequestByLocation(12.931497116608497, 77.6237679675213)
}

/** Build discover request with spatial filter around lat/lng (GeoJSON coordinates are [lng, lat]) */
export function buildDiscoverRequestByLocation(lat: number, lng: number): DiscoverRequest {
  const now = new Date().toISOString()
  const messageId = uuidv4().toString()
  const transactionId = uuidv4().toString()
  const bapId = process.env.NEXT_PUBLIC_BAP_ID || ''
  const bapUri = process.env.NEXT_PUBLIC_BAP_URI || ''
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
    message: {
      spatial: [
        {
          op: 's_dwithin',
          targets: '$.catalogs[*].beckn:items[*].beckn:availableAt[*].geo',
          geometry: {
            type: 'Point',
            coordinates: [lat, lng] as unknown as number[]
          },
          distanceMeters: 10000
        }
      ]
    }
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

/** Get lat/lng from item's availableAt[0].geo.coordinates. API returns [lat, lng] (e.g. [12.93, 77.62]); returns null if missing */
export function getItemCoordinates(item: Record<string, unknown>): { lat: number; lng: number } | null {
  const at = item['availableAt']
  const first = Array.isArray(at) ? at[0] : at && typeof at === 'object' ? at : undefined
  if (!first || typeof first !== 'object') return null
  const loc = first as Record<string, unknown>
  const geo = loc['geo'] as Record<string, unknown> | undefined
  const coords = geo && Array.isArray(geo['coordinates']) ? (geo['coordinates'] as number[]) : []
  if (coords.length < 2) return null
  return { lat: coords[0], lng: coords[1] }
}

/** One entry per availableAt: { lat, lng, address } (GeoJSON coordinates [lng, lat]) */
function formatAddressFromLoc(addr: Record<string, unknown> | undefined): string {
  if (!addr || typeof addr !== 'object') return ''
  const parts = [
    addr.streetAddress,
    addr.addressLocality,
    addr.addressRegion,
    addr.postalCode,
    addr.addressCountry
  ].filter(Boolean) as string[]
  return parts.join(', ')
}

/** Return all location entries for an item (one per availableAt); used for one-marker-per-location map. API returns geo.coordinates as [lat, lng]. */
export function getItemLocationEntries(
  item: Record<string, unknown>
): Array<{ lat: number; lng: number; address: string }> {
  const at = item['availableAt']
  const arr = Array.isArray(at) ? at : at && typeof at === 'object' ? [at] : []
  const out: Array<{ lat: number; lng: number; address: string }> = []
  for (const loc of arr) {
    if (!loc || typeof loc !== 'object') continue
    const rec = loc as Record<string, unknown>
    const geo = rec['geo'] as Record<string, unknown> | undefined
    const coords = geo && Array.isArray(geo['coordinates']) ? (geo['coordinates'] as number[]) : []
    if (coords.length < 2) continue
    const address = formatAddressFromLoc(rec['address'] as Record<string, unknown> | undefined)
    out.push({ lat: coords[0], lng: coords[1], address })
  }
  return out
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

import type { ParsedItemModel } from '@beckn-ui/common'
import type { DiscoverCatalogStored } from '@store/discovery-slice'
import type { SelectedCharger, ChargerPort } from '@store/chargerSelect-slice'

type BecknItem = Record<string, unknown>

function getStr(obj: unknown, ...paths: string[]): string {
  if (obj == null) return ''
  const o = obj as Record<string, unknown>
  for (const path of paths) {
    const val = o[path]
    if (typeof val === 'string') return val
  }
  return ''
}

function getNum(obj: unknown, path: string): number {
  if (obj == null) return 0
  const val = (obj as Record<string, unknown>)[path]
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string') return parseFloat(val) || 0
  return 0
}

/** Get descriptor sub-object from item */
function getDescriptor(item: BecknItem): Record<string, unknown> {
  const d = item['beckn:descriptor'] ?? item['descriptor']
  return (d && typeof d === 'object' ? (d as Record<string, unknown>) : {}) as Record<string, unknown>
}

/** Get provider from item */
function getProvider(item: BecknItem): Record<string, unknown> {
  const p = item['beckn:provider'] ?? item['provider']
  return (p && typeof p === 'object' ? (p as Record<string, unknown>) : {}) as Record<string, unknown>
}

/** Get first location/availableAt from item */
function getFirstLocation(item: BecknItem): { gps?: string; address?: Record<string, unknown> } {
  const at = item['beckn:availableAt'] ?? item['availableAt']
  const arr = Array.isArray(at) ? at : []
  const first = arr[0]
  if (!first || typeof first !== 'object') return {}
  const loc = first as Record<string, unknown>
  const geo = loc['geo'] as Record<string, unknown> | undefined
  const coords = geo && Array.isArray(geo['coordinates']) ? (geo['coordinates'] as number[]) : []
  const gps = coords.length >= 2 ? `${coords[1]},${coords[0]}` : undefined
  return { gps, address: loc['address'] as Record<string, unknown> | undefined }
}

/** Build ParsedItemModel from catalog item and catalog context for cart/checkout */
export function catalogItemToParsedModel(
  catalog: DiscoverCatalogStored,
  item: BecknItem,
  transactionId: string,
  domain: string
): ParsedItemModel {
  const descriptor = getDescriptor(item)
  const provider = getProvider(item)
  const providerId = getStr(provider, 'beckn:id', 'id')
  const providerName = getStr(provider['beckn:descriptor'] ?? provider['descriptor'], 'schema:name', 'name')
  const loc = getFirstLocation(item)
  const [latStr, lngStr] = (loc.gps || '0,0').split(',')
  const latitude = parseFloat(latStr) || 0
  const longitude = parseFloat(lngStr) || 0

  const name = getStr(descriptor, 'schema:name', 'name')
  const shortDesc = getStr(descriptor, 'beckn:shortDesc', 'shortDesc')
  const itemId = getStr(item, 'beckn:id', 'id')

  const bppId = getStr(catalog, 'beckn:bppId', 'bppId')
  const bppUri = getStr(catalog, 'beckn:bppUri', 'bppUri')

  const itemAttributes = (item['beckn:itemAttributes'] ?? item['itemAttributes']) as Record<string, unknown> | undefined
  const connectorType = getStr(itemAttributes, 'connectorType', 'connector_type')
  const priceValue = getNum(itemAttributes, 'price') || getNum(item, 'price') || 0
  const price = { value: String(priceValue), currency: 'INR' }

  const tags = connectorType
    ? [
        {
          code: 'connector',
          name: 'Connector',
          descriptor: { name: connectorType },
          display: true,
          list: [{ name: connectorType, value: connectorType, display: true, descriptor: { name: connectorType } }]
        }
      ]
    : undefined

  const itemPayload = {
    id: itemId,
    name,
    price,
    short_desc: shortDesc,
    long_desc: getStr(descriptor, 'beckn:longDesc', 'longDesc'),
    tags,
    fulfillments: [],
    locations: loc.gps ? [{ gps: loc.gps, address: loc.address }] : undefined
  }

  return {
    id: itemId,
    bppId,
    bppUri,
    domain,
    transactionId,
    providerId,
    providerName,
    item: itemPayload as ParsedItemModel['item'],
    providerCoordinates: { latitude, longitude },
    location: loc.gps ? ({ gps: loc.gps, address: loc.address } as ParsedItemModel['location']) : undefined
  }
}

/** Build SelectedCharger from catalog item and catalog for checkout flow */
export function catalogItemToSelectedCharger(
  catalog: DiscoverCatalogStored,
  item: BecknItem,
  parsed: ParsedItemModel
): SelectedCharger {
  const descriptor = getDescriptor(item)
  const loc = getFirstLocation(item)
  const itemAttributes = (item['beckn:itemAttributes'] ?? item['itemAttributes']) as Record<string, unknown> | undefined
  const connectorType = getStr(itemAttributes, 'connectorType', 'connector_type')
  const port: ChargerPort = {
    id: connectorType || 'default',
    type: connectorType || 'CCS2',
    icon: ''
  }
  const address = loc.address
    ? [address['streetAddress'], address['addressLocality'], address['addressRegion'], address['addressCountry']]
        .filter(Boolean)
        .join(', ')
    : ''

  return {
    id: parsed.id,
    name: getStr(descriptor, 'schema:name', 'name'),
    address: address || 'Address not specified',
    status: 'Available',
    rate:
      typeof parsed.item?.price === 'object'
        ? parseFloat(String((parsed.item as { price?: { value?: string } }).price?.value)) || 0
        : 0,
    ports: [port],
    selectedPort: port,
    data: { providerDetails: parsed, itemDetails: parsed.item }
  }
}

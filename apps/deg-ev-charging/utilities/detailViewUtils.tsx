import React from 'react'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'

export type ItemRecord = Record<string, unknown>

export type FoundItem = { catalog: DiscoverCatalogStored; item: ItemRecord }

export function getStr(obj: unknown, ...keys: string[]): string {
  if (obj == null || typeof obj !== 'object') return ''
  const o = obj as Record<string, unknown>
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string') return v
  }
  return ''
}

export function getNum(obj: unknown, key: string): number {
  if (obj == null || typeof obj !== 'object') return 0
  const v = (obj as Record<string, unknown>)[key]
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return parseFloat(v) || 0
  return 0
}

export function getFirstAvailableAt(item: ItemRecord): ItemRecord | null {
  const at = item['availableAt']
  const first = Array.isArray(at) ? at[0] : at && typeof at === 'object' ? at : null
  return first && typeof first === 'object' ? (first as ItemRecord) : null
}

export function getAddressLine(item: ItemRecord): string {
  const loc = getFirstAvailableAt(item)
  const addr = loc?.['address'] as Record<string, unknown> | undefined
  if (!addr || typeof addr !== 'object') return ''
  const parts = [
    getStr(addr, 'streetAddress'),
    getStr(addr, 'addressLocality'),
    getStr(addr, 'addressRegion'),
    getStr(addr, 'postalCode'),
    getStr(addr, 'addressCountry')
  ].filter(Boolean)
  return parts.join(', ')
}

/** Specs from item only – no inferred labels/values */
export function getSpecsList(item: ItemRecord): { label: string; value: string }[] {
  const attrs = item['itemAttributes'] as ItemRecord | undefined
  const connectorType = getStr(attrs, 'connectorType', 'connector_type')
  const minKw = getNum(attrs, 'minPowerKW')
  const maxKw = getNum(attrs, 'maxPowerKW')
  const chargingSpeed = getStr(attrs, 'chargingSpeed', 'charging_speed')
  const powerType = getStr(attrs, 'powerType', 'power_type')

  const list: { label: string; value: string }[] = []
  if (connectorType) list.push({ label: 'Connector Type', value: connectorType })
  if (minKw > 0 || maxKw > 0) {
    const powerRange = [minKw > 0 ? `${minKw}kW` : '', maxKw > 0 ? `${maxKw}kW` : ''].filter(Boolean).join(' - ')
    if (powerRange) list.push({ label: 'Power Range', value: powerRange })
  }
  if (chargingSpeed) list.push({ label: 'Charging Speed', value: chargingSpeed })
  if (powerType) list.push({ label: 'Power Type', value: powerType })
  return list
}

export function getPills(item: ItemRecord): string[] {
  const attrs = item['itemAttributes'] as ItemRecord | undefined
  const pills: string[] = []
  const connector = getStr(attrs, 'connectorType', 'connector_type')
  if (connector) pills.push(connector)
  const maxKw = getNum(attrs, 'maxPowerKW')
  if (maxKw) pills.push(`${maxKw} kW`)
  const powerType = getStr(attrs, 'powerType', 'power_type')
  if (powerType) pills.push(powerType)
  return pills
}

export const SpecIcon = () => (
  <span
    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ev-primary-light)] text-[var(--ev-primary)]"
    aria-hidden
  >
    <svg
      className="h-3 w-3"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4v-6h2v6h-2z" />
    </svg>
  </span>
)

export const LocationIcon = () => (
  <span
    className="flex h-5 w-5 shrink-0 text-[var(--ev-error)]"
    aria-hidden
  >
    <svg
      className="h-5 w-5"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  </span>
)

export const StarIcon = ({ filled }: { filled?: boolean }) => (
  <span
    className={filled ? 'text-[var(--ev-warning)]' : 'text-[var(--ev-border)]'}
    aria-hidden
  >
    <svg
      className="h-4 w-4 inline"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  </span>
)

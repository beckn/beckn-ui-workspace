import { renderTemplate } from '@lib/templateProcessor'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'
import { getCatalogItemsAndOffers, getProviderName, escapeHtml } from './discoverHelpers'

/** Renders all items from all catalogs using discoveryCard template and data mapping */
export function renderDiscoveryItems(
  catalogs: DiscoverCatalogStored[],
  templateHtml: string,
  stylingHints?: Record<string, unknown>
): string {
  let html = ''
  for (const catalog of catalogs) {
    const { items, offers } = getCatalogItemsAndOffers(catalog)
    for (const item of items) {
      const rec = item as Record<string, unknown>
      const itemId = rec['id'] as string
      const providerName = getProviderName(catalog, item)
      const cardHtml = renderTemplate(templateHtml, item, offers, stylingHints)
      const withId =
        cardHtml && !cardHtml.includes('data-item-id')
          ? `<div data-item-id="${escapeHtml(itemId)}" class="item-card">${cardHtml}</div>`
          : cardHtml
      html += `<div class="item-with-provider" data-item-id="${escapeHtml(itemId)}"><span class="provider-name">${escapeHtml(providerName)}</span>${withId}</div>`
    }
  }
  return html
}

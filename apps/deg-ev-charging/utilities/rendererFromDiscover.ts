import { fetchRendererConfig } from '@lib/templateProcessor'
import type { DiscoverCatalogStored } from '@beckn-ui/common/lib/types/beckn-2.0/discover'

/**
 * Get the @context URL from the first catalog in the discover response.
 * This URL points to the schema context (e.g. .../context.jsonld).
 * Replacing context.jsonld with renderer.json in this URL gives the renderer config URL.
 */
export function getFirstCatalogContextUrl(catalogs: DiscoverCatalogStored[]): string | undefined {
  if (!catalogs?.length) return undefined
  const first = catalogs[0]
  const ctx = first['@context']
  if (typeof ctx === 'string' && ctx.length) return ctx
  return undefined
}

/**
 * Get renderer config for discover list rendering:
 * - Uses the first catalog's @context URL
 * - Replaces context.jsonld with renderer.json and fetches that URL
 * - Returns the renderer config (templates + stylingHints) for mapping data to templates.
 * @throws if no @context in first catalog or if fetch fails
 */
export async function fetchRendererConfigFromDiscoverCatalogs(
  catalogs: DiscoverCatalogStored[]
): Promise<Awaited<ReturnType<typeof fetchRendererConfig>>> {
  const contextUrl = getFirstCatalogContextUrl(catalogs)
  if (!contextUrl) {
    throw new Error('No @context found in first catalog')
  }
  return fetchRendererConfig(contextUrl)
}

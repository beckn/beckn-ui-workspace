import { SearchResponse, Item, Provider } from './search-results.types'

export const formattedItems = (data: SearchResponse) => {
  const allItems = data.message.catalogs.flatMap((catalog: any) => {
    if (catalog.message && catalog.message.catalog && catalog.message.catalog['bpp/providers'].length > 0) {
      const providers = catalog.message.catalog['bpp/providers']

      return providers.flatMap((provider: Provider) => {
        if (provider.items && provider.items.length > 0) {
          return provider.items.map((item: Item) => {
            return {
              bpp_id: catalog.context.bpp_id,
              bpp_uri: catalog.context.bpp_uri,
              ...item,
              providerId: provider.id,
              locations: provider.locations,
              bppName: catalog.message.catalog['bpp/descriptor'].name
            }
          })
        }
        return []
      })
    }
    return []
  })
  return allItems
}

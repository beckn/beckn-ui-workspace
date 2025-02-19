import { Item, ParsedItemModel, SearchResponseModel } from '@beckn-ui/common'

const dummyLocation = {
  latitude: 12.909955,
  longitude: 77.596316
}

interface ExtendedParsedItemModel extends Omit<ParsedItemModel, 'item'> {
  providerDescription?: string
  providerShortDescription?: string
  providerImage?: string
  item: Item[]
}

export const parseSearchFinancelist = (data: SearchResponseModel[]) => {
  const itemsArray: ExtendedParsedItemModel[] = []

  data.forEach(entry => {
    const { context, message } = entry
    const { domain, transaction_id, bpp_id, bpp_uri } = context

    message.providers.forEach(provider => {
      try {
        let providerCoordinates = dummyLocation

        if (provider.locations && provider.locations.length > 0) {
          const location = provider.locations[0]

          if (location.gps) {
            const [lat, lng] = location.gps.split(',').map(Number)
            providerCoordinates = { latitude: lat, longitude: lng }
          }
        }

        const parsedItem: ExtendedParsedItemModel = {
          id: provider.id,
          bppId: bpp_id,
          bppUri: bpp_uri,
          domain,
          transactionId: transaction_id,
          providerId: provider.id,
          providerName: provider.name,
          rating: provider.rating,
          item: provider.items,
          providerCoordinates,
          providerDescription: provider.long_desc,
          providerShortDescription: provider.short_desc,
          providerImage: provider.images?.[0]?.url || ''
        }

        itemsArray.push(parsedItem)
      } catch (err) {
        console.error('Error parsing provider:', provider.id, err)
      }
    })
  })
  console.log('itemsArray:', itemsArray)
  return itemsArray
}

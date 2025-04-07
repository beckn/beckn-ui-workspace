import { ParsedItemModel, SearchResponseModel } from '@beckn-ui/common'

const dummyLocation = {
  latitude: 12.909955,
  longitude: 77.596316
}

export const parseSearchlist = (data: SearchResponseModel[], type?: 'RENT_AND_HIRE' | 'MY_STORE') => {
  const itemsArray: ParsedItemModel[] = []

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
        provider.items.forEach(item => {
          let itemData = item
          if (type === 'RENT_AND_HIRE') {
            itemData = { ...item, price: { ...item.price, rateLabel: '/ hr' } }
          }
          itemsArray.push({
            id: item.id,
            bppId: bpp_id,
            bppUri: bpp_uri,
            domain: message.name,
            transactionId: transaction_id,
            providerId: provider.id,
            providerName: provider.name,
            rating: provider.rating,
            item: itemData,
            providerCoordinates
          })
        })
      } catch (err) {
        console.error('Error parsing provider:', provider.id, err)
      }
    })
  })

  return itemsArray
}

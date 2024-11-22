import { ParsedItemModel, QuantityDetails, SearchResponseModel } from '@beckn-ui/common'

const dummyLocation = [
  {
    id: './retail.kirana/ind.blr/1@tourism-bpp-infra2.becknprotocol.io.provider_location',
    gps: '12.909955, 77.596316'
  }
]

export const parseSearchlist = (data: SearchResponseModel[]) => {
  const itemsarray: ParsedItemModel[] = []
  data.forEach(entry => {
    const context = entry.context
    const message = entry.message
    const domain = context.domain
    const transactionId = context.transaction_id
    const bppId = context.bpp_id
    const bppUri = context.bpp_uri
    message.providers.forEach(provider => {
      try {
        const stringifiedLatLong =
          provider.locations && provider.locations[0]?.gps ? provider.locations[0].gps : dummyLocation[0].gps
        const [stringifiedLatitude, stringifiedLongitude] = stringifiedLatLong.split(', ')
        const latitude = parseFloat(stringifiedLatitude)
        const longitude = parseFloat(stringifiedLongitude)
        const providerCoordinates = {
          latitude,
          longitude
        }
        const providerId = provider.id
        // const rating = provider.rating
        provider.items.forEach(item => {
          itemsarray.push({
            id: providerId,
            bppId: bppId,
            bppUri: bppUri,
            domain,
            transactionId,
            providerId: providerId,
            providerName: provider.name,
            item: {
              ...item,
              short_desc: provider.short_desc,
              ...(provider.long_desc && {
                productInfo: provider.long_desc
              }),
              images: item.images,
              rating: provider.rating
            },
            providerCoordinates
          })
        })
      } catch (err) {
        console.log('Error', err)
      }
    })
  })

  return itemsarray
}

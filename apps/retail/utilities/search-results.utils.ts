import { ParsedItemModel, SearchResponseModel } from '../types/search.types'

export const parsedSearchlist = (data: SearchResponseModel[]) => {
  const itemsarray: ParsedItemModel[] = []
  data.forEach(entry => {
    const context = entry.context
    const message = entry.message
    const domain = context.domain
    const transactionId = context.transaction_id
    const bppId = context.bpp_id
    const bppUri = context.bpp_uri

    message.providers.forEach(provider => {
      const stringifiedLatLong = provider.locations[0].gps
      const [stringifiedLatitude, stringifiedLongitude] = stringifiedLatLong.split(', ')

      const latitude = parseFloat(stringifiedLatitude)
      const longitude = parseFloat(stringifiedLongitude)

      const providerCoordinates = {
        latitude,
        longitude
      }

      const providerId = provider.id
      const rating = provider.rating

      provider.items.forEach(item => {
        itemsarray.push({
          bppId: bppId,
          bppUri: bppUri,
          domain,
          transactionId,
          providerId: providerId,
          providerName: provider.name,
          item,
          rating,
          providerCoordinates
        })
      })
    })
  })

  return itemsarray
}

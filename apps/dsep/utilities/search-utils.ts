// import { ParsedItemModel, SearchResponseModel } from '../types/search.types'

import { ParsedItemModel, SearchResponseModel } from '../types/search.types'

export const getParsedSearchlist = (data: SearchResponseModel[]) => {
  const itemsarray: ParsedItemModel[] = []
  data.forEach(entry => {
    const context = entry.context
    const message = entry.message
    const domain = context.domain
    const transactionId = context.transaction_id
    const bppId = context.bpp_id
    const bppUri = context.bpp_uri

    message.providers.forEach(provider => {
      const providerId = provider.id
      const rating = provider.rating

      provider?.items?.forEach(item => {
        const { tags } = item
        const courseDurationTag = tags?.find(tag => tag.list[0]?.code === 'course-duration')
        const courseDuration = courseDurationTag?.list[0]?.value || ''

        itemsarray.push({
          bppId: bppId,
          bppUri: bppUri,
          domain,
          transactionId,
          providerId: providerId,
          providerName: provider.name,
          item,
          rating,
          cityName: provider.locations?.[0].city?.name,
          courseDuration
        })
      })
    })
  })

  return itemsarray
}

import { ParsedItemModel } from '@beckn-ui/common/lib/types'

interface ProviderLocation {
  id: string
  gps: string
  address: string
  city: { name: string }
  country: { name: string }
  state: { name: string }
  area_code: string
}

interface ProviderImage {
  url: string
}

interface ItemTag {
  code: string
  description?: string
  list?: Array<{
    code: string
    name: string
    value: string
    display: boolean
  }>
}

interface ItemCategory {
  id: string
  name: string
  code: string
}

interface ItemFulfillment {
  id: string
  type: string
  tags?: ItemTag[]
}

interface ItemImage {
  url: string
}

interface ItemQuantity {
  available: {
    count: number
  }
}

interface ProviderItem {
  id: string
  code: string
  short_desc: string
  long_desc: string
  name: string
  price: {
    value: string
    currency: string
  }
  categories?: ItemCategory[]
  locations?: Array<{
    id: string
    city: string
    state: string
    country: string
    gps: string
    address: string
  }>
  fulfillments?: ItemFulfillment[]
  images?: ItemImage[]
  rating?: string
  rateable?: boolean
  tags?: ItemTag[]
  quantity?: ItemQuantity
}

interface Provider {
  id: string
  name: string
  short_desc?: string
  long_desc?: string
  locations?: ProviderLocation[]
  items: ProviderItem[]
  images?: ProviderImage[]
}

interface SearchContext {
  domain: string
  transaction_id: string
  bpp_id: string
  bpp_uri: string
}

interface SearchMessage {
  name: string
  providers: Provider[]
}

export interface RestaurantSearchResponse {
  context: SearchContext
  message: SearchMessage
}

const dummyLocation = {
  latitude: 12.909955,
  longitude: 77.596316
}

/**
 * Extracts a specific tag value from an array of tags
 */
export const getTagValue = (tags: ItemTag[] | undefined, tagCode: string): string | undefined => {
  if (!tags) return undefined
  const tag = tags.find(t => t.code === tagCode || t.description === tagCode)
  return tag?.list?.[0]?.value
}

/**
 * Parses the restaurant search API response into ParsedItemModel array
 */
export const parseRestaurantSearchResponse = (data: RestaurantSearchResponse[]): ParsedItemModel[] => {
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
            const [lat, lng] = location.gps.split(',').map(s => parseFloat(s.trim()))
            if (!isNaN(lat) && !isNaN(lng)) {
              providerCoordinates = { latitude: lat, longitude: lng }
            }
          }
        }

        provider.items.forEach(item => {
          // Extract diet type from tags
          const dietType = getTagValue(item.tags, 'diet')
          // Extract cuisine from tags
          const cuisine = getTagValue(item.tags, 'cuisine')
          // Extract course from tags
          const course = getTagValue(item.tags, 'course')

          // Build the item with proper mapping - includes all fields from API response
          const parsedItem: ParsedItemModel = {
            id: item.id,
            bppId: bpp_id,
            bppUri: bpp_uri,
            domain,
            transactionId: transaction_id,
            providerId: provider.id,
            providerName: provider.name,
            rating: item.rating !== 'null' ? item.rating : undefined,
            providerCoordinates,
            providerImg: provider.images ? ([{ images: provider.images }] as any) : undefined,
            item: {
              id: item.id,
              name: item.name,
              code: item.code,
              price: {
                value: item.price.value,
                currency: item.price.currency as any
              },
              short_desc: item.short_desc,
              long_desc: item.long_desc,
              images: item.images,
              rating: item.rating !== 'null' ? item.rating : undefined,
              tags: item.tags?.map(tag => ({
                code: tag.code,
                name: tag.code,
                descriptor: { name: tag.description || tag.code },
                display: true,
                list: tag.list?.map(l => ({
                  name: l.name,
                  value: l.value,
                  display: l.display,
                  descriptor: { name: l.name }
                }))
              })) as any,
              fulfillments: item.fulfillments?.map(fulfillment => ({
                id: fulfillment.id,
                type: fulfillment.type,
                tags: fulfillment.tags?.map(tag => ({
                  code: tag.code,
                  name: tag.code,
                  descriptor: { name: tag.description || tag.code },
                  display: true,
                  list: tag.list?.map(l => ({
                    name: l.name,
                    value: l.value,
                    display: l.display,
                    descriptor: { name: l.name }
                  }))
                })) as any
              })) as any,
              locations: item.locations?.map(loc => ({
                id: loc.id,
                gps: loc.gps,
                address: loc.address,
                city: { name: loc.city },
                country: { name: loc.country },
                state: { name: loc.state },
                area_code: ''
              })) as any,
              quantity: item.quantity
                ? ({
                    available: { count: item.quantity.available.count }
                  } as any)
                : undefined,
              // Store categories in productInfo for future use
              productInfo: item.categories
                ? JSON.stringify({
                    categories: item.categories.map(cat => ({
                      id: cat.id,
                      name: cat.name,
                      code: cat.code
                    }))
                  })
                : undefined
            }
          }

          itemsArray.push(parsedItem)
        })
      } catch (err) {
        console.error('Error parsing provider:', provider.id, err)
      }
    })
  })

  return itemsArray
}

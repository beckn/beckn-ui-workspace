import { formatDate, ParsedItemModel, SearchResponseModel } from '@beckn-ui/common'
import { formatTime } from './general'

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
          console.log('type:', item)

          const fulfillmentStart: any = item.fulfillments?.find(f => f.type === 'RENTAL_START' && f.state)
          const fulfillmentEnd: any = item.fulfillments?.find(f => f.type === 'RENTAL_END' && f.state)
          const startTimestamp = fulfillmentStart ? Number(fulfillmentStart.state?.name || 0) : null
          const endTimestamp = fulfillmentEnd ? Number(fulfillmentEnd.state?.name || 0) : null

          const startTime = formatTime(startTimestamp)
          const endTime = formatTime(endTimestamp)

          const date = formatDate(Number(startTimestamp) * 1000, 'dd/MM/yy')

          if (type === 'RENT_AND_HIRE') {
            itemData = {
              ...item,
              name: provider.name,
              short_desc: '',
              long_desc: item.long_desc || item.short_desc || '',
              rating: '',
              price: { ...item.price, rateLabel: 'per hour' },
              productInfo: {
                Availability: date,
                Time: `${startTime} - ${endTime}`
              }
            }
          } else if (type === 'MY_STORE') {
            itemData = {
              ...item,
              short_desc: undefined,
              productInfo: {
                image: provider?.images[0]?.url
              },
              infoGuideIcon: '../images/GUIDE.svg' // TODO: need to fix this, currently not supported
            }
          }
          itemsArray.push({
            id: item.id,
            bppId: bpp_id,
            bppUri: bpp_uri,
            domain: type === 'MY_STORE' ? message.name : '',
            transactionId: transaction_id,
            providerId: provider.id,
            providerName: '',
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

import { PickUpDropOffModel, SearchResponseModel } from '@beckn-ui/common'
import { DOMAIN } from '@lib/config'

interface CabDetails {
  name: string
  waitTime: string
  fare: string
}

interface ChaufferDetails {
  name: string
  registrationNumber: string
  carModel: string
  color: string
  otp: string
  rating: string
  contact: string
}

interface Location {
  pickup: string
  dropOff: string
}

interface Options {
  label: string
  value: string
  tag: string
}

interface OptionsList {
  rideTimeOptionsList: Options[]
  riderOptionsList: Options[]
}

interface DataItemModel {
  cabCategory: {
    mini: {
      cabDetails: CabDetails
    }
  }
  chaufferDetails: ChaufferDetails
  location: Location
  optionsList: OptionsList
}

export interface ParsedCabDataModel {
  providerId: string
  providerName: string
  image: string
  rating: string
  bppId: string
  bppUri: string
  domain: string
  transactionId: string
  cabDetails: {
    id: string
    image: string
    name: string
    waitTime: string
    fare: string
    rating: string
    cityName?: string
  }[]
}

interface MockDataModel {
  data: DataItemModel[]
}

export const mockData: MockDataModel = {
  data: [
    {
      cabCategory: {
        mini: {
          cabDetails: { name: 'Ola Mini', waitTime: '5 mins away', fare: '₹80' }
        }
      },
      chaufferDetails: {
        name: 'Manjunath Reddy',
        registrationNumber: 'KA05 AF 6226',
        carModel: 'Toyota Etios',
        color: 'Silver',
        otp: '6363',
        rating: '4',
        contact: '9811223344'
      },
      location: { pickup: 'Katraj', dropOff: 'Phoenix Mall' },
      optionsList: {
        rideTimeOptionsList: [
          {
            label: 'Ride Now',
            value: 'ridenow',
            tag: 'rideTimeOptions'
          },
          {
            label: 'Ride Later',
            value: 'ridelater',
            tag: 'rideTimeOptions'
          }
        ],
        riderOptionsList: [
          {
            label: 'Myself',
            value: 'myself',
            tag: 'riderOptions'
          },
          {
            label: 'Others',
            value: 'others',
            tag: 'riderOptions'
          }
        ]
      }
    }
  ]
}

export const parsedSearchDetails = (data: SearchResponseModel[]) => {
  const itemsarray: ParsedCabDataModel[] = []
  let totalCabs: number = 0
  data.forEach((entry: any) => {
    const context = entry.context
    const message = entry.message
    const domain = context.domain
    const transactionId = context.transaction_id
    const bppId = context.bpp_id
    const bppUri = context.bpp_uri

    message.providers.forEach((provider: any) => {
      const providerId = provider.id
      const providerName = provider.name
      const image = provider.images?.[0]?.url
      const rating = provider.rating
      totalCabs += provider.items?.length

      const providerCabDetails: ParsedCabDataModel = {
        providerId,
        providerName,
        image,
        rating,
        bppId: bppId,
        bppUri: bppUri,
        domain,
        transactionId,
        cabDetails: []
      }

      provider?.items?.forEach((item: any) => {
        providerCabDetails.cabDetails.push({
          id: item.id,
          name: item.name,
          waitTime: item.wait_time,
          fare: `${item.price.value} ${item.price.currency || ''}`,
          image: './images/CabImg.svg',
          rating,
          cityName: provider.locations?.[0].city?.name
        })
      })

      itemsarray.push(providerCabDetails)
    })
  })

  return { providerDetails: itemsarray, totalCabs }
}

export const getSearchRidePayload = (start: PickUpDropOffModel, end: PickUpDropOffModel) => {
  return {
    context: {
      domain: DOMAIN
    },
    fulfillment: {
      type: 'start',
      stops: [
        {
          type: 'start',
          location: '19.9908869,73.6386689' // `${start.geoLatLong.lat},${start.geoLatLong.long}`
        },
        {
          type: 'end',
          location: '19.9908869,73.6386689' // `${end.geoLatLong.lat},${end.geoLatLong.long}`
        }
      ]
    }
  }
}

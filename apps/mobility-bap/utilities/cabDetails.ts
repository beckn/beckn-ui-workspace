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

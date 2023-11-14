export interface IProductDetails {
  processor?: string
  screen?: string
  operating_system?: string
  ram?: string
  ssd?: string
  ports?: string
  graphic?: string
  warranty?: string
  back_camera?: string
  front_camera?: string
  battery?: string
  frequency_response?: string
  microphone?: boolean
  wireless?: boolean
  wireless_standby_time?: boolean
  connectionType?: string[]
  connectors?: string[]
  bluetooth?: boolean
  noise_cancelling?: boolean
  sound_isolating?: boolean
}

export type TSlug = {
  _type: string
  current: string
}

export type TImage = {
  _key: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface IProduct {
  image: any
  name: string
  slug: TSlug
  price: number
  discount?: number
  details?: IProductDetails[]
  brand: string
  category: string[]
  isOffer?: boolean
  registerDate?: string
  timeStamp?: number
  starRating: number
}

/**
 * New types for the retail
 */

export interface RetailItem {
  extended_attributes?: any
  price: {
    listed_value?: string
    currency?: string
    value: string
  }
  matched?: boolean
  id: string
  descriptor: {
    images: string[]
    name: string
    short_desc: string
    long_desc: string
  }
  location_id?: string
  recommended?: boolean
  tags: {
    fulfillment_start_loc?: string
    Category?: string
    Trekking?: string
    Himalayas?: string
    fulfillment_end_time?: string
    Country?: string
    Ladakh?: string
    Treks?: string
    Package?: string
    Leh?: string
    fulfillment_end_loc?: string
    authorName: string
    rating: string
    foodType?: string
  }
}


export interface IndustryItem {
  extended_attributes?: any
  price: {
    currency?: string
    value: string
  }
  id: string
  descriptor: {
    images: string[]
    name: string
    short_desc: string
    long_desc: string
  }
  tags: {
    assembly?:string
    automated?:string
  }
  bppName?: string
}

return {
  price: {
    value: provider.items[0].value
  },
  id: provider.id,
  descriptor: {
    images: provider.images
    name: provider.name
    short_desc: provider.short_desc
    long_desc: provider.long_desc
  },
  tags: {
    authorName: 'Industry 4.0'
    rating:'5'
  }
}


{
  "context": {
      "transactionId": "e27ec30a-b3e3-4fc2-85f7-bc6ba2365aeb",
      "messageId": "700dc1c5-2f4b-406e-88bc-faee63c90e18",
      "bppId": "bpp.supply-chain.makerspace.io",
      "bppUri": "https://bpp.supply-chain.makerspace.io"
  },
  "serviceProviders": [
      {
          "id": "1",
          "name": "Makerspace",
          "short_desc": "Makerspace",
          "long_desc": "Makerspace, Hof.",
          "images": [
              "https://makerspace/assembly/makerspace_logo.png"
          ],
          "categories": [
              {
                  "id": "p2",
                  "code": "assembly",
                  "name": "Assembly"
              },
              {
                  "id": "p2c1",
                  "code": "classic",
                  "name": "Classic"
              },
              {
                  "id": "p2c2",
                  "code": "automated",
                  "name": "Automated"
              },
              {
                  "id": "p2c3",
                  "code": "intermittent",
                  "name": "Intermittent"
              },
              {
                  "id": "p2c4",
                  "code": "lean",
                  "name": "Lean"
              }
          ],
          "items": [
              {
                  "id": "66b7b9bad166-4a3f-ada6-ca063dc9d321",
                  "descriptor": "Intermittent assembly type",
                  "category_id": [
                      "c3"
                  ],
                  "fulfillment_id": [
                      "f1"
                  ],
                  "tags": [
                      
                      {
                          "code": "assembly-info",
                          "name": "Assembly Information",
                          "display": true
                      },
                      
                  ],
                  "currency": "EUR",
                  "value": "starting from 50 EUR"
              }
          ]
      }
  ]
}


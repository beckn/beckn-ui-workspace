import { CurrencyType } from '../../utilities/currencyFormat'

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
        currency: CurrencyType
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

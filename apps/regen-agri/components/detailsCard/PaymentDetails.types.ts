import { CurrencyType } from '../../utilities/currencyFormat'

export interface Price {
    listed_value: string
    offered_value: string
    currency: CurrencyType
    value: string
}

export interface BreakupItem {
    extended_attributes: Record<string, any>
    price: Price
    title: string
    type: string
}

export interface QuoteModel {
    breakup: BreakupItem[]
    price: Price
    ttl: string
}

export interface PaymentDetailsProps {
    qoute: QuoteModel
}

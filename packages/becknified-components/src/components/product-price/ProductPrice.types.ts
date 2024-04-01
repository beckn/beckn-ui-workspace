export interface ProductPriceProps {
  price: number
  currencyType?: CurrencyType
  color?: string
  className?: string
}

export type CurrencyType = 'GBP' | 'EUR' | 'INR' | 'USD'

import { TextVariant } from '@beckn-ui/molecules'

export interface ProductPriceProps {
  price: number
  currencyType?: CurrencyType
  color?: string
  className?: string
  variant?: TextVariant
}

export type CurrencyType = 'GBP' | 'EUR' | 'INR' | 'USD'

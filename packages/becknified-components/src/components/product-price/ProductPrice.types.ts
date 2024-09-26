import { TextVariant } from '@beckn-ui/molecules'

export interface ProductPriceProps {
  price: number
  currencyType?: CurrencyType
  color?: string
  className?: string
  variant?: TextVariant
  fontStyle?: React.CSSProperties
  colorScheme?: 'primary' | 'secondary'
  dataTestItemPrice?: string
  rateLabel?: string
}

export type CurrencyType = 'GBP' | 'EUR' | 'INR' | 'USD'

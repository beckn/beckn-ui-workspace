import { ButtonProps } from '@beckn-ui/molecules'
import { CurrencyType } from '../types'
export interface ProductCtaProps {
  currency: CurrencyType
  totalPrice: string
  rateLabel?: string
  handleIncrement?: () => void
  handleDecrement?: () => void
  counter?: number
  cta: ButtonProps
  title?: string
  counterTitle?: string
  noCounter?: boolean
  dataTestIncrementCounter?: string
  dataTestCounterValue?: string
  dataTestDecrementCounter?: string
  noPrice?: boolean
}

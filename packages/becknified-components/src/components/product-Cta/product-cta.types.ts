import { ButtonProps } from '@beckn-ui/molecules'
import { CurrencyType } from '../types'
export interface ProductCtaProps {
  currency: CurrencyType
  totalPrice: string
  handleIncrement?: () => void
  handleDecrement?: () => void
  counter?: number
  cta: ButtonProps
  counterTitle?: string
  noCounter?: boolean
  dataTestIncrementCounter?: string
  dataTestCounterValue?: string
  dataTestDecrementCounter?: string
}

import { ButtonProps } from '@beckn-ui/molecules'
export interface ProductCtaProps {
  currency: string
  totalPrice: string
  handleIncrement: () => void
  handleDecrement: () => void
  counter: number
  cta: ButtonProps
}

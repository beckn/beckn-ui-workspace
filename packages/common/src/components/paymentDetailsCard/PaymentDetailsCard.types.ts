import { TranslationProps } from '../settings/settings.types'

export interface PaymentMethod {
  paymentMethod?: string
  paymentMethodNet?: string
  img: string
  category: 'Credit & Debit Cards' | 'UPI' | 'Other'
  disabled?: boolean
  dataTest?: string
}

export interface PaymentDetailsCardProps extends TranslationProps {
  paymentMethods: PaymentMethod[]
  checkedState: string
  handleChange: (id: string) => void
}

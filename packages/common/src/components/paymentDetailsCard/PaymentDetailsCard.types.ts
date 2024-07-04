import { TranslationProps } from '../settings/settings.types'

export interface PaymentMethod {
  paymentMethod?: string
  paymentMethodNet?: string
  img: string
  category: 'Credit & Debit Cards' | 'UPI' | 'Other'
}

export interface PaymentDetailsCardProps extends TranslationProps {
  paymentMethods: PaymentMethod[]
  checkedState: string
  handleChange: (id: string) => void
}

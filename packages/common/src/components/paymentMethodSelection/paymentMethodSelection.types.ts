import { PaymentMethod } from '../paymentDetailsCard/PaymentDetailsCard.types'
import { TranslationProps } from '../settings/settings.types'

export interface PaymentMethodSelectionProps extends TranslationProps {
  paymentMethods?: PaymentMethod[]
  handleOrderConfirmation: () => void
}

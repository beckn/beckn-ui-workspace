import { TranslationProps } from '../settings/settings.types'

export interface PaymentMethodSelectionProps extends TranslationProps {
  handleOrderConfirmation: () => void
}

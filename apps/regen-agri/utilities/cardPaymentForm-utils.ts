import { PaymentFormData } from '../pages/paymentMode'

export const validateCardPaymentForm = (formData: PaymentFormData) => {
  console.log('triggered', formData)
  if (!formData.cardNumber.trim().length) {
    return false
  }

  if (!formData.expiryDate.trim().length) {
    return false
  }

  if (!formData.cvv.trim().length) {
    return false
  }

  if (!formData.country.trim().length) {
    return false
  }
  if (!formData.postalCode.trim().length) {
    return false
  }

  return true
}

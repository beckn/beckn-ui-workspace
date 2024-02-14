import { PaymentFormData } from '../pages/paymentMode'

export const validateCardPaymentForm = (formData: PaymentFormData) => {
    if (formData.cardNumber.trim().length !== 16) {
        return false
    }

    if (formData.expiryDate.trim().length !== 4) {
        return false
    }

    if (formData.cvv.trim().length !== 3) {
        return false
    }

    if (formData.country.trim().length === 0) {
        return false
    }

    if (formData.postalCode.trim().length !== 6) {
        return false
    }

    return true
}

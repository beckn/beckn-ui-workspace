import { ShippingFormData } from '../pages/checkoutPage'

export interface FormErrors {
  name?: string
  mobileNumber?: string
  email?: string
  address?: string
  zipCode?: string
}

export const validateForm = (formData: ShippingFormData): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  }

  if (formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }

  if (formData.email.trim() === '') {
    errors.email = 'errorEmail'
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = 'errorEmail2'
  }

  if (formData.address.trim() === '') {
    errors.address = 'errorAddress'
  }

  if (formData.zipCode.trim() === '') {
    errors.zipCode = 'errorZipcode'
  } else if (!/^\d{5}$/.test(formData.zipCode)) {
    errors.zipCode = 'errorZipcode2'
  }

  return errors
}

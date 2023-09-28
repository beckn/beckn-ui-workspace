import { CreateProfileFormData } from '../pages/checkoutPage'

export interface FormErrors {
  dob: string
  name?: string
  mobileNumber?: string
  email?: string
  gender?: string
}

export const validateForm = (formData: CreateProfileFormData): FormErrors => {
  const errors: FormErrors = {
    dob: ''
  }

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
  if (formData.dob.trim() === '') {
    errors.dob = 'errorDOB'
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dob)) {
    errors.dob = 'errorDOB1'
  }

  return errors
}

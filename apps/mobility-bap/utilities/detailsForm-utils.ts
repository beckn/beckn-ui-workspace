export interface FormErrors {
  name?: string
  mobileNumber?: string
}

export const validateSearchRideForm = (formData: { name: string; mobileNumber: string }): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  }

  if (formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }

  return errors
}

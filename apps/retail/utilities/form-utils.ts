import { FormErrors, SignInProps, SignUpProps, ProfileProps } from '@beckn-ui/common/lib/types'
import { ShippingFormData } from '../pages/checkout'

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
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = 'errorEmail2'
  }

  if (formData.address.trim() === '') {
    errors.address = 'errorAddress'
  }

  if (formData.zipCode.trim() === '') {
    errors.zipCode = 'errorZipcode'
  } else if (!/^\d{6}$/.test(formData.zipCode)) {
    errors.zipCode = 'errorZipcode2'
  }

  return errors
}

export const signInValidateForm = (formData: SignInProps): FormErrors => {
  const errors: FormErrors = {}

  if (formData.email.trim() === '') {
    errors.email = 'errorEmail'
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = 'errorEmail'
  }
  if (formData.password.trim() === '') {
    errors.password = 'errorPassword'
  } else if (formData.password.length < 8) {
    errors.password = 'errorPassword2'
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = 'errorPassword3'
  } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(formData.password)) {
    errors.password = 'errorPassword4'
  } else if (/^\d+$/.test(formData.password)) {
    errors.password = 'errorPassword5'
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = 'errorPassword6'
  }

  return errors
}
export const signUpValidateForm = (formData: SignUpProps): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
    errors.name = 'errorName2'
  } else if (formData.name.length < 3) {
    errors.name = 'errorName3'
  }

  if (formData.email.trim() === '') {
    errors.email = 'errorEmail'
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = 'errorEmail'
  }
  if (formData.password.trim() === '') {
    errors.password = 'errorPassword'
  } else if (formData.password.length < 8) {
    errors.password = 'errorPassword2'
  } else if (/^\d+$/.test(formData.password)) {
    errors.password = 'errorPassword3'
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = 'errorPassword4'
  } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(formData.password)) {
    errors.password = 'errorPassword5'
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = 'errorPassword6'
  }
  if (formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }
  return errors
}
export const profileValidateForm = (formData: ProfileProps): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
    errors.name = 'errorName2'
  } else if (formData.name.length < 3) {
    errors.name = 'errorName3'
  }

  if (formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }
  if (formData.zipCode.trim() === '') {
    errors.zipCode = 'errorZipcode'
  } else if (!/^\d{6}$/.test(formData.zipCode)) {
    errors.zipCode = 'errorZipcode2'
  }
  if (formData.country.trim() === '') {
    errors.country = 'errorCountry'
  } else if (!/^[A-Za-z\s]*$/.test(formData.country)) {
    errors.country = 'errorCountry1'
  }
  if (formData.state.trim() === '') {
    errors.state = 'errorState'
  } else if (!/^[A-Za-z\s]*$/.test(formData.state)) {
    errors.state = 'errorState1'
  }
  if (formData.city.trim() === '') {
    errors.city = 'errorCity'
  } else if (!/^[A-Za-z\s]*$/.test(formData.city)) {
    errors.city = 'errorCity1'
  }
  return errors
}

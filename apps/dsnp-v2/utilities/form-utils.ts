import { profilePageProp, SignInPropsModel, SignUpPropsModel } from '../components/signIn/SignIn.types'
import { ShippingFormData } from '../pages/checkout/checkout'

export interface FormErrors {
  name?: string
  mobileNumber?: string
  email?: string
  address?: string
  zipCode?: string
  password?: string
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

export const signInValidateForm = (formData: SignInPropsModel): FormErrors => {
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
export const signUpValidateForm = (formData: SignUpPropsModel): FormErrors => {
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
export const profileValidateForm = (formData: profilePageProp): FormErrors => {
  const errors: FormErrors = {}

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'errorName'
  } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
    errors.name = 'errorName2'
  } else if (formData.name.length < 3) {
    errors.name = 'errorName3'
  }

  if (!formData.mobileNumber || formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.mobileNumber = 'errorNumber2'
  }

  if (!formData.zipCode || formData.zipCode.trim() === '') {
    errors.zipCode = 'errorZipcode'
  } else if (!/^\d{6}$/.test(formData.zipCode)) {
    errors.zipCode = 'errorZipcode2'
  }

  return errors
}

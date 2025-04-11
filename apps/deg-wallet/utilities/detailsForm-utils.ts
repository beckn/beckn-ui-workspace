import { SignInPropsModel, SignUpPropsModel } from '../components/signIn/Signin.types'

export interface FormErrors {
  name?: string
  scholarshipInfo?: string
  mobileNumber?: string
  email?: string
  address?: string
  pinCode?: string
  password?: string
}

export const signInValidateForm = (formData: SignInPropsModel): FormErrors => {
  const errors: FormErrors = {}

  if (formData.email.trim() === '') {
    errors.email = 'Invalid Email'
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = 'Invalid Email'
  }
  if (formData.password.trim() === '') {
    errors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = 'Password must contain at least one uppercase letter'
  } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(formData.password)) {
    errors.password = 'Password must contain at least one special character'
  }

  return errors
}
export const signUpValidateForm = (formData: SignUpPropsModel): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'Name is required'
  } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
    errors.name = 'Name can only contain letters and spaces'
  } else if (formData.name.length < 3) {
    errors.name = 'Name must contain at least 3 characters'
  }

  if (formData.email.trim() === '') {
    errors.email = 'Invalid Email'
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = 'Invalid Email'
  }
  if (formData.password.trim() === '') {
    errors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = 'Password must contain at least one uppercase letter'
  } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(formData.password)) {
    errors.password = 'Password must contain at least one special character'
  }

  return errors
}

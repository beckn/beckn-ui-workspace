import { JobApplyFormData } from '../components/jobApply/JobApply.types'
import { ScholarshipApplyFormDataModel } from '../components/scholarship/scholarshipCard/Scholarship.types'
import { SignInPropsModel, SignUpPropsModel } from '../components/signIn/Signin.types'
import { ShippingFormData } from '../pages/checkoutPage'

export interface FormErrors {
  name?: string
  scholarshipInfo?: string
  mobileNumber?: string
  email?: string
  address?: string
  pinCode?: string
  password?: string
}

export const validateForm = (formData: ShippingFormData): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  }
  // if (formData.scholarshipInfo.trim() === '') {
  //   errors.scholarshipInfo = 'errorAboutScholarship'
  // }

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

  if (formData.pinCode.trim() === '') {
    errors.pinCode = 'errorZipcode'
  } else if (!/^\d{6}$/.test(formData.pinCode)) {
    errors.pinCode = 'errorZipcode2'
  }

  return errors
}
export const validateJobForm = (formData: JobApplyFormData): FormErrors => {
  const errors: FormErrors = {}

  if (formData.name.trim() === '') {
    errors.name = 'errorName'
  }
  // if (formData.scholarshipInfo.trim() === '') {
  //   errors.scholarshipInfo = 'errorAboutScholarship'
  // }

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

  return errors
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

import { FormErrors, SignInProps, SignUpProps, ProfileProps, ShippingFormData } from '@beckn-ui/common/lib/types'
import { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'

export interface CustomFormErrorProps extends FormErrors {
  utilityCompany?: string
  address?: string
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
export const signUpValidateForm = (formData: SignUpProps): CustomFormErrorProps => {
  console.log(formData)
  const errors: CustomFormErrorProps = {}

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
  if (formData.address.trim() === '') {
    errors.address = 'errorAddress'
  }
  if (formData?.mobileNumber?.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (!/^\d{10}$/.test(formData.mobileNumber!)) {
    errors.mobileNumber = 'errorNumber2'
  } else if (formData.utilityCompany.trim() === '') {
    errors.utilityCompany = 'errorUtilityCompany'
  }
  return errors
}

export const mobilePhoneValidate = (formData: { mobileNumber: string }, checkWithCountryCode = true): FormErrors => {
  const errors: FormErrors = {}

  if (formData.mobileNumber.trim() === '') {
    errors.mobileNumber = 'errorNumber'
  } else if (checkWithCountryCode) {
    if (!/^\+91\s?\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'errorNumber2'
    }
  } else {
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'errorNumber2'
    }
  }
  return errors
}

export const validateCredForm = (formData: FormProps): CredFormErrors => {
  const errors: CredFormErrors = {}

  if (!formData?.type) {
    errors.type = 'errorType'
  }

  if (formData?.credNumber?.trim() === '') {
    errors.credNumber = 'errorCred'
  } else if (!/^[A-Za-z0-9]{4,}$/i.test(formData.credNumber!)) {
    errors.credNumber = 'errorCred1'
  }

  if (formData?.country?.trim() === '') {
    errors.deviceLocation = 'errorSelectCountry'
  }

  if (formData?.verificationMethod?.trim() === '') {
    errors.deviceLocation = 'errorSelectVerificationMethod'
  }

  if (formData?.deviceLocation?.trim() === '') {
    errors.deviceLocation = 'errorDeviceLoc'
  }

  if (formData?.assetsMaker?.trim() === '') {
    errors.assetsMaker = 'errorAssetsMaker'
  }

  if (formData?.modelNumber?.trim() === '') {
    errors.modelNumber = 'errorModelNumber'
  }

  if (formData?.serialNumber?.trim() === '') {
    errors.serialNumber = 'errorSerialNum'
  }

  if (formData?.url?.trim() === '') {
    errors.url = 'errorUrl'
  } else if (!/^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/.test(formData.url!)) {
    errors.url = 'errorUrl1'
  }

  return errors
}

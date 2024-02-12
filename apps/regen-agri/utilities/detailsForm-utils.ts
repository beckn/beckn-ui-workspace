import {
    SignInPropsModel,
    SignUpPropsModel,
} from '../components/signIn/Signin.types'
import { ShippingFormData } from '../pages/checkoutPage'

export interface FormErrors {
    name?: string
    mobileNumber?: string
    email?: string
    address?: string
    zipCode?: string
    city?: string
    country?: string
    state?: string
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
    } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
        errors.email = 'errorEmail2'
    }
    if (formData.city.trim() === '') {
        errors.city = 'errorCity'
    }

    if (formData.country.trim() === '') {
        errors.country = 'errorCountry'
    }

    if (formData.state.trim() === '') {
        errors.state = 'errorState'
    }
    if (formData.address.trim() === '') {
        errors.address = 'errorAddress'
    }

    if (formData.zipCode.trim() === '') {
        errors.zipCode = 'errorZipcode'
    } else if (!/^\d{5}(?:\d{1})?$/.test(formData.zipCode)) {
        errors.zipCode = 'errorZipcode2'
    }

    return errors
}
export const signInValidateForm = (formData: SignInPropsModel): FormErrors => {
    const errors: FormErrors = {}

    if (formData.email.trim() === '') {
        errors.email = 'Invalid Email'
    } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
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
    } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
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
    if (formData.mobileNumber.trim() === '') {
        errors.mobileNumber = 'errorNumber'
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        errors.mobileNumber = 'errorNumber2'
    }
    return errors
}

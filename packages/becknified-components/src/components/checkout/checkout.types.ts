import { FormData, FormField, ButtonProps, LoaderProps, LoaderWithMessagePropsModel } from '@beckn-ui/molecules'
import { CurrencyType } from '../types'

export type ShippingFormInitialValuesType = {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
}

export interface ShippingFormProps<T extends FormField[]> {
  onSubmit: (data: FormData<T>) => void
  submitButton: ButtonProps
  values?: ShippingFormInitialValuesType
  onChange?: (data: ShippingFormInitialValuesType) => void
}

export interface ShippingSectionProps<T extends FormField[]> {
  shippingForm: ShippingFormProps<T>
  shippingDetails: ShippingDetailsProps
  sectionTitle?: string
  sectionSubtitle?: string
  triggerFormTitle?: string
  formTitle?: string
  showDetails?: boolean
  isBilling?: boolean
  addButtonImage?: string
  isChecked?: boolean
  onCheckChange?: () => void
  color?: string
}

export interface ItemDetailProps {
  title: string
  description: string
  quantity: number
  // priceWithSymbol: string
  image?: string
  price: number
  currency: CurrencyType
}

export interface ShippingDetailsProps {
  name: string
  location: string
  number: number | string
  title: string
}

type TotalAmountWithCurreny = {
  currency: CurrencyType
  value: string
}
export interface PaymentDetailsProps {
  paymentBreakDown: Record<string, any>
  totalText: string
  title?: string
  hasBoxShadow?: boolean
  totalValueWithCurrency: TotalAmountWithCurreny
}

export interface CheckoutProps<T extends FormField[]> {
  schema: {
    items?: {
      title: string
      data: ItemDetailProps[]
    }
    shipping: ShippingSectionProps<T>
    billing: ShippingSectionProps<T>
    payment: {
      title: string
      paymentDetails: PaymentDetailsProps
    }
    loader: LoaderProps
    pageCTA: ButtonProps
  }
  isLoading?: boolean
  hasInitResult?: boolean
}

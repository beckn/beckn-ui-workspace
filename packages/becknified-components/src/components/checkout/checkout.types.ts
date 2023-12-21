import { FormData, FormField, ButtonProps, LoaderProps } from '@beckn-ui/molecules'

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
}

export interface ItemDetailProps {
  title: string
  description: string
  quantity: number
  priceWithSymbol: string
}

export interface ShippingDetailsProps {
  name: string
  location: string
  number: number | string
  title: string
}

export interface PaymentDetailsProps {
  paymentBreakDown: Record<string, string>
  totalText: string
  totalValueWithSymbol: string
}

export interface CheckoutProps<T extends FormField[]> {
  schema: {
    items: {
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

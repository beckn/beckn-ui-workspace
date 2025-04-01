import { FormData, FormField, ButtonProps, LoaderProps } from '@beckn-ui/molecules'
import { CurrencyType } from '../types'
import { RentalItemProps } from './order-overview'

export type ShippingFormInitialValuesType = {
  name: string
  mobileNumber: string
  email: string
  address?: string
  pinCode?: string
  meterNumber?: string
}

export interface ShippingFormProps<T extends FormField[]> {
  formFieldConfig?: FormField[]
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
  sameAsTitle?: string
  triggerFormTitle?: string
  formTitle?: string
  showDetails?: boolean
  isBilling?: boolean
  addButtonImage?: string
  isChecked?: boolean
  isDisabled?: boolean
  onCheckChange?: () => void
  color?: string
  dataTest?: string
  dataTestChangeFormText?: string
  dataTestCheckbox?: string
  dataTestOpenForm?: string
}

export interface ItemDetailProps {
  title: string
  description?: string
  quantity: number
  image?: string
  price: number
  currency: CurrencyType
  dataTestTitle?: string
  dataTestQuantity?: string
  dataTestDescription?: string
}

export interface ShippingDetailsProps {
  name: string
  location: string
  number: number | string
  title: string
  noAccordion?: boolean
}

type TotalAmountWithCurreny = {
  currency: CurrencyType
  value: string | number
}
export interface PaymentDetailsProps {
  paymentBreakDown: Record<string, any>
  totalText: string
  title?: string
  hasBoxShadow?: boolean
  totalValueWithCurrency: TotalAmountWithCurreny
  dataTest?: string
  dataTestTotalPayment?: string
}

export interface CheckoutProps<T extends FormField[]> {
  schema: {
    items?: {
      type?: string
      title: string
      data?: ItemDetailProps[] | RentalItemProps[]
    }
    shipping?: ShippingSectionProps<T>
    billing?: ShippingSectionProps<T>
    payment: {
      title: string
      paymentDetails: PaymentDetailsProps
    }
    loader: LoaderProps
    pageCTA: ButtonProps
  }
  isLoading?: boolean
  hasInitResult?: boolean
  dataTestItemDetails?: string
  dataTestPaymentDetails?: string
}

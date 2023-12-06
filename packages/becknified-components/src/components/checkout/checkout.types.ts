import { FormData, FormField, ButtonProps } from '@beckn-ui/molecules'

export interface ShippingFormProps<T extends FormField[]> {
  onSubmit: (data: FormData<T>) => void
  submitButton: ButtonProps
}

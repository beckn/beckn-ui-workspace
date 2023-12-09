import { ButtonProps, InputType } from '../types'

export interface FormField {
  name: string
  label: string
  type: InputType
  className?: string
  options?: Array<{ label: string; value: string }>
  validate?: (value: any) => string | undefined
}

export type FormData<T extends FormField[]> = {
  [P in T[number]['name']]: string
}

export type FormErrors = {
  [key: string]: string | undefined
}

export interface FormProps<T extends FormField[]> {
  fields: T
  onSubmit: (data: FormData<T>) => void
  onFieldChange?: () => void
  submitButton: ButtonProps
  values?: FormData<T>
  onChange?: (data: FormData<T>) => void
}

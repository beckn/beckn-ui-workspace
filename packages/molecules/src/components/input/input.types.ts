import { SystemStyleObject } from '@chakra-ui/react'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'select'

export enum InputTypeEnum {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number',
  Checkbox = 'checkbox'
}

//TODO type and variant to be changed into enum
export interface InputProps {
  type: InputType
  variant?: string
  placeholder?: string
  name: string
  value: string
  className?: string
  error?: string
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  label?: string
  dataTest?: string
  disabled?: boolean
  options?: { label: string; value: string }[]
  readOnly?: boolean
  sx?: SystemStyleObject
  rightElement?: () => React.ReactElement<any, any> | null
  customInputBlurHandler?: React.FocusEventHandler<HTMLInputElement>
}
export interface signInField {
  name: string
  type: InputType
  validate?: (value: any) => string | undefined
}

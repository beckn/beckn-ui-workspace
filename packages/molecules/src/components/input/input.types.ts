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
  rightElement?: () => React.ReactElement<any, any> | null
}
export interface signInField {
  name: string
  type: InputType
  validate?: (value: any) => string | undefined
}

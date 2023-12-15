export type InputType = 'text' | 'password' | 'email' | 'number'

export enum InputTypeEnum {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number'
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
}
export interface signInField {
  name: string
  type: InputType
  validate?: (value: any) => string | undefined
}

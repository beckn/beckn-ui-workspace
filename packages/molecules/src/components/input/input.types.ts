//TODO type and variant to be changed into enum
export interface InputProps {
  type: string
  variant?: string
  placeholder?: string
  name: string
  value: string
  className?: string
  error?: string
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  label?: string
}

export interface SearchBarProps {
  searchString: string | string[] | undefined
  selectedInput?: string | string[] | undefined
  handleChange: Function
  placeholder?: string
  handleOnFocus?: React.FocusEventHandler<HTMLInputElement> | undefined
}

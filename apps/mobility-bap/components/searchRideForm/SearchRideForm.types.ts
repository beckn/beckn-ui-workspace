type Options = {
  label: string
  value: string
  tag: string
}

export interface SearchRideFormProps {}

export interface CustomDropDownProps {
  items: {
    value: string
    label: string
    tag: string
  }[]
  value: string

  onChange: (newValue: string, tag: string) => void
}

type Options = {
  label: string
  value: string
  tag: string
}

export interface SearchRideFormProps {
  cabDetails: {
    name: string
    waitTime: string
    fare: string
  }
  location: {
    pickup: string
    dropOff: string
  }
  optionsList: {
    rideTimeOptionsList: Options[]
    riderOptionsList: Options[]
  }
}

export interface CustomDropDownProps {
  items: {
    value: string
    label: string
    tag: string
  }[]
  value: string

  onChange: (newValue: string, tag: string) => void
}

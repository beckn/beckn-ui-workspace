export interface SignInPropsModel {
  // buttonClickHandler: React.MouseEventHandler<HTMLButtonElement> | undefined
  email: string
  password: string
}
export interface SignUpPropsModel {
  name: string
  email: string
  password: string
  mobileNumber: string
}

export interface profilePageProp {
  name: string
  mobileNumber: string
  flatNumber: string
  street: string
  city: string
  zipCode: string
  state: string
  country: string
}

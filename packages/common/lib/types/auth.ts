// User related models
export interface User {
  blocked: boolean
  confirmed: boolean
  createdAt: Date
  email: string
  id: number
  provider: string
  updatedAt: Date
  username: string
}

// Sign-In related models
export interface SignInFormProps {
  email: string
  password: string
}

export interface SignInRequest {
  identifier: string
  password: string
}

export interface SignInResponse {
  user: User
  jwt: string
}

// Sign-Up related models
export interface SignUpFormProps {
  name: string
  email: string
  password: string
  mobileNumber: string
}

export interface SignUpRequest {
  email: string
  mobile: string
  password: string
  username: string
}

export interface SignUpResponse {
  user: User
  jwt: string
}

// Profile related models
export interface ProfileProps {
  name: string
  mobileNumber: string | null
  flatNumber: string | null
  street: string
  city: string
  zipCode: string
  state: string
  country: string
}

// components related models
export interface LogoDetails {
  src: string
  alt: string
}

export interface Logos {
  mobile: LogoDetails
  desktop: LogoDetails
}

export interface SignInComponentProps {
  logos: Logos
  onSignIn: () => void
  onSignUp: () => void
  initialFormData?: SignInFormProps
  t: (key: string) => string
}

export interface SignUpComponentProps {
  baseUrl: string
  logos: Logos
  onSignIn: () => void
  onSignUp: () => void
  initialFormData?: SignUpFormProps
  t: (key: string) => string
}

// User related models
interface User {
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
export interface SignInProps {
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
export interface SignUpProps {
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
  mobileNumber: string
  flatNumber: string
  street: string
  city: string
  zipCode: string
  state: string
  country: string
}

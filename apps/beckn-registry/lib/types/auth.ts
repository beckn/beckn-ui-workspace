export interface ApiError {
  status: number
  message: string
  data?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface User {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  fullName: string
  phoneNumber: string
  alternatePhoneNumber: string
  emailVerified: boolean
  accountStatus: string
  publishedAt: string
  role?: {
    id: number
    documentId: string
    name: string
    description: string
    type: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface AuthResponse {
  jwt: string
  user: User
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  token: string | null
}

export interface ApiErrorResponse {
  message?: string
  error?: {
    message?: string
  }
  statusCode?: number
}

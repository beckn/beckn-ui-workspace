import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface LoginResponse {
  user: {
    id: string
    email: string
    name?: string
  }
  jwt: string
}

interface RegisterResponse {
  user: {
    id: string
    email: string
  }
  message: string
}

interface ApiErrorResponse {
  message?: string
  error?: {
    message?: string
  }
  statusCode?: number
}

interface CleanedResponse<T> {
  data: T
  status: number
  statusText: string
}

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Try to get the error message from the API response
    const data = error.response?.data as ApiErrorResponse
    if (data?.message) {
      return data.message
    }
    if (data?.error) {
      return data.error.message || 'Something went wrong. Please try again.'
    }

    // If no API message, check for network or request errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.'
    }
  }
  // Default error message
  return 'Something went wrong. Please try again.'
}

// Helper function to clean Axios response for Redux
const cleanAxiosResponse = <T>(response: AxiosResponse<T>): CleanedResponse<T> => {
  const { data, status, statusText } = response
  return { data, status, statusText }
}

const authService = {
  async login(credentials: { identifier: string; password: string }): Promise<CleanedResponse<LoginResponse>> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/local`, credentials)
      if (response.data.jwt) {
        Cookies.set('auth_token', response.data.jwt, COOKIE_OPTIONS)
      }
      return cleanAxiosResponse(response)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async register(email: string, password: string): Promise<CleanedResponse<RegisterResponse>> {
    try {
      const response = await axios.post<RegisterResponse>(`${API_URL}/signup`, { email, password })
      return cleanAxiosResponse(response)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async verifyEmail(token: string): Promise<CleanedResponse<{ message: string }>> {
    try {
      const response = await axios.get<{ message: string }>(`${API_URL}/auth/email-confirmation?confirmation=${token}`)
      return cleanAxiosResponse(response)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async logout(): Promise<void> {
    try {
      Cookies.remove('auth_token')
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getCurrentUser(): Promise<CleanedResponse<{ user: LoginResponse['user'] }>> {
    try {
      const token = Cookies.get('auth_token')
      if (!token) {
        throw new Error('No token found')
      }
      const response = await axios.get<{ user: LoginResponse['user'] }>(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return cleanAxiosResponse(response)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  getAuthToken(): string | undefined {
    return Cookies.get('auth_token')
  }
}

// Add axios interceptor to automatically add auth token to requests
axios.interceptors.request.use(config => {
  const token = Cookies.get('auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default authService

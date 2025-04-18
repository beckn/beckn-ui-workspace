import { BaseApi } from './baseApi'

interface LoginCredentials {
  identifier: string
  password: string
}

interface AuthResponse {
  jwt: string
  user: {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
}

interface EmailConfirmationResponse {
  jwt: string
  user: AuthResponse['user']
}

interface SendEmailConfirmationRequest {
  email: string
}

export class AuthService extends BaseApi {
  constructor() {
    super(process.env.NEXT_PUBLIC_DEDI_REGISTRY_URL || '')
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/registry/auth/local', credentials)
    this.setToken(response.jwt)
    return response
  }

  async logout(): Promise<void> {
    this.removeToken()
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    return this.get<AuthResponse['user']>('/users/me')
  }

  async confirmEmail(confirmationToken: string): Promise<EmailConfirmationResponse> {
    return this.get<EmailConfirmationResponse>(`/registry/auth/email-confirmation?confirmation=${confirmationToken}`)
  }

  async sendEmailConfirmation(email: string): Promise<void> {
    const request: SendEmailConfirmationRequest = { email }
    await this.post('/registry/auth/send-email-confirmation', request)
  }
}

export const authService = new AuthService()

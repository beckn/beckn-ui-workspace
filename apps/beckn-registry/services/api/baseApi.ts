import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

export class BaseApi {
  protected api: AxiosInstance
  protected baseURL: string
  protected readonly TOKEN_COOKIE_NAME = 'auth_token'

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.api.interceptors.request.use(
      config => {
        const token = this.getToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    this.api.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response) {
          return Promise.reject({
            status: error.response.status,
            data: error.response.data,
            message: error.message
          })
        } else if (error.request) {
          return Promise.reject({
            status: 0,
            message: 'No response received from server'
          })
        } else {
          return Promise.reject({
            status: 0,
            message: error.message
          })
        }
      }
    )
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config)
    return response.data
  }

  protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config)
    return response.data
  }

  protected async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config)
    return response.data
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config)
    return response.data
  }

  protected setToken(token: string): void {
    Cookies.set(this.TOKEN_COOKIE_NAME, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    })
  }

  protected removeToken(): void {
    Cookies.remove(this.TOKEN_COOKIE_NAME, { path: '/' })
  }

  protected getToken(): string | undefined {
    return Cookies.get(this.TOKEN_COOKIE_NAME)
  }
}

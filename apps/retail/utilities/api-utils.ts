import axios, { AxiosRequestConfig } from 'axios'

/**
 * Fetch utility with proper cache control headers
 * @param url The URL to fetch
 * @param options Additional axios request options
 * @returns Promise with the axios response
 */
export const fetchWithCacheControl = async (url: string, options: AxiosRequestConfig = {}) => {
  const defaultHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  }

  const requestOptions: AxiosRequestConfig = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  return axios(url, requestOptions)
}

/**
 * Adds cache control headers to all axios requests
 */
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(config => {
    // Add cache control headers to all requests
    config.headers = {
      ...config.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    }

    return config
  })
}

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { feedbackActions } from '../store/ui-feedback-slice'

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as any).auth.jwt
    if (token) {
      headers.set('authentication', `Bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithRetry(args, api, extraOptions)

  if (result.error) {
    // Handle network errors
    if (result.error.status === 'FETCH_ERROR' || result.error.status === 'PARSING_ERROR') {
      const errorMessage = result.error.error?.toString() || 'Network Error'
      if (errorMessage.includes('ERR_NETWORK_CHANGED')) {
        api.dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Network Error',
              display: true,
              type: 'error',
              description: 'Network connection changed. Please check your connection and try again.'
            }
          })
        )
      } else {
        api.dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Network Error',
              display: true,
              type: 'error',
              description: 'Please check your internet connection and try again.'
            }
          })
        )
      }
    } else if (result.error.status === 400) {
      const { message } = (result.error.data as { error: { message: string } })?.error || {
        message: 'Something went wrong'
      }
      api.dispatch(
        feedbackActions.setToastData({
          toastData: { message: 'Error!', display: true, type: 'error', description: message }
        })
      )
    }
  }

  return result
}

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
const api = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: 'splitApi',
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithReauth,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: ['Auth'],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({})
})

export default api

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { feedbackActions } from '@beckn-ui/common'
import { checkTokenExpiry } from '@utils/general'
import Cookies from 'js-cookie'

const baseQueryWithTokenCheck = async (args: any, api: any, extraOptions: any) => {
  const token = Cookies.get('authToken')

  if (token && checkTokenExpiry(token)) {
    // Handle token expiration (e.g., redirect to login or refresh token)
    return { error: { status: 401, data: { error: { message: 'Token expired, please log in again!' } } } }
  }

  // Create our baseQuery instance
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as any).auth.jwt
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  })

  return baseQuery(args, api, extraOptions)
}

const baseQueryWithRetry = retry(baseQueryWithTokenCheck, { maxRetries: 0 })

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithRetry(args, api, extraOptions)
  if (result.error && result.error.status === 400) {
    const { message } = (result.error.data as any)?.error || 'Something went wrong'
    api.dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Error!', display: true, type: 'error', description: message }
      })
    )
  }
  if (result.error && result.error.status === 401) {
    const { message } = (result.error.data as any)?.error || 'Something went wrong'
    const userConfirmed = window.confirm(message)
    if (userConfirmed) {
      localStorage.clear()
      Cookies.remove('authToken')
      window.location.href = '/'
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

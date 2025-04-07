import { feedbackActions } from '@beckn-ui/common'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry
} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BECKN_DID_URL
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithRetry(args, api, extraOptions)
  if (result.error && result.error.status === 400) {
    console.log(result)
    let message = (result.error.data as any)?.error || 'Something went wrong'
    if ((result.error.data as any)?.status === 'FAILED') {
      message = 'Document already present'
    }
    api.dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Error!', display: true, type: 'error', description: message }
      })
    )
  }
  return result
}

const didApi = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: 'didApi',
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithReauth,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: ['DID'],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({})
})

export default didApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
// Assuming User is a type representing the user object in your application
import type { User } from './types'

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL
  }),
  tagTypes: ['User'], // Changed from 'Post' to 'User'
  endpoints: build => ({
    // The mutation accepts login credentials and returns user data
    useSignInMutation: build.mutation<User, { email: string; password: string }>({
      // The query that sends the login credentials to the backend
      query: credentials => ({
        url: `signin`, // Endpoint for the sign-in operation
        method: 'POST', // Changed from 'PATCH' to 'POST'
        body: credentials // Sends the email and password
      }),
      // Transform the response to directly return the user data
      transformResponse: (response: { data: User }) => {},
      // Optional: Customize error handling if needed
      transformErrorResponse: (response: { status: string | number }) => response.status,
      // Invalidate user-related data as needed, or manage cache/tags based on your app's logic
      invalidatesTags: ['User'],
      // Optional: Implement onQueryStarted for optimistic updates or additional side effects
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Example: Handle optimistic updates or trigger additional actions
      }
      // Optional: Implement onCacheEntryAdded for cache-related side effects
    })
  })
})

export default api

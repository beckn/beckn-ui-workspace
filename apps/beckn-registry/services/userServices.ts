import api from './api'

interface User {
  id: number
  documentId: string
  username: string
  fullName: string
  email: string
  phoneNumber: string
  alternatePhoneNumber: string
  emailVerified: boolean
  blocked: boolean
  accountStatus: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  role: {
    id: number
    documentId: string
    name: string
    description: string
    type: string
    createdAt: string
    updatedAt: string
  }
}

type UsersResponse = {
  results: User[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getCurrentUser: build.query<User, void>({
      query: () => '/users/me'
    }),
    updateCurrentUser: build.mutation<User, Record<string, string | boolean>>({
      query: profileData => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData
      })
    }),
    getUsers: build.query<UsersResponse, { page: number; pageSize: number; searchQuery?: string }>({
      query: ({ page, pageSize, searchQuery }) => {
        const params: Record<string, string | number> = {
          'populate[0]': 'role',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize
        }

        if (searchQuery) {
          params['filters[$or][0][username][$contains]'] = searchQuery
          params['filters[$or][1][fullName][$contains]'] = searchQuery
          params['filters[$or][2][email][$contains]'] = searchQuery
          params['filters[$or][3][phoneNumber][$contains]'] = searchQuery
          params['filters[$or][4][alternatePhoneNumber][$contains]'] = searchQuery
        }

        return {
          url: '/users',
          params
        }
      },
      providesTags: result =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }]
    }),
    getUserById: build.query<User, string>({
      query: id => ({
        url: `/users/${id}`,
        params: {
          'populate[0]': 'role'
        }
      }),
      providesTags: (result, error, id) => [{ type: 'User' as const, id }]
    }),
    addUser: build.mutation<User, Partial<User>>({
      query: userData => ({
        url: '/users',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: [{ type: 'User' as const, id: 'LIST' }]
    }),
    updateUser: build.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' }
      ]
    }),
    deleteUser: build.mutation<void, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' }
      ]
    })
  })
})

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi

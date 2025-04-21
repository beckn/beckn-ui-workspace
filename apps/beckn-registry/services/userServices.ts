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

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getCurrentUser: build.query<User[], void>({
      query: () => '/users/me'
    }),
    updateCurrentUser: build.mutation<User, Record<string, string | boolean>>({
      query: profileData => ({
        url: '/users/me',
        method: 'PUT',
        body: profileData
      })
    }),
    getUsers: build.query<User[], { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => ({
        url: '/users',
        params: {
          'populate[0]': 'role',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize
        }
      }),
      providesTags: result =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User' as const, id: 'LIST' }]
          : [{ type: 'User' as const, id: 'LIST' }]
    }),
    getUserById: build.query<User, number>({
      query: id => ({
        url: `/user/${id}`,
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
    updateUser: build.mutation<User, { id: number; data: Partial<User> }>({
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

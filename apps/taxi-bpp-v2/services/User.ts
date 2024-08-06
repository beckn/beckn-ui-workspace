import { SignInResponse, user } from '@beckn-ui/common'

interface SignInRequest {
  email: string
  password: string
}

const extendedAuthApi = user.injectEndpoints({
  endpoints: build => ({
    driverLogin: build.mutation<SignInResponse, SignInRequest>({
      query: credentials => ({
        url: '/driver-app/login',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useDriverLoginMutation } = extendedAuthApi

export const {
  endpoints: { driverLogin }
} = extendedAuthApi

export default extendedAuthApi

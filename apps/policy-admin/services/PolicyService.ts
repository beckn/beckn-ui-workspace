import Api from './api'

export interface NewRideRequest {}

const policyApi = Api.injectEndpoints({
  endpoints: build => ({
    createPolicy: build.mutation<any, any>({
      query: payload => ({
        url: '/policy',
        method: 'POST',
        body: payload
      })
    })
  })
})

export const { useCreatePolicyMutation } = policyApi

export const {
  endpoints: { createPolicy }
} = policyApi

export default policyApi

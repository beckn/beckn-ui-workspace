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
    }),
    dashboard: build.mutation<any, any>({
      query: payload => ({
        url: '/dashboard',
        method: 'GET'
      })
    }),
    getPolicyDetails: build.mutation<any, any>({
      query: payload => {
        return {
          url: `/policy/${payload.policyId}`,
          method: 'GET'
        }
      }
    }),
    getAllPolicies: build.mutation<any, any>({
      query: payload => {
        const queryParams = new URLSearchParams(payload).toString()
        return {
          url: `/policy?${queryParams}`,
          method: 'GET'
        }
      }
    }),
    updatePolicy: build.mutation<any, any>({
      query: payload => {
        return {
          url: '/policy',
          method: 'PATCH',
          body: payload
        }
      }
    })
  })
})

export const {
  useCreatePolicyMutation,
  useDashboardMutation,
  useGetAllPoliciesMutation,
  useGetPolicyDetailsMutation,
  useUpdatePolicyMutation
} = policyApi

export const {
  endpoints: { createPolicy, dashboard, getAllPolicies, getPolicyDetails, updatePolicy }
} = policyApi

export default policyApi

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
    })
  })
})

export const { useCreatePolicyMutation, useDashboardMutation, useGetAllPoliciesMutation, useGetPolicyDetailsMutation } =
  policyApi

export const {
  endpoints: { createPolicy, dashboard, getAllPolicies, getPolicyDetails }
} = policyApi

export default policyApi

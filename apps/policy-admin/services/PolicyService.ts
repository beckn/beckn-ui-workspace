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

export const { useCreatePolicyMutation, useDashboardMutation, useGetAllPoliciesMutation } = policyApi

export const {
  endpoints: { createPolicy, dashboard, getAllPolicies }
} = policyApi

export default policyApi

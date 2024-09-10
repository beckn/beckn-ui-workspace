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
    })
  })
})

export const { useCreatePolicyMutation, useDashboardMutation } = policyApi

export const {
  endpoints: { createPolicy, dashboard }
} = policyApi

export default policyApi

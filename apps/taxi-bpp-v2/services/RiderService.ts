import Api from './api'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { NewRideResponse } from '@lib/types/ride'

export interface RiderRequest {
  available?: boolean
  location: { lat: string; long: string }
}

export interface RiderResponse {
  data:
    | {
        toggleAvailabiltiyResponse?: Record<string, any>
        updateLocationResponse: Record<string, any>
      }
    | {
        error: FetchBaseQueryError | SerializedError
      }
}

export interface NewRideRequest {}

const riderApi = Api.injectEndpoints({
  endpoints: build => ({
    toggleAvailability: build.mutation<RiderResponse, RiderRequest>({
      query: payload => ({
        url: '/driver-app/toggle-availability',
        method: 'POST',
        body: payload
      })
    }),
    updateDriverLocation: build.mutation<RiderResponse, RiderRequest>({
      query: payload => ({
        url: '/driver-app/update-location',
        method: 'POST',
        body: payload
      })
    }),
    getNewRideRequest: build.mutation<NewRideResponse, NewRideRequest>({
      query: payload => ({
        url: '/driver-app/show-rides',
        method: 'POST',
        body: payload
      })
    }),
    updateRideStatus: build.mutation<any, any>({
      query: payload => ({
        url: '/driver-app/rides',
        method: 'POST',
        body: payload
      })
    }),
    getRideSummary: build.mutation<any, any>({
      query: payload => ({
        url: '/driver-app/ride-summary',
        method: 'POST',
        body: payload
      })
    }),
    getMyProfile: build.mutation<any, any>({
      query: payload => ({
        url: '/driver-app/me',
        method: 'POST',
        body: payload
      })
    })
  })
})

export const {
  useToggleAvailabilityMutation,
  useGetNewRideRequestMutation,
  useUpdateDriverLocationMutation,
  useUpdateRideStatusMutation,
  useGetRideSummaryMutation,
  useGetMyProfileMutation
} = riderApi

export const {
  endpoints: {
    toggleAvailability,
    getNewRideRequest,
    updateDriverLocation,
    updateRideStatus,
    getRideSummary,
    getMyProfile
  }
} = riderApi

export default riderApi

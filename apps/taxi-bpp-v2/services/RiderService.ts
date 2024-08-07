import Api from './api'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

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

const riderApi = Api.injectEndpoints({
  endpoints: build => ({
    toggleAvailability: build.mutation<RiderResponse, RiderRequest>({
      query: payload => ({
        url: '/driver-app/toggle-availability',
        method: 'POST',
        body: payload
      })
    }),
    updateLocation: build.mutation<RiderResponse, RiderRequest>({
      query: payload => ({
        url: '/driver-app/update-location',
        method: 'POST',
        body: payload
      })
    })
  })
})

export const { useToggleAvailabilityMutation } = riderApi

export const {
  endpoints: { toggleAvailability }
} = riderApi

export default riderApi

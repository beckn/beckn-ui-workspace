import Api from './api'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export interface ToggleAvailabilityRequest {
  available: boolean
  location: { lat: string; long: string }
}

export interface ToggleAvailabilityResponse {
  data:
    | {
        toggleAvailabiltiyResponse: Record<string, any>
        updateLocationResponse: Record<string, any>
      }
    | {
        error: FetchBaseQueryError | SerializedError
      }
}

const riderApi = Api.injectEndpoints({
  endpoints: build => ({
    toggleAvailability: build.mutation<ToggleAvailabilityResponse, ToggleAvailabilityRequest>({
      query: payload => ({
        url: '/driver-app/toggle-availability',
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

/**
 * Discover API service (Beckn 2.0).
 * Independent: only calls discover endpoint with payload from discoverPayload builder.
 */
import axios, { AxiosInstance } from 'axios'
import { config } from '@utils/config'
import type { DiscoverRequest, DiscoverResponse } from '@lib/types/beckn-2.0/discover.types'

function createClient(): AxiosInstance {
  const baseURL = config.getBecknApiUrl()
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  })
}

export async function callDiscover(payload: DiscoverRequest): Promise<DiscoverResponse> {
  const client = createClient()
  const res = await client.post<DiscoverResponse | { data: DiscoverResponse }>('/discover', payload)
  const data = res.data
  if (data && typeof data === 'object' && 'data' in data && data.data) {
    return data.data as DiscoverResponse
  }
  return data as DiscoverResponse
}

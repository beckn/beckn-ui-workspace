/**
 * Init API service (Beckn 2.0).
 * Independent: only calls init endpoint with payload from initPayload builder.
 */
import axios, { AxiosInstance } from 'axios'
import { config } from '@utils/config'
import type { InitRequest, InitResponse } from '@lib/types/beckn-2.0/init.types'

function createClient(): AxiosInstance {
  const baseURL = config.getBecknApiUrl()
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  })
}

export async function callInit(payload: InitRequest): Promise<InitResponse> {
  const client = createClient()
  const res = await client.post<InitResponse | { data: InitResponse }>('/init', payload)
  const data = res.data
  if (data && typeof data === 'object' && 'data' in data && data.data) {
    return data.data as InitResponse
  }
  return data as InitResponse
}

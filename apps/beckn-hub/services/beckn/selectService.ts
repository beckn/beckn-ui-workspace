/**
 * Select API service (Beckn 2.0).
 * Independent: only calls select endpoint with payload from selectPayload builder.
 */
import axios, { AxiosInstance } from 'axios'
import { config } from '@utils/config'
import type { SelectRequest, SelectResponse } from '@lib/types/beckn-2.0/select.types'

function createClient(): AxiosInstance {
  const baseURL = config.getBecknApiUrl()
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  })
}

export async function callSelect(payload: SelectRequest): Promise<SelectResponse> {
  const client = createClient()
  const res = await client.post<SelectResponse | { data: SelectResponse }>('/select', payload)
  const data = res.data
  if (data && typeof data === 'object' && 'data' in data && data.data) {
    return data.data as SelectResponse
  }
  return data as SelectResponse
}

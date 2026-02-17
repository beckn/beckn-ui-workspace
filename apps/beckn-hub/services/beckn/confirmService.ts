/**
 * Confirm API service (Beckn 2.0).
 * Independent: only calls confirm endpoint with payload from confirmPayload builder.
 */
import axios, { AxiosInstance } from 'axios'
import { config } from '@utils/config'
import type { ConfirmRequest, ConfirmResponse } from '@lib/types/beckn-2.0/confirm.types'

function createClient(): AxiosInstance {
  const baseURL = config.getBecknApiUrl()
  return axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  })
}

export async function callConfirm(payload: ConfirmRequest): Promise<ConfirmResponse> {
  const client = createClient()
  const res = await client.post<ConfirmResponse | { data: ConfirmResponse }>('/confirm', payload)
  const data = res.data
  if (data && typeof data === 'object' && 'data' in data && data.data) {
    return data.data as ConfirmResponse
  }
  return data as ConfirmResponse
}

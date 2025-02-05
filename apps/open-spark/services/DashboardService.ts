import { ROLE, ROUTE_TYPE } from '@lib/config'
import Api from './api'

interface DashboardMetrics {
  previous_month: number
  current_month: number
  average: number
  totalInRange: number
}

interface DashboardData {
  consumption: DashboardMetrics
  production: DashboardMetrics
}

interface DashboardApiResponse {
  data: DashboardData
}

const dashboardApi = Api.injectEndpoints({
  endpoints: build => ({
    tradeDashboard: build.mutation<DashboardApiResponse, { startDate: string; endDate: string; credentials: string }>({
      query: ({ startDate, endDate, credentials }) => ({
        url: `${ROUTE_TYPE[ROLE.GENERAL]}/dashboard`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${credentials}`
        },
        params: {
          startDate,
          endDate
        }
      })
    })
  })
})

export const { useTradeDashboardMutation } = dashboardApi

export const {
  endpoints: { tradeDashboard }
} = dashboardApi

export default dashboardApi

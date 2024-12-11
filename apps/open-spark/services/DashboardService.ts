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
    bppTradeDashboard: build.query<DashboardApiResponse, { startDate: string; endDate: string; credentials: string }>({
      query: ({ startDate, endDate, credentials }) => ({
        url: `/beckn-trade-bpp/dashboard`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${credentials}`
        },
        params: {
          startDate,
          endDate
        }
      })
    }),
    bapTradeDashboard: build.query<DashboardApiResponse, { startDate: string; endDate: string; credentials: string }>({
      query: ({ startDate, endDate, credentials }) => ({
        url: `/beckn-trade-bap/dashboard`,
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

export const { useBapTradeDashboardQuery, useBppTradeDashboardQuery } = dashboardApi

export const {
  endpoints: { bppTradeDashboard, bapTradeDashboard }
} = dashboardApi

export default dashboardApi

import Api from './api'

interface DashboardMetrics {
  previous_month: number
  current_month: number
  average: number
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
    bppTradeDashboard: build.query<DashboardApiResponse, void>({
      query: credentials => ({
        url: '/beckn-trade-bpp/dashboard',
        method: 'GET',
        body: credentials
      })
    }),
    bapTradeDashboard: build.query<DashboardApiResponse, void>({
      query: credentials => ({
        url: '/beckn-trade-bap/dashboard',
        method: 'GET',
        body: credentials
      })
    })
  })
})

export const { useBapTradeDashboardQuery, useBppTradeDashboardQuery } = dashboardApi

export const {
  endpoints: { bppTradeDashboard, bapTradeDashboard }
} = dashboardApi

export default dashboardApi

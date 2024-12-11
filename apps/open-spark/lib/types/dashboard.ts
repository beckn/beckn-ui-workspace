export interface TradeData {
  id: number
  quantity: number
  price: number | null
}

export interface CurrentTradeData {
  name: string
  label: string
  value: string
  disabled?: boolean
  symbol: string
}
export type StatusItem = {
  label: string | React.ReactNode
  status?: string
  statusTime?: string
  noLine: boolean
  lastElement: boolean
}
export interface DashboardData {
  previous_month: number
  current_month: number
  average: number
}

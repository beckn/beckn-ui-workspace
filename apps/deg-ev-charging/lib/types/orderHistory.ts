export interface ChargingSession {
  bppId: string
  bppUri: string
  id: string
  name: string
  type: string
  duration: string
  cost: number
  date: string
  status: 'In Progress' | 'Completed'
}

export interface ChargingHistoryResponse {
  activeSession: ChargingSession[]
  history: ChargingSession[]
}

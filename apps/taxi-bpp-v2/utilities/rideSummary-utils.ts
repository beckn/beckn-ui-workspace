export interface RideSummaryModalProp {
  orderId: string
  distance: string
  time: string
  date: string
  source: string
  destination: string
  cost: string
}

export const parseRideSummaryData = (data: any): RideSummaryModalProp => {
  const rideSummaryResponse = data?.data?.data
  return {
    orderId: rideSummaryResponse.order_id.id,
    distance: rideSummaryResponse.total_distance_in_km,
    time: formatTime(rideSummaryResponse.updatedAt),
    date: formatDate(rideSummaryResponse.updatedAt),
    source: rideSummaryResponse.stops[0].address,
    destination: rideSummaryResponse.stops[1].address,
    cost: rideSummaryResponse.total_price_in_rs
  }
}

// Helper function to format the time
function formatTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Helper function to format the date
function formatDate(dateTime: string): string {
  const date = new Date(dateTime)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${dayName}, ${day}/${month}/${year}`
}

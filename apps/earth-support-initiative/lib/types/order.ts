export const statusMap = {
  DATA_REQUESTED: 'Data Requested',
  ORDER_RECEIVED: 'Data Requested',
  REQUEST_SHARED: 'Request Status',
  Cancelled: 'Order Cancelled!'
}

export type StatusMap = typeof statusMap
export type StatusKey = keyof StatusMap

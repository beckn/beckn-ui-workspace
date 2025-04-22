export const statusMap = {
  IN_PROGRESS: 'Processing your order',
  PaymentSettled: 'Ready to ship',
  Cancelled: 'Order Cancelled!',
  Shipped: 'Order Shipped',
  ORDER_DELIVERED: 'Order Delivered'
}

export type StatusMap = typeof statusMap
export type StatusKey = keyof StatusMap

export const parentStatusMap = {
  ACTIVE: 'In Progress',
  COMPLETE: 'Completed',
  CANCELLED: 'Cancelled'
}

export type ParentStatusMap = typeof parentStatusMap
export type ParentStatusKey = keyof ParentStatusMap

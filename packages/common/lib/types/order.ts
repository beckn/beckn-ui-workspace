export const statusMap = {
  ArrangingPayment: 'Processing your order',
  PaymentSettled: 'Ready to ship',
  Cancelled: 'Order Cancelled!',
  Shipped: 'Order Shipped',
  Delivered: 'Order Delivered',
  ORDER_RECEIVED: 'Processing your order',
  ORDER_DISPATCHED: 'Order Dispatched',
  COMPLETE: 'Order Delivered'
}

export type StatusMap = typeof statusMap
export type StatusKey = keyof StatusMap

export interface OrderStatus {
  label: string
  statusTime: string
}

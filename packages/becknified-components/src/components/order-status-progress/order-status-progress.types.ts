export interface OrderStatusProgressProps {
  label: string | React.ReactNode
  statusTime: string
  className?: string
  noLine?: boolean
  lastElement?: boolean
  dataTestStateName?: string
  dataTestStateTime?: string
  statusDescription?: string
  dataTestStateDescription?: string
}

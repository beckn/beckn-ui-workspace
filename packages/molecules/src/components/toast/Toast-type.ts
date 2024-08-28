export type ToastType = 'error' | 'success' | 'info' | 'warning'
export interface ToastProps {
  title: string
  status: ToastType
  description?: string
  onClose: () => void
  dataTest?: string
}

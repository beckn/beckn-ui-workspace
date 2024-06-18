export type ToastType = 'error' | 'success' | 'info'
export interface ToastProps {
  title: string
  status: ToastType
  description?: string
  onClose: () => void
}

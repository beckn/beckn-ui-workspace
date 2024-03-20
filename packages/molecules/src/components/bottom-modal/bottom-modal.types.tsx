import { ReactNode } from 'react'

export interface BottomModalProps {
  onClose: () => void
  isOpen: boolean
  title?: string
  children: ReactNode
}

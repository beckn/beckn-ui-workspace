import { ReactElement, ReactNode } from 'react'

export interface BottomModalProps {
  onClose: () => void
  isOpen: boolean
  title?: string | ReactElement
  children: ReactNode
  responsive?: boolean
  responsiveBottomGap?: string
  dataTest?: string
  overlay?: boolean
}

import { ReactElement } from 'react'

export interface AccordionProps {
  children?: React.ReactNode
  accordionHeader?: string | ReactElement
  onToggle?: (expandedIndex: number | number[]) => void
  className?: string
}
